import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowUpRight, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SERVICES = [
  "Infraestructura & Redes",
  "Software a la medida",
  "Ciberseguridad",
  "Soporte técnico gestionado",
  "No estoy seguro / Asesoría",
];

const CONTACTS = [
  { icon: Mail, label: "Correo", value: "contacto@swifttask.mx", testid: "contact-email" },
  { icon: Phone, label: "Teléfono", value: "+52 55 1234 5678", testid: "contact-phone" },
  { icon: MapPin, label: "Oficina", value: "Ciudad de México, MX", testid: "contact-location" },
];

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || form.message.trim().length < 5) {
      toast.error("Completa nombre, correo y un mensaje válido.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, { ...form, service: selected || null });
      toast.success("¡Mensaje enviado! Te contactaremos muy pronto.");
      setForm({ name: "", email: "", company: "", service: "", message: "" });
      setSelected("");
    } catch (err) {
      toast.error("No se pudo enviar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="relative py-28 lg:py-36 border-t border-[#1E2028]" data-testid="contact-section">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-14">
        {/* Left copy */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[#00E5FF]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#00E5FF]">03 / Contacto</span>
          </div>
          <h2 className="font-heading font-black tracking-tighter text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95] mb-8">
            Hablemos de tu proyecto
          </h2>
          <p className="text-white/60 leading-relaxed max-w-[42ch] mb-12">
            Cuéntanos tu reto tecnológico. Respondemos en menos de 24 horas hábiles con una propuesta clara.
          </p>

          <div className="space-y-6">
            {CONTACTS.map((c) => (
              <div key={c.testid} className="flex items-center gap-4" data-testid={c.testid}>
                <div className="grid place-items-center h-11 w-11 rounded-full border border-[#1E2028] text-[#00E5FF]">
                  <c.icon size={18} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{c.label}</div>
                  <div className="text-white/90">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 rounded-2xl border border-[#1E2028] bg-[#0F1014] p-8 sm:p-10"
          data-testid="contact-form"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Nombre completo *">
              <Input data-testid="contact-input-name" value={form.name} onChange={update("name")} placeholder="Tu nombre" className="st-input" />
            </Field>
            <Field label="Correo electrónico *">
              <Input data-testid="contact-input-email" type="email" value={form.email} onChange={update("email")} placeholder="tucorreo@empresa.com" className="st-input" />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Empresa">
              <Input data-testid="contact-input-company" value={form.company} onChange={update("company")} placeholder="Nombre de tu empresa" className="st-input" />
            </Field>
          </div>

          <div className="mt-7">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Servicio de interés</span>
            <div className="flex flex-wrap gap-2.5 mt-3">
              {SERVICES.map((s) => (
                <button
                  type="button"
                  key={s}
                  data-testid={`contact-service-${s.slice(0, 6).toLowerCase().replace(/\s/g, "-")}`}
                  onClick={() => setSelected((v) => (v === s ? "" : s))}
                  className={`font-mono text-[11px] uppercase tracking-[0.12em] px-4 py-2 rounded-full border transition-colors duration-300 ${
                    selected === s
                      ? "bg-[#00E5FF] text-[#050505] border-[#00E5FF]"
                      : "border-[#1E2028] text-white/60 hover:border-white/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <Field label="Mensaje *">
              <Textarea
                data-testid="contact-input-message"
                value={form.message}
                onChange={update("message")}
                rows={5}
                placeholder="Describe tu proyecto o necesidad..."
                className="st-input resize-none"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="contact-submit-button"
            className="group mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#00E5FF] text-[#050505] font-mono text-xs uppercase tracking-[0.16em] px-8 py-4 hover:bg-white transition-colors duration-300 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Enviar mensaje <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></>}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{label}</span>
    <div className="mt-2">{children}</div>
  </label>
);

export default Contact;
