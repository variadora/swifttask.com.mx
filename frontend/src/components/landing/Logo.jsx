import React from "react";

// SWIFT TASK custom wordmark — blocky tech style with a glowing cyan node accent.
export const Logo = ({ className = "", showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`} aria-label="SWIFT TASK" data-testid="brand-logo">
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <rect x="1" y="1" width="30" height="30" rx="6" stroke="#1E2028" strokeWidth="1.5" />
        <path d="M9 21.5L14 10.5H16.5L11.5 21.5H9Z" fill="#F3F4F6" />
        <path d="M15.5 21.5L20.5 10.5H23L18 21.5H15.5Z" fill="#F3F4F6" />
        <rect x="22" y="18.5" width="3.2" height="3.2" rx="0.8" fill="#00E5FF" className="drop-shadow-[0_0_6px_rgba(0,229,255,0.9)]" />
      </svg>
      {showText && (
        <span className="font-heading font-black tracking-tight text-[15px] leading-none">
          <span className="text-white">SWIFT</span>
          <span className="text-white/40">TASK</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
