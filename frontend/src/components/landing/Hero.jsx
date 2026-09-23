import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { scrollToId } from "./scroll";

const HERO_BG =
  "https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGN5YmVyJTIwc2VjdXJpdHklMjBuZXR3b3JrfGVufDB8fHx8MTc5MDE5NzAyOHww&ixlib=rb-4.1.0&q=85";

const line = {
  hidden: { y: "110%" },
  show: (i) => ({
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 + i * 0.12 },
  }),
};

const MaskLine = ({ children, i }) => (
  <span className="block overflow-hidden pb-[0.08em]">
    <motion.span variants={line} custom={i} initial="hidden" animate="show" className="block">
      {children}
    </motion.span>
  </span>
);

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.82, 0.96]);

  const scrollTo = (href) => scrollToId(href);

  return (
    <section id="inicio" ref={ref} className="relative min-h-[100svh] flex items-end overflow-hidden" data-testid="hero-section">
      {/* Parallax background */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
      </motion.div>
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 z-10 bg-[#050505]" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_78%_18%,rgba(0,229,255,0.16),transparent_45%)]" />

      <div className="relative z-20 mx-auto max-w-[1280px] w-full px-6 lg:px-10 pb-20 pt-36">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="h-px w-10 bg-[#00E5FF]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#00E5FF]">
            SWIFT TASK · S.A. de C.V.
          </span>
        </motion.div>

        <h1 className="font-heading font-black tracking-tighter text-white text-[13vw] leading-[0.9] sm:text-[9vw] lg:text-[7.4vw] max-w-[15ch]">
          <MaskLine i={0}>Consultoría</MaskLine>
          <MaskLine i={1}>
            en <span className="text-[#00E5FF]">computación</span>
          </MaskLine>
          <MaskLine i={2}>de alto nivel</MaskLine>
        </h1>

        <div className="mt-10 flex flex-col lg:flex-row lg:items-end gap-8 lg:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.8 }}
            className="text-white/65 text-base sm:text-lg max-w-[46ch] leading-relaxed"
          >
            Diseñamos, aseguramos y escalamos la infraestructura tecnológica de tu empresa.
            Software a la medida, ciberseguridad y soporte experto — sin fricción.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => scrollTo("#contacto")}
              data-testid="hero-primary-cta"
              className="group inline-flex items-center gap-2 rounded-full bg-[#00E5FF] text-[#050505] font-mono text-xs uppercase tracking-[0.16em] px-7 py-4 hover:bg-white transition-colors duration-300"
            >
              Iniciar proyecto
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={() => scrollTo("#servicios")}
              data-testid="hero-secondary-cta"
              className="inline-flex items-center rounded-full border border-white/20 text-white font-mono text-xs uppercase tracking-[0.16em] px-7 py-4 hover:border-white/60 transition-colors duration-300"
            >
              Ver servicios
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
