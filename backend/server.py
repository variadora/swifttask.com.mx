from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import ipaddress
import secrets
import logging
import jwt
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# ---- Config ----
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"
ADMIN_PASSWORD = os.environ['ADMIN_PASSWORD']
_login_attempts: dict = {}

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "SWIFT TASK")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
TEAM_NOTIFY_EMAIL = os.environ.get("TEAM_NOTIFY_EMAIL")

# Create the main app without a prefix
app = FastAPI(title="SWIFT TASK API")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ---------------- Models ----------------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: Optional[str] = None
    service: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    company: Optional[str] = Field(None, max_length=160)
    service: Optional[str] = Field(None, max_length=80)
    message: str = Field(..., min_length=5, max_length=3000)


class AdminLogin(BaseModel):
    password: str = Field(..., min_length=1, max_length=200)


# ---------------- Admin auth ----------------
def create_admin_token() -> str:
    payload = {
        "sub": "admin",
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=8),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def require_admin(authorization: str = Header(default="")) -> dict:
    token = authorization[7:] if authorization.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="No autenticado")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Token inválido")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sesión expirada")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


# ---------------- Email (Emergent managed Resend) ----------------
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> Optional[str]:
    _assert_safe_email(subject, html)
    if not EMAIL_KEY:
        logger.warning("EMERGENT_EMAIL_KEY not set; skipping email send")
        return None
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if EMAIL_REPLY_TO:
        payload["contact_email"] = EMAIL_REPLY_TO
    async with httpx.AsyncClient(timeout=30) as http_client:
        resp = await http_client.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


def _confirmation_html(name: str, service: Optional[str], message: str) -> str:
    svc = f'<p style="margin:0 0 8px;color:#444">Servicio de interés: <strong>{escape(service)}</strong></p>' if service else ""
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#0b0c0f;padding:32px 0"><tr><td align="center">'
        '<table role="presentation" width="560" cellpadding="0" cellspacing="0" '
        'style="background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif">'
        '<tr><td style="background:#050505;padding:24px 32px">'
        '<span style="color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:1px">SWIFT</span>'
        '<span style="color:#00E5FF;font-size:18px;font-weight:bold;letter-spacing:1px">TASK</span>'
        '</td></tr>'
        '<tr><td style="padding:32px">'
        f'<h1 style="margin:0 0 16px;font-size:22px;color:#0b0c0f">¡Gracias, {escape(name)}!</h1>'
        '<p style="margin:0 0 12px;color:#444;line-height:1.6">Hemos recibido tu mensaje. '
        'Nuestro equipo de consultoría te contactará en menos de 24 horas hábiles con una propuesta clara.</p>'
        f'{svc}'
        '<p style="margin:16px 0 8px;color:#444">Tu mensaje:</p>'
        f'<blockquote style="margin:0;padding:12px 16px;background:#f4f5f7;border-left:3px solid #00E5FF;'
        f'color:#333;line-height:1.5;border-radius:4px">{escape(message)}</blockquote>'
        '<p style="margin:24px 0 0;color:#444">Un saludo,<br/>El equipo de <strong>SWIFT TASK, S.A. de C.V.</strong></p>'
        '</td></tr>'
        '<tr><td style="padding:20px 32px;background:#f4f5f7">'
        '<p style="margin:0;font-size:12px;color:#888;line-height:1.5">Enviado por SWIFT TASK. '
        'Este es un correo de confirmación automático; nunca te pediremos tu contraseña ni datos bancarios por este medio.</p>'
        '</td></tr>'
        '</table></td></tr></table>'
    )


