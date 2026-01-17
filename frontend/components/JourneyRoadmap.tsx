"use client";

import React, { useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useInView
} from "framer-motion";
import MagneticButton from "./Button";
import Link from 'next/link';
import SectionHeader from "./SectionHeader";
import Image from 'next/image';

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
        {/* decorative glow removed per request */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl aspect-[4/3] md:aspect-[16/10]">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
              />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
        </div>

        
      </motion.div>

      {/* CONTENT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.22 }}
        className="w-full md:w-1/2"
      >
        <div className="md:px-8 flex flex-col justify-center h-full max-w-2xl">
          {/* Badge + Heading */}
          {(() => {
            const parsed = parseInt((step || "").replace(/\D/g, ""), 10);
            const displayNum = !isNaN(parsed) ? String(parsed) : "";
            return (
              <div className="flex items-center mb-3">
                {displayNum ? (
                  <div className="w-12 h-12 rounded-3xl bg-[var(--color-primary)] text-white font-title flex items-center justify-center mr-6 text-lg">
                    {displayNum}
                  </div>
                ) : null}
                <h3 className="font-title uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide text-[var(--color-text-body)] leading-tight">
                  {title}
                </h3>
              </div>
            );
          })()}

          <div className="p-4 pl-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-6 transition-colors duration-300 border-l-2 border-[var(--color-primary)]">
            <p className="font-body text-sm sm:text-base md:text-lg lg:text-xl text-[var(--color-text-body)] opacity-95 leading-relaxed">
              {description}
            </p>
          </div>
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
    M 500 -100
    C 500 150, 500 350, 500 550
    C 200 750, 200 1150, 500 1350
    C 800 1550, 800 1950, 500 2150
    C 200 2350, 200 2750, 500 2950
    L 500 3400
  `;

  // Pick shuffled images once per render lifecycle
  const [a, b, c] = useMemo(() => {
    const imgs = [
      "/img1.jpeg",
      "/img2.jpeg",
      "/img3.jpeg",
      "/img4.jpeg",
      "/img5.jpeg",
    ];

    // Use a stable deterministic selection to avoid impure functions during render
    return [imgs[0], imgs[1], imgs[2]];
  }, []);

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
            strokeWidth="1"
            strokeDasharray="8 12"
          />

          {/* ACTIVE PATH */}
          <motion.path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
            style={{ pathLength: pathProgress }}
            strokeLinecap="round"
          />

          {/* MILESTONES */}
          {[550, 1350, 2150].map((yPos, i) => (
            <g key={i}>
              <circle
                cx="500"
                cy={yPos}
                r="8"
                fill="var(--color-bg-subtle)"
                stroke="var(--color-primary)"
                strokeWidth="2"
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
        <motion.div style={{ opacity: headerOpacity }}>
          <SectionHeader
            subheader={"Guided Wellness\nJourney"}
            title={<>Build your <span className="italic">peace</span> on a foundation of <span className="italic">presence.</span></>}
            bodyText="Lasting clarity isn't found in a single breakthrough, but in the steady accumulation of small, intentional pauses. This is how you build a foundation that doesn't just hold, but heals. Every session is a step towards understanding yourself more deeply."
            layout="split"
            decoration="none"
          />
        </motion.div>

        {/* SECTIONS */}
        <div className="space-y-10">
          <>
            <TimelineSection
              step="STEP 01"
              title="Self-Discovery"
              description="Begin by understanding your emotional patterns. Through guided reflection and expert-led sessions, identify the triggers that shape your daily experience."
              image={a}
            />

            <TimelineSection
              reverse
              step="STEP 02"
              title="Inner Resilience"
              description="Develop robust coping mechanisms. Learn scientifically-backed techniques to regulate stress, process difficult emotions, and restore your inner strength."
              image={b}
            />

            <TimelineSection
              step="STEP 03"
              title="Sustainable Wellness"
              description="Transform insights into lasting habits. Create a personalized lifestyle that naturally supports mental clarity, purpose, and emotional balance every single day."
              image={c}
            />
          </>
        </div>

        {/* Single CTA for the whole journey */}
        <div className="mt-12 flex justify-center">
          <Link href="/resources" aria-label="Learn more resources">
            <MagneticButton text="Learn More" />
          </Link>
        </div>
      </div>
    </div>
  );
}
