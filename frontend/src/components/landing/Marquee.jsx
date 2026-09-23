import React from "react";

const ITEMS = [
  "ENCRYPTION: ACTIVE",
  "INFRASTRUCTURE: SCALABLE",
  "ZERO TRUST",
  "24/7 SOPORTE",
  "CLOUD NATIVE",
  "DEVOPS / CI-CD",
  "UPTIME 99.9%",
];

export const Marquee = () => {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative border-y border-[#1E2028] bg-[#0A0B0E] py-5 overflow-hidden" data-testid="marquee">
      <div className="st-marquee-track">
        {row.map((t, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-8 font-mono text-xs uppercase tracking-[0.2em] text-white/45">
            <span className="text-[#00E5FF]">[</span>
            {t}
            <span className="text-[#00E5FF]">]</span>
            <span className="text-white/15">///</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
