import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Quote, Star, ArrowLeft, ArrowRight } from "lucide-react";

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
  {
    name: "Paola Mendoza",
    role: "COO · Meridian Group",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDB8fHx8MTc5MDE5ODQ2NHww&ixlib=rb-4.1.0&q=85",
    quote:
      "El soporte gestionado 24/7 cambió por completo nuestra operación. Los tiempos de respuesta bajaron de horas a minutos.",
  },
  {
    name: "Ricardo Salas",
    role: "Gerente de Sistemas · Codex Finance",
    avatar: "https://images.pexels.com/photos/17049771/pexels-photo-17049771.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    quote:
      "Profesionalismo total. Nos ayudaron a cumplir con auditorías regulatorias que parecían imposibles en nuestro sector financiero.",
  },
  {
    name: "Verónica Luna",
    role: "Fundadora · Aura Health",
    avatar: "https://images.pexels.com/photos/37148308/pexels-photo-37148308.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    quote:
      "Desde el diagnóstico hasta la operación, sentimos que teníamos un socio real. Recomiendo a SWIFT TASK sin dudarlo.",
  },
];

const LOGOS = ["NEXALOGISTICS", "GRUPO VALTA", "INNOVA RETAIL", "CODEX FINANCE", "AURA HEALTH", "MERIDIAN"];

export const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState([]);

  const onSelect = useCallback((api) => setSelected(api.selectedScrollSnap()), []);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const logoRow = [...LOGOS, ...LOGOS];

  return (
    <section id="testimonios" className="relative py-28 lg:py-36 border-t border-[#1E2028]" data-testid="testimonials-section">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-[#00E5FF]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#00E5FF]">03 / Testimonios</span>
            </div>
            <h2 className="font-heading font-black tracking-tighter text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95] max-w-[18ch]">
              Empresas que confían en nosotros
            </h2>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-4">
            <div className="flex items-center gap-2" data-testid="testimonials-rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="text-[#00E5FF] fill-[#00E5FF]" />
              ))}
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/50 ml-2">4.9 / 5 · +80 clientes</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={scrollPrev}
                data-testid="testimonials-prev"
                aria-label="Anterior"
                className="grid place-items-center h-11 w-11 rounded-full border border-[#1E2028] text-white/70 hover:border-[#00E5FF]/60 hover:text-[#00E5FF] transition-colors duration-300"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={scrollNext}
                data-testid="testimonials-next"
                aria-label="Siguiente"
                className="grid place-items-center h-11 w-11 rounded-full border border-[#1E2028] text-white/70 hover:border-[#00E5FF]/60 hover:text-[#00E5FF] transition-colors duration-300"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Embla carousel */}
        <div className="overflow-hidden" ref={emblaRef} data-testid="testimonials-carousel">
          <div className="flex gap-5 touch-pan-y">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3" data-testid={`testimonial-card-${i}`}>
                <article className="group h-full rounded-2xl border border-[#1E2028] bg-[#0F1014] p-8 flex flex-col justify-between hover:border-[#00E5FF]/40 transition-colors duration-500">
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
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-8" data-testid="testimonials-dots">
          {snaps.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi && emblaApi.scrollTo(i)}
              aria-label={`Ir al testimonio ${i + 1}`}
              data-testid={`testimonials-dot-${i}`}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                selected === i ? "w-8 bg-[#00E5FF]" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Client logo marquee */}
      <div className="mt-20 border-y border-[#1E2028] bg-[#0A0B0E] py-8 overflow-hidden" data-testid="client-logos">
        <div className="st-marquee-track">
          {logoRow.map((l, i) => (
            <motion.span
              key={i}
              className="mx-12 inline-flex items-center font-heading font-black tracking-tighter text-2xl text-white/25 hover:text-white/60 transition-colors duration-300"
            >
              {l}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
