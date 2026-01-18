// Glassmorphism focus layer for modals
// Used only in booking flow
import React from "react";

const GlassFocusLayer: React.FC<{ onClick?: () => void; show?: boolean }> = ({ onClick, show = true }) => {
  if (!show) return null;
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className="fixed inset-0 z-40 flex items-center justify-center pointer-events-auto"
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background:
          "radial-gradient(ellipse at center, rgba(255,255,255,0.45) 60%, rgba(0,0,0,0.18) 100%)",
        transition: "opacity 0.3s cubic-bezier(.4,0,.2,1)",
        opacity: show ? 1 : 0,
      }}
      onClick={onClick}
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/10 to-black/20 rounded-none" />
    </div>
  );
};

export default GlassFocusLayer;
