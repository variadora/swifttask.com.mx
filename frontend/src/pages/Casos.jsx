import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, TrendingUp, ShieldCheck, Zap, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const GLOBAL_STATS = [
  { k: "+120", v: "Proyectos entregados" },
  { k: "99.9%", v: "Disponibilidad promedio" },
  { k: "10", v: "Años de experiencia" },
  { k: "+80", v: "Clientes activos" },
];

const CASES = [
  {
    client: "NexaLogistics",
    sector: "Logística · Cloud",
    icon: Zap,
    title: "Migración a la nube sin downtime",
    challenge:
      "Infraestructura on-premise saturada que limitaba el crecimiento y generaba caídas en temporada alta.",
    solution:
      "Arquitectura cloud híbrida, migración por fases y automatización DevOps con CI/CD.",
    metrics: [
      { k: "0h", v: "Downtime en la migración" },
      { k: "+40%", v: "Rendimiento del sistema" },
      { k: "3 meses", v: "Tiempo de ejecución" },
    ],
    image:
      "https://images.pexels.com/photos/37730211/pexels-photo-37730211.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    tag: "Infraestructura & Redes",
  },
  {
    client: "Grupo Valta",
    sector: "Manufactura · Seguridad",
    icon: ShieldCheck,
    title: "Modelo Zero Trust de extremo a extremo",
    challenge:
      "Múltiples brechas de seguridad y ausencia de políticas de acceso claras entre plantas.",
    solution:
      "Implementación Zero Trust, segmentación de red, análisis de vulnerabilidades y respuesta a incidentes.",
    metrics: [
      { k: "-92%", v: "Incidentes de seguridad" },
      { k: "100%", v: "Cumplimiento normativo" },
      { k: "24/7", v: "Monitoreo activo" },
    ],
    image:
      "https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGN5YmVyJTIwc2VjdXJpdHklMjBuZXR3b3JrfGVufDB8fHx8MTc5MDE5NzAyOHww&ixlib=rb-4.1.0&q=85",
    tag: "Ciberseguridad",
  },
  {
    client: "Innova Retail",
    sector: "Retail · Software",
    icon: TrendingUp,
    title: "Plataforma de comercio a la medida",
    challenge:
      "Sistema legado incapaz de escalar durante campañas de alto tráfico y con baja conversión.",
    solution:
      "Desarrollo de plataforma cloud-native a la medida, con arquitectura escalable y analítica en tiempo real.",
    metrics: [
      { k: "+65%", v: "Tasa de conversión" },
      { k: "5x", v: "Capacidad de escala" },
      { k: "8 sem", v: "Time-to-market" },
    ],
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwyfHxzb2Z0d2FyZSUyMGNvZGUlMjBzY3JlZW58ZW58MHx8fHwxNzkwMTk3MDI4fDA&ixlib=rb-4.1.0&q=85",
    tag: "Software a la medida",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 } }),
};

export default function Casos() {
  return (
    <div className="st-grain bg-[#050505] min-h-screen" data-testid="casos-root">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 border-b border-[#1E2028]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(0,229,255,0.12),transparent_45%)]" />
        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10">
          <Link to="/" data-testid="casos-back-link" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/50 hover:text-[#00E5FF] transition-colors duration-300 mb-10">
            <ArrowLeft size={14} /> Volver al inicio
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[#00E5FF]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#00E5FF]">Casos de éxito</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-black tracking-tighter text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95] max-w-[20ch]"
          >
            Resultados que hablan por nosotros
          </motion.h1>
          <p className="text-white/60 leading-relaxed max-w-[52ch] mt-8 text-base sm:text-lg">
            Métricas reales de proyectos entregados a empresas que confiaron su tecnología a SWIFT TASK.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mt-14 bg-[#1E2028] border border-[#1E2028] rounded-xl overflow-hidden" data-testid="casos-global-stats">
            {GLOBAL_STATS.map((s) => (
              <div key={s.v} className="bg-[#0F1014] p-6">
                <div className="font-heading font-black text-[#00E5FF] text-3xl sm:text-4xl tracking-tight">{s.k}</div>
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45 mt-2">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 space-y-8">
          {CASES.map((c, i) => (
            <motion.article
              key={c.client}
              variants={reveal}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              data-testid={`case-card-${i}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-2xl border border-[#1E2028] bg-[#0F1014] overflow-hidden hover:border-[#00E5FF]/40 transition-colors duration-500"
            >
              {/* Image */}
              <div className={`lg:col-span-5 relative min-h-[260px] ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <img src={c.image} alt={c.client} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-[opacity,transform] duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1014] via-[#0F1014]/40 to-transparent" />
                <div className="relative p-8 h-full flex flex-col justify-between">
                  <c.icon className="text-[#00E5FF]" size={28} />
                  <div>
                    <div className="font-heading font-black text-white text-3xl tracking-tight">{c.client}</div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50 mt-2">{c.sector}</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-7 p-8 lg:p-10">
                <span className="inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-[#00E5FF] border border-[#00E5FF]/30 rounded-full px-3 py-1 mb-5">
                  {c.tag}
                </span>
                <h2 className="font-heading font-bold text-white text-2xl sm:text-3xl mb-5">{c.title}</h2>
                <div className="space-y-3 mb-8">
                  <p className="text-white/60 leading-relaxed"><span className="text-white/40 font-mono text-xs uppercase tracking-wider mr-2">Reto:</span>{c.challenge}</p>
                  <p className="text-white/60 leading-relaxed"><span className="text-white/40 font-mono text-xs uppercase tracking-wider mr-2">Solución:</span>{c.solution}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1E2028]">
                  {c.metrics.map((m) => (
                    <div key={m.v}>
                      <div className="font-heading font-black text-[#00E5FF] text-2xl sm:text-3xl tracking-tight">{m.k}</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/45 mt-1.5 leading-snug">{m.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 mt-16">
          <div className="rounded-2xl border border-[#1E2028] bg-[radial-gradient(circle_at_20%_20%,rgba(0,229,255,0.1),transparent_60%)] p-10 lg:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <h3 className="font-heading font-black tracking-tighter text-white text-3xl sm:text-4xl max-w-[20ch]">¿Listo para ser nuestro próximo caso de éxito?</h3>
              <p className="text-white/55 mt-4 max-w-[46ch]">Cuéntanos tu reto y diseñamos una propuesta a la medida.</p>
            </div>
            <Link
              to="/#contacto"
              data-testid="casos-cta"
              className="group shrink-0 inline-flex items-center gap-2 rounded-full bg-[#00E5FF] text-[#050505] font-mono text-xs uppercase tracking-[0.16em] px-8 py-4 hover:bg-white transition-colors duration-300"
            >
              Iniciar proyecto
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
