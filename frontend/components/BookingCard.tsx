"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface BookingCardProps {
  children?: ReactNode;
  className?: string;
  variant?: "lavender" | "white";
}

export default function BookingCard({ children, className = "", variant = "lavender" }: BookingCardProps) {
  const base = variant === "lavender"
    ? "bg-[var(--color-bg-lavender)] border-2 border-[var(--color-text-body)]/20 rounded-3xl p-10 text-center shadow-xl"
    : "bg-white/95 rounded-3xl shadow-xl p-8";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`${base} ${className}`}
    >
      {children}
    </motion.div>
  );
}
