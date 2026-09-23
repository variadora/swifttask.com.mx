# PRD — SWIFT TASK, S.A. de C.V. · Landing Page

## Original Problem Statement
"SWIFT TASK, S.A. de C.V. crea su landing page de Servicios de consultoría en computación."

## User Choices
- Servicios: todos (Infraestructura & Redes, Software a la medida, Ciberseguridad, Soporte técnico)
- Secciones: Inicio, Servicios, Nosotros, Contacto
- Formulario de contacto funcional que guarda los mensajes
- Estilo: moderno-tecnológico + corporativo profesional (tema oscuro, acento cian)
- Datos de contacto: ejemplo (contacto@swifttask.mx, +52 55 1234 5678, CDMX)

## Architecture
- Frontend: React 19 + Tailwind, framer-motion (reveals/parallax), Lenis (smooth scroll), sonner (toasts), shadcn UI.
- Backend: FastAPI, endpoints `/api/contact` (POST/GET) con validación Pydantic.
- DB: MongoDB, colección `contact_messages`.
- Fuentes: Chivo (títulos), IBM Plex Sans (cuerpo), JetBrains Mono (labels). Logo SVG propio + favicon.

## Implemented (2026-06)
- Hero cinético con reveal enmascarado línea a línea + parallax de fondo.
- Marquee editorial de términos técnicos.
- Servicios en bento asimétrico (4 tarjetas con imágenes/overlay).
- Sección Nosotros con stats y parallax de imagen.
- Formulario de contacto funcional (guarda en Mongo, toasts, chips de servicio) + validación.
- Navbar glass sticky con navegación Lenis, footer, grain overlay.
- Verificado por testing agent: backend 100%, frontend 100%.

## Backlog (P1/P2)
- P1: Panel admin para ver mensajes recibidos (GET /api/contact ya existe).
- P1: Sección de testimonios / casos de éxito.
- P2: Datos de contacto reales, integración de email (Resend), multilenguaje EN/ES.

## Next Tasks
- Ver mensajes recibidos en un panel simple.
- Testimonios y logos de clientes.
