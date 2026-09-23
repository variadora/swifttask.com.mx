import React from "react";
import { motion } from "framer-motion";
import { Server, Code2, ShieldCheck, Headphones, ArrowUpRight } from "lucide-react";

const IMG_INFRA =
  "https://images.pexels.com/photos/37730211/pexels-photo-37730211.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
const IMG_SOFTWARE =
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwyfHxzb2Z0d2FyZSUyMGNvZGUlMjBzY3JlZW58ZW58MHx8fHwxNzkwMTk3MDI4fDA&ixlib=rb-4.1.0&q=85";

const reveal = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 } }),
};

const Card = ({ children, className = "", i, testid }) => (
  <motion.div
    variants={reveal}
    custom={i}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-80px" }}
    data-testid={testid}
    className={`group relative overflow-hidden rounded-2xl border border-[#1E2028] bg-[#0F1014] transition-colors duration-500 hover:border-[#00E5FF]/40 ${className}`}
  >
    {children}
  </motion.div>
);

export const Services = () => {
  return (
    <section id="servicios" className="relative py-28 lg:py-36" data-testid="services-section">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-[#00E5FF]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#00E5FF]">01 / Servicios</span>
            </div>
            <h2 className="font-heading font-black tracking-tighter text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95] max-w-[16ch]">
              Un socio tecnológico integral
            </h2>
          </div>
          <p className="text-white/55 max-w-[38ch] leading-relaxed lg:text-right">
            Cuatro disciplinas, un solo equipo. Cubrimos el ciclo completo de tu operación digital.
          </p>
        </div>

        {/* Tetris bento */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Infraestructura — large with image */}
          <Card i={0} testid="service-card-infra" className="md:col-span-7 min-h-[380px] flex flex-col justify-between">
            <img src={IMG_INFRA} alt="Infraestructura y redes" className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 group-hover:scale-105 transition-[opacity,transform] duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1014] via-[#0F1014]/70 to-[#0F1014]/30" />
            <div className="relative p-8">
              <Server className="text-[#00E5FF]" size={26} />
            </div>
            <div className="relative p-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Consultoría IT</span>
              <h3 className="font-heading font-bold text-white text-2xl sm:text-3xl mt-3 mb-3">Infraestructura & Redes</h3>
              <p className="text-white/60 max-w-[44ch] leading-relaxed">
                Arquitectura on-premise y cloud, virtualización, redes seguras y migraciones sin interrupción del negocio.
              </p>
            </div>
          </Card>

          {/* Software */}
          <Card i={1} testid="service-card-software" className="md:col-span-5 min-h-[380px] flex flex-col justify-between">
            <img src={IMG_SOFTWARE} alt="Desarrollo de software" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-[opacity,transform] duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1014] via-[#0F1014]/75 to-[#0F1014]/40" />
            <div className="relative p-8">
              <Code2 className="text-[#00E5FF]" size={26} />
            </div>
            <div className="relative p-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Ingeniería</span>
              <h3 className="font-heading font-bold text-white text-2xl sm:text-3xl mt-3 mb-3">Software a la medida</h3>
              <p className="text-white/60 max-w-[40ch] leading-relaxed">
                Aplicaciones web, móviles e integraciones diseñadas para tus procesos, con estándares de calidad de producto.
              </p>
            </div>
          </Card>

          {/* Ciberseguridad */}
          <Card i={2} testid="service-card-security" className="md:col-span-5 min-h-[300px] p-8 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <ShieldCheck className="text-[#00E5FF]" size={26} />
              <ArrowUpRight className="text-white/30 group-hover:text-[#00E5FF] transition-colors duration-300" size={20} />
            </div>
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Protección</span>
              <h3 className="font-heading font-bold text-white text-2xl sm:text-3xl mt-3 mb-3">Ciberseguridad</h3>
              <p className="text-white/60 max-w-[42ch] leading-relaxed">
                Modelo Zero Trust, análisis de vulnerabilidades, respuesta a incidentes y cumplimiento normativo.
              </p>
            </div>
          </Card>

          {/* Soporte */}
          <Card i={3} testid="service-card-support" className="md:col-span-7 min-h-[300px] p-8 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <Headphones className="text-[#00E5FF]" size={26} />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00E5FF]/70">99.9% UPTIME</span>
            </div>
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Operación continua</span>
              <h3 className="font-heading font-bold text-white text-2xl sm:text-3xl mt-3 mb-3">Soporte técnico gestionado</h3>
              <p className="text-white/60 max-w-[52ch] leading-relaxed">
                Mesa de ayuda, monitoreo proactivo y mantenimiento 24/7 para que tu equipo nunca pierda el ritmo.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services;
