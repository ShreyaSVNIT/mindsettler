"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  value: string; // accepts strings like '40%' or '95'
  duration?: number;
  className?: string;
};

function parseNumber(input: string) {
  const numeric = parseFloat(input.replace(/[^0-9.-]+/g, ""));
  const suffix = input.replace(/[-0-9.]/g, "");
  return { numeric: isNaN(numeric) ? 0 : numeric, suffix };
}

export default function AnimatedCounter({ value, duration = 1200, className = "" }: Props) {
  const { numeric, suffix } = parseNumber(value);
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    function step(ts: number) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - (startRef.current || 0);
      const progress = Math.min(1, elapsed / duration);
      setDisplay(Math.round(numeric * progress));
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [numeric, duration]);

  return (
    <span className={className}>
      {display}
      {suffix}
    </span>
  );
}