def _team_alert_html(msg) -> str:
    company = f'<tr><td style="padding:4px 0;color:#888">Empresa</td><td style="padding:4px 0;color:#0b0c0f"><strong>{escape(msg.company)}</strong></td></tr>' if msg.company else ""
    service = f'<tr><td style="padding:4px 0;color:#888">Servicio</td><td style="padding:4px 0;color:#0b0c0f"><strong>{escape(msg.service)}</strong></td></tr>' if msg.service else ""
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#0b0c0f;padding:32px 0"><tr><td align="center">'
        '<table role="presentation" width="560" cellpadding="0" cellspacing="0" '
        'style="background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif">'
        '<tr><td style="background:#050505;padding:24px 32px">'
        '<span style="color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:1px">SWIFT</span>'
        '<span style="color:#00E5FF;font-size:18px;font-weight:bold;letter-spacing:1px">TASK</span>'
        '<span style="color:#888;font-size:12px;margin-left:12px">Alerta interna</span>'
        '</td></tr>'
        '<tr><td style="padding:32px">'
        '<h1 style="margin:0 0 16px;font-size:20px;color:#0b0c0f">Nuevo mensaje de contacto</h1>'
        '<table role="presentation" width="100%" style="font-size:14px;border-collapse:collapse">'
        f'<tr><td style="padding:4px 0;color:#888;width:110px">Nombre</td><td style="padding:4px 0;color:#0b0c0f"><strong>{escape(msg.name)}</strong></td></tr>'
        f'<tr><td style="padding:4px 0;color:#888">Correo</td><td style="padding:4px 0;color:#0b0c0f"><a href="mailto:{escape(msg.email)}" style="color:#0077aa">{escape(msg.email)}</a></td></tr>'
        f'{company}{service}'
        '</table>'
        '<p style="margin:20px 0 8px;color:#444">Mensaje:</p>'
        f'<blockquote style="margin:0;padding:12px 16px;background:#f4f5f7;border-left:3px solid #00E5FF;'
        f'color:#333;line-height:1.5;border-radius:4px">{escape(msg.message)}</blockquote>'
        '</td></tr>'
        '<tr><td style="padding:20px 32px;background:#f4f5f7">'
        '<p style="margin:0;font-size:12px;color:#888">Notificación automática del formulario de contacto de SWIFT TASK.</p>'
        '</td></tr>'
        '</table></td></tr></table>'
    )


# ---------------- Routes ----------------
@api_router.get("/")
async def root():
    return {"message": "SWIFT TASK API online"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(payload: ContactMessageCreate):
    msg = ContactMessage(**payload.model_dump())
    doc = msg.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    logger.info("New contact message from %s <%s>", msg.name, msg.email)

    # Send confirmation email to the submitter (non-blocking failure)
    try:
        await send_email(
            to=msg.email,
            subject="Recibimos tu mensaje · SWIFT TASK",
            html=_confirmation_html(msg.name, msg.service, msg.message),
        )
    except Exception as e:
        logger.error("Confirmation email failed for %s: %s", msg.email, e)

    # Send internal alert to the team (non-blocking failure)
    if TEAM_NOTIFY_EMAIL:
        try:
            await send_email(
                to=TEAM_NOTIFY_EMAIL,
                subject=f"Nuevo mensaje de contacto: {msg.name}",
                html=_team_alert_html(msg),
            )
        except Exception as e:
            logger.error("Team alert email failed: %s", e)

    return msg


@api_router.post("/admin/login")
async def admin_login(payload: AdminLogin, request: Request):
    ip = request.client.host if request.client else "unknown"
    now = datetime.now(timezone.utc)
    attempts = [t for t in _login_attempts.get(ip, []) if (now - t).total_seconds() < 60]
    if len(attempts) >= 5:
        raise HTTPException(status_code=429, detail="Demasiados intentos. Espera un minuto.")
    if not secrets.compare_digest(payload.password, ADMIN_PASSWORD):
        attempts.append(now)
        _login_attempts[ip] = attempts
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    _login_attempts.pop(ip, None)
    return {"token": create_admin_token(), "token_type": "bearer"}


@api_router.get("/admin/messages", response_model=List[ContactMessage])
async def get_contact_messages(_: dict = Depends(require_admin)):
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for m in messages:
        if isinstance(m['created_at'], str):
            m['created_at'] = datetime.fromisoformat(m['created_at'])
    return messages


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
