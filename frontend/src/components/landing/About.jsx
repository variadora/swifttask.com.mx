import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const IMG_TEAM =
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbHMlMjBtZWV0aW5nfGVufDB8fHx8MTc5MDE5NzAyOXww&ixlib=rb-4.1.0&q=85";

const STATS = [
  { k: "+120", v: "Proyectos entregados" },
  { k: "10", v: "Años de experiencia" },
  { k: "99.9%", v: "Disponibilidad" },
  { k: "24/7", v: "Monitoreo activo" },
];

export const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="nosotros" className="relative py-28 lg:py-36 border-t border-[#1E2028]" data-testid="about-section">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
        <div className="lg:col-span-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-[#00E5FF]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#00E5FF]">02 / Nosotros</span>
          </div>
          <h2 className="font-heading font-black tracking-tighter text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95] mb-8">
            Tecnología que se adelanta al negocio
          </h2>
          <div className="space-y-5 text-white/60 leading-relaxed max-w-[52ch]">
            <p>
              En <span className="text-white">SWIFT TASK, S.A. de C.V.</span> combinamos rigor de ingeniería con visión
              estratégica. No solo resolvemos incidentes: construimos arquitecturas que crecen contigo.
            </p>
            <p>
              Nuestro equipo multidisciplinario acompaña a cada cliente desde el diagnóstico hasta la operación,
              con procesos medibles, transparencia total y foco absoluto en resultados.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px mt-12 bg-[#1E2028] border border-[#1E2028] rounded-xl overflow-hidden" data-testid="about-stats">
            {STATS.map((s) => (
              <div key={s.v} className="bg-[#0F1014] p-6">
                <div className="font-heading font-black text-[#00E5FF] text-3xl sm:text-4xl tracking-tight">{s.k}</div>
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45 mt-2">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-2xl border border-[#1E2028]">
            <motion.img
              style={{ y }}
              src={IMG_TEAM}
              alt="Equipo SWIFT TASK"
              className="w-full h-[520px] object-cover grayscale scale-110 hover:grayscale-0 transition-[filter] duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">Ciudad de México · MX</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00E5FF]">EST. 2016</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
