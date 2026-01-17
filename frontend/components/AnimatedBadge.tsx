"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  sizeClass?: string;
};

export default function AnimatedBadge({
  children,
  className = "",
  sizeClass = "w-6 h-6 text-xs",
}: Props) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full relative overflow-hidden group ${sizeClass} ${className}`}
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      {/* fill layer slides up from below on hover */}
      <span className="absolute inset-0 bg-[var(--color-bg-app)] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out will-change-transform" />

      {/* number/text sits above the fill */}
      <span className="relative z-10 text-white group-hover:text-[var(--color-primary)] transition-colors duration-300 font-semibold flex items-center justify-center">
        {children}
      </span>
    </span>
  );
}
