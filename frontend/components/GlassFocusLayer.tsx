// Glassmorphism focus layer for modals
// Used by chatbot and booking flow overlays
import React, { useEffect, useState } from "react";

const GlassFocusLayer: React.FC<{ onClick?: () => void; show?: boolean }> = ({ onClick, show = true }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(Boolean((e as any).matches ?? e.matches));
    // initialize
    setIsMobile(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler as any);
      else mq.removeListener(handler as any);
    };
  }, []);

  if (!show) return null;

  // Balanced glass: softened blur/opacity like before, but with a cleaner sheen
  const blur = isMobile ? 10 : 14;
  const opacity = isMobile ? 0.28 : 0.38;
  // Use a simple translucent white base instead of a strong radial gradient
  const baseBackground = isMobile ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.12)";

  return (
    <div
      aria-hidden="true"
      role="presentation"
      tabIndex={-1}
      className="fixed inset-0 z-40 flex items-center justify-center pointer-events-auto"
      style={{
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        background: baseBackground,
        transition: "opacity 0.22s ease",
        opacity: opacity,
      }}
      onClick={onClick}
    >
      {/* Sheen: a clean angled white sheen for shine (not a heavy gradient) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(120deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 30%)",
          mixBlendMode: "overlay",
          opacity: isMobile ? 0.45 : 0.6,
        }}
      />

      {/* Subtle vignette for depth (very light) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isMobile
            ? "radial-gradient(circle at 50% 40%, rgba(0,0,0,0.06), rgba(0,0,0,0))"
            : "radial-gradient(circle at 50% 40%, rgba(0,0,0,0.08), rgba(0,0,0,0))",
          opacity: isMobile ? 0.9 : 0.9,
        }}
      />

      {/* Very faint noise for texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.008) 0 1px, rgba(0,0,0,0.008) 1px 8px)",
          opacity: 0.04,
        }}
      />
    </div>
  );
};

export default GlassFocusLayer;
