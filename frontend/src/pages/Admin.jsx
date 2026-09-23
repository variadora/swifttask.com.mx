import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Lock, LogOut, RefreshCw, Mail, Building2, Loader2, Inbox } from "lucide-react";
import { Input } from "../components/ui/input";
import { Logo } from "../components/landing/Logo";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const TOKEN_KEY = "st_admin_token";

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [fetching, setFetching] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setMessages([]);
  }, []);

  const fetchMessages = useCallback(async (tk) => {
    setFetching(true);
    try {
      const { data } = await axios.get(`${API}/admin/messages`, {
        headers: { Authorization: `Bearer ${tk}` },
      });
      setMessages(data);
    } catch (e) {
      if (e.response?.status === 401) {
        toast.error("Sesión expirada. Inicia sesión de nuevo.");
        logout();
      } else {
        toast.error("No se pudieron cargar los mensajes.");
      }
    } finally {
      setFetching(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) fetchMessages(token);
  }, [token, fetchMessages]);

  const login = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/admin/login`, { password });
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setPassword("");
      toast.success("Bienvenido al panel.");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Contraseña incorrecta.");
    } finally {
      setLoading(false);
    }
  };

  const fmtDate = (iso) =>
    new Date(iso).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });

  if (!token) {
    return (
      <div className="min-h-screen bg-[#050505] st-grain flex items-center justify-center px-6" data-testid="admin-login-view">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,229,255,0.08),transparent_50%)]" />
        <motion.form
          onSubmit={login}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[420px] rounded-2xl border border-[#1E2028] bg-[#0F1014] p-8 sm:p-10"
          data-testid="admin-login-form"
        >
          <div className="mb-8"><Logo /></div>
          <div className="grid place-items-center h-12 w-12 rounded-full border border-[#1E2028] text-[#00E5FF] mb-6">
            <Lock size={20} />
          </div>
          <h1 className="font-heading font-black tracking-tight text-white text-3xl mb-2">Panel de mensajes</h1>
          <p className="text-white/50 text-sm mb-8">Ingresa la contraseña de administrador para ver los mensajes recibidos.</p>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Contraseña</span>
            <Input
              data-testid="admin-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="st-input mt-2"
              autoFocus
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            data-testid="admin-login-button"
            className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#00E5FF] text-[#050505] font-mono text-xs uppercase tracking-[0.16em] px-8 py-4 hover:bg-white transition-colors duration-300 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Entrar"}
          </button>
          <a href="/" data-testid="admin-back-home" className="mt-6 block text-center font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 hover:text-white/70 transition-colors duration-300">
            ← Volver al sitio
          </a>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] st-grain" data-testid="admin-dashboard">
      <header className="sticky top-0 z-40 bg-[#050505]/70 backdrop-blur-xl border-b border-[#1E2028]">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10 h-[68px] flex items-center justify-between">
          <a href="/"><Logo /></a>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchMessages(token)}
              data-testid="admin-refresh-button"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] px-4 py-2.5 rounded-full border border-[#1E2028] text-white/70 hover:border-white/40 transition-colors duration-300"
            >
              <RefreshCw size={14} className={fetching ? "animate-spin" : ""} /> Actualizar
            </button>
            <button
              onClick={logout}
              data-testid="admin-logout-button"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] px-4 py-2.5 rounded-full border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#050505] transition-colors duration-300"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-6 lg:px-10 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-10 bg-[#00E5FF]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#00E5FF]">Administración</span>
            </div>
            <h1 className="font-heading font-black tracking-tighter text-white text-4xl sm:text-5xl">Mensajes recibidos</h1>
          </div>
          <div className="text-right" data-testid="admin-message-count">
            <div className="font-heading font-black text-[#00E5FF] text-4xl">{messages.length}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">Total</div>
          </div>
        </div>

        {fetching && messages.length === 0 ? (
          <div className="flex items-center justify-center py-24 text-white/40" data-testid="admin-loading">
            <Loader2 className="animate-spin" size={28} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/40 border border-dashed border-[#1E2028] rounded-2xl" data-testid="admin-empty">
            <Inbox size={40} className="mb-4" />
            <p className="font-mono text-xs uppercase tracking-[0.16em]">Aún no hay mensajes</p>
          </div>
        ) : (
          <div className="grid gap-4" data-testid="admin-messages-list">
            {messages.map((m) => (
              <motion.article
                key={m.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-[#1E2028] bg-[#0F1014] p-6 hover:border-[#00E5FF]/30 transition-colors duration-300"
                data-testid={`admin-message-${m.id}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-heading font-bold text-white text-xl">{m.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2 text-white/55 text-sm">
                      <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 hover:text-[#00E5FF] transition-colors duration-300">
                        <Mail size={14} /> {m.email}
                      </a>
                      {m.company && (
                        <span className="inline-flex items-center gap-1.5"><Building2 size={14} /> {m.company}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {m.service && (
                      <span className="inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-[#00E5FF] border border-[#00E5FF]/30 rounded-full px-3 py-1">
                        {m.service}
                      </span>
                    )}
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/35 mt-2">{fmtDate(m.created_at)}</div>
                  </div>
                </div>
                <p className="text-white/70 leading-relaxed border-l-2 border-[#1E2028] pl-4">{m.message}</p>
              </motion.article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
