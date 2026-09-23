import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Alejandro Ríos",
    role: "CTO · NexaLogistics",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MHx8fHwxNzkwMTk4NDY0fDA&ixlib=rb-4.1.0&q=85",
    quote:
      "SWIFT TASK migró toda nuestra infraestructura a la nube sin una sola hora de downtime. El acompañamiento fue impecable de principio a fin.",
  },
  {
    name: "Daniela Fuentes",
    role: "Directora de TI · Grupo Valta",
    avatar: "https://images.unsplash.com/photo-1685760259914-ee8d2c92d2e0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MHx8fHwxNzkwMTk4NDY0fDA&ixlib=rb-4.1.0&q=85",
    quote:
      "Su equipo de ciberseguridad detectó vulnerabilidades que nadie había visto en años. Hoy operamos con un modelo Zero Trust real.",
  },
  {
    name: "Marcos Beltrán",
    role: "CEO · Innova Retail",
    avatar: "https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MHx8fHwxNzkwMTk4NDY0fDA&ixlib=rb-4.1.0&q=85",
    quote:
      "Desarrollaron nuestra plataforma a la medida en tiempo récord. Escaló sin problemas en la temporada más alta del año.",
  },
];

const LOGOS = ["NEXALOGISTICS", "GRUPO VALTA", "INNOVA RETAIL", "CODEX FINANCE", "AURA HEALTH", "MERIDIAN"];

const reveal = {
  hidden: { opacity: 0, y: 36 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 } }),
};

export const Testimonials = () => {
  const logoRow = [...LOGOS, ...LOGOS];
  return (
    <section id="testimonios" className="relative py-28 lg:py-36 border-t border-[#1E2028]" data-testid="testimonials-section">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-[#00E5FF]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#00E5FF]">03 / Testimonios</span>
            </div>
            <h2 className="font-heading font-black tracking-tighter text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95] max-w-[18ch]">
              Empresas que confían en nosotros
            </h2>
          </div>
          <div className="flex items-center gap-2" data-testid="testimonials-rating">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="text-[#00E5FF] fill-[#00E5FF]" />
            ))}
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/50 ml-2">4.9 / 5 · +80 clientes</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.article
              key={t.name}
              variants={reveal}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="group relative rounded-2xl border border-[#1E2028] bg-[#0F1014] p-8 flex flex-col justify-between hover:border-[#00E5FF]/40 transition-colors duration-500"
              data-testid={`testimonial-card-${i}`}
            >
              <Quote className="text-[#00E5FF]/40 group-hover:text-[#00E5FF] transition-colors duration-300" size={28} />
              <p className="text-white/75 leading-relaxed my-6 text-[15px]">"{t.quote}"</p>
              <div className="flex items-center gap-4 pt-6 border-t border-[#1E2028]">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-12 w-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-500 border border-[#1E2028]"
                />
                <div>
                  <div className="font-heading font-bold text-white text-base leading-tight">{t.name}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45 mt-1">{t.role}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Client logo marquee */}
      <div className="mt-20 border-y border-[#1E2028] bg-[#0A0B0E] py-8 overflow-hidden" data-testid="client-logos">
        <div className="st-marquee-track">
          {logoRow.map((l, i) => (
            <span
              key={i}
              className="mx-12 inline-flex items-center font-heading font-black tracking-tighter text-2xl text-white/25 hover:text-white/60 transition-colors duration-300"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
