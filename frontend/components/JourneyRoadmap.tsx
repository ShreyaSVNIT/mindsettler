"use client";

import React, { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useInView
} from "framer-motion";

/* ---------------------------------- */
/* Timeline Section */
/* ---------------------------------- */

interface SectionProps {
  step: string;
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
}

const TimelineSection: React.FC<SectionProps> = ({
  step,
  title,
  description,
  image,
  reverse
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-25% 0px -25% 0px" });

  return (
    <div
      ref={ref}
      className={`relative flex ${
        reverse ? "justify-end" : "justify-start"
      } mb-[280px]`}
    >
      {/* TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.25, duration: 0.6 }}
        className={`max-w-md ${reverse ? "pr-12 text-right" : "pl-12 text-left"}`}
      >
        <p className="text-xs tracking-[0.45em] opacity-60 mb-4 font-body">
          {step}
        </p>

        <h3 className="font-title text-4xl text-[var(--color-primary)] mb-6">
          {title}
        </h3>

        <p className="font-body text-[var(--color-text-body)] opacity-80 leading-relaxed mb-10">
          {description}
        </p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.45 }}
          className="uppercase tracking-[0.3em] text-xs border-b-2 border-[var(--color-primary)] pb-1 hover:text-[var(--color-primary-hover)] hover:border-[var(--color-primary-hover)] transition-all"
        >
          Begin This Phase
        </motion.button>
      </motion.div>
    </div>
  );
};


export default function MindSettlerJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  /* ---------------- SCROLL ---------------- */

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  /* Compress scroll so path finishes earlier */
  const pathProgress = useTransform(
    scrollYProgress,
    [0.05, 0.85],
    [0, 1]
  );


  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useMotionValueEvent(pathProgress, "change", (latest) => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    const point = path.getPointAtLength(latest * length);

    x.set(point.x);
    y.set(point.y);
  });

  /* ---------------- PERFECT PATH ---------------- */

  const pathD = `
    M 500 0
    C 960 333, 960 666, 500 1000
    C 40 1333, 40 1666, 500 2000
    C 960 2333, 960 2666, 500 3000
  `;

  return (
    <div
      ref={containerRef}
      className="relative w-full py-32 bg-[var(--color-bg-subtle)] overflow-hidden"
    >
      {/* PATH + DOT */}
      <div className="absolute inset-0 flex justify-center pointer-events-none">
        <svg
          viewBox="0 0 1000 3000"
          preserveAspectRatio="none"
          className="w-full max-w-[1000px] h-full"
        >
          {/* BASE PATH */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="2"
            strokeDasharray="6 14"
          />

          {/* ACTIVE PATH */}
          <motion.path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="3"
            style={{ pathLength: pathProgress }}
          />

          {/* MILESTONES */}
          {[1000, 2000, 3000].map((yPos, i) => (
            <circle
              key={i}
              cx="500"
              cy={yPos}
              r="11"
              fill="var(--color-primary)"
              opacity="0.85"
            />
          ))}

          {/* DOT — SVG-LOCKED */}
          <motion.circle
            cx={x}
            cy={y}
            r="12"
            fill="var(--color-primary)"
          />
        </svg>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-12">
        {/* HEADER */}
        <div className="text-center mb-32">
          <p className="uppercase tracking-widest text-xs opacity-60 mb-5">
            Guided Wellness Journey
          </p>
          <h2 className="font-title text-5xl text-[var(--color-text-body)] mb-4">
            Your Path to Balance
          </h2>
          <p className="opacity-70 font-body">
            Each stage builds clarity, resilience, and long-term stability.
          </p>
        </div>

        {/* SECTIONS */}
        <TimelineSection
          step="STEP 01"
          title="Self-Discovery"
          description="Understand emotional patterns and mental triggers through guided reflection."
          image="https://images.unsplash.com/photo-1518063319789-7217e6706b04"
        />

        <TimelineSection
          reverse
          step="STEP 02"
          title="Inner Resilience"
          description="Build coping systems that regulate stress and restore emotional strength."
          image="https://images.unsplash.com/photo-1499209974431-9dac3adaf471"
        />

        <TimelineSection
          step="STEP 03"
          title="Sustainable Wellness"
          description="Turn insight into habits that support lasting mental clarity and balance."
          image="https://images.unsplash.com/photo-1506126613408-eca07ce68773"
        />
      </div>
    </div>
  );
}
