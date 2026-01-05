"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useInView
} from "framer-motion";
import MagneticButton from "./Button";

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
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px", once: true });

  return (
    <div
      ref={ref}
      className={`relative flex flex-col items-center ${reverse ? "md:flex-row-reverse" : "md:flex-row"
        } gap-12 md:gap-24 mb-64 last:mb-0`}
    >
      {/* IMAGE SIDE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: reverse ? -2 : 2 }}
        animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full md:w-1/2 relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-purple-600 opacity-20 blur-2xl rounded-3xl -z-10 group-hover:opacity-30 transition-opacity duration-500" />
        <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl aspect-[4/3] md:aspect-[16/10]">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
        </div>
      </motion.div>

      {/* CONTENT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full md:w-1/2"
      >
        <div className="md:px-8">
          <p className="text-xs font-bold tracking-[0.3em] text-[var(--color-primary)] mb-4 uppercase">
            {step}
          </p>

          <h3 className="font-title text-4xl md:text-5xl text-[var(--color-text-body)] mb-6 leading-tight">
            {title}
          </h3>

          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-8 hover:bg-white/10 transition-colors duration-300">
            <p className="font-body text-lg text-[var(--color-text-body)] opacity-80 leading-relaxed">
              {description}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            <MagneticButton text="Learn More" />
          </motion.div>
        </div>
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

  /* Compress scroll so path finishes earlier and stays visible longer */
  const pathProgress = useTransform(
    scrollYProgress,
    [0.1, 0.9],
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
    x.set(point.x);
    y.set(point.y);
  });

  /* ---------------- HEADER ANIMATION ---------------- */
  /* Starts centered (x offset) and splits as pathProgress increases */
  const titleX = useTransform(pathProgress, [0, 0.1], [100, 0]); // Move Left
  const descX = useTransform(pathProgress, [0, 0.1], [-100, 0]); // Move Right
  const headerOpacity = useTransform(pathProgress, [0, 0.05], [0, 1]); // Fade In

  /* ---------------- PERFECT PATH ---------------- */
  // Adjusted curves for a smoother central flow that waves between the content
  const pathD = `
    M 500 0
    C 500 200, 500 400, 500 600
    C 200 800, 200 1200, 500 1400
    C 800 1600, 800 2000, 500 2200
    C 200 2400, 200 2800, 500 3000
    L 500 3200
  `;

  return (
    <div
      ref={containerRef}
      className="relative w-full py-24 md:py-32 bg-[var(--color-bg-subtle)] overflow-hidden"
    >
      {/* PATH + DOT */}
      {/* Added mask-image to fade the line in/out at the top/bottom for a smoother transition */}
      <div
        className="absolute inset-0 flex justify-center pointer-events-none opacity-30 md:opacity-100"
        style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)" }}
      >
        <svg
          viewBox="0 0 1000 3200"
          preserveAspectRatio="none"
          className="w-full max-w-[1200px] h-full"
        >
          {/* BASE PATH */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="2"
            strokeDasharray="8 12"
          />

          {/* ACTIVE PATH */}
          <motion.path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="4"
            style={{ pathLength: pathProgress }}
            strokeLinecap="round"
          />

          {/* MILESTONES */}
          {[600, 1400, 2200].map((yPos, i) => (
            <g key={i}>
              <circle
                cx="500"
                cy={yPos}
                r="8"
                fill="var(--color-bg-subtle)"
                stroke="var(--color-primary)"
                strokeWidth="2"
              />
              <circle
                cx="500"
                cy={yPos}
                r="16"
                stroke="var(--color-primary)"
                strokeWidth="1"
                className="animate-pulse opacity-40"
                fill="none"
              />
            </g>
          ))}

          {/* DOT — SVG-LOCKED */}
          <motion.circle
            cx={x}
            cy={y}
            r="10"
            fill="var(--color-primary)"
            className="filter drop-shadow-[0_0_8px_var(--color-primary)]"
          />
        </svg>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-24 relative max-w-full mx-auto">
          {/* Left Side: Title */}
          <motion.div
            style={{ x: titleX, opacity: headerOpacity }}
            className="w-full md:w-[45%] text-center md:text-right md:pr-12"
          >
            <h2 className="font-title text-5xl md:text-7xl text-[var(--color-text-body)] leading-tight">
              Your Path to Balance
            </h2>
          </motion.div>

          {/* Right Side: Description */}
          <motion.div
            style={{ x: descX, opacity: headerOpacity }}
            className="w-full md:w-[45%] text-center md:text-left md:pl-12 mt-8 md:mt-0"
          >
            <p className="uppercase tracking-[0.2em] text-sm text-[var(--color-primary)] font-bold mb-4">
              Guided Wellness Journey
            </p>
            <p className="text-lg md:text-xl opacity-70 font-body leading-relaxed max-w-lg">
              A structured approach to mental clarity. Each stage creates a foundation for the next, ensuring sustainable growth and long-term stability.
            </p>
          </motion.div>
        </div>

        {/* SECTIONS */}
        <div className="space-y-12">
          <TimelineSection
            step="STEP 01"
            title="Self-Discovery"
            description="Begin by understanding your emotional patterns. Through guided reflection and expert-led sessions, identify the triggers that shape your daily experience."
            image="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2670&auto=format&fit=crop"
          />

          <TimelineSection
            reverse
            step="STEP 02"
            title="Inner Resilience"
            description="Develop robust coping mechanisms. Learn scientifically-backed techniques to regulate stress, process difficult emotions, and restore your inner strength."
            image="https://images.unsplash.com/photo-1515023115689-589c33041697?q=80&w=2670&auto=format&fit=crop"
          />

          <TimelineSection
            step="STEP 03"
            title="Sustainable Wellness"
            description="Transform insights into lasting habits. Create a personalized lifestyle that naturally supports mental clarity, purpose, and emotional balance every single day."
            image="https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=2669&auto=format&fit=crop"
          />
        </div>
      </div>
    </div>
  );
}
