'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface CardProps {
  i: number;
  title: string;
  description: string;
  progress: any;
  range: number[];
  targetScale: number;
}

const Card = ({ i, title, description, progress, range, targetScale }: CardProps) => {
  const container = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // This helps the card know when it's in view
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  // The scale logic from your reference: shrinks the card as progress through the section increases
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0 px-4">
      <motion.div
        style={{
          scale,
          backgroundColor: 'var(--color-bg-subtle)',
          // This creates the "stacked" edges at the top
          top: `calc(5vh + ${i * 28}px)`,
        }}
        className="relative min-h-[400px] h-auto md:h-[450px] w-full max-w-[900px] rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-white/10 origin-top overflow-hidden group flex flex-col justify-center"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="relative z-10 flex flex-col md:flex-row h-full gap-6 md:gap-10 items-center">
          <div className="flex-1 flex flex-col justify-center">
            <motion.h3
              className="font-title text-3xl md:text-4xl text-[var(--color-text-body)] mb-4 md:mb-6"
              animate={isHovered ? { x: 10 } : { x: 0 }}
            >
              {title}
            </motion.h3>
            <motion.p
              className="font-body text-base md:text-lg opacity-80 leading-relaxed"
              animate={isHovered ? { x: 10 } : { x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <span className="text-3xl md:text-4xl font-title text-[var(--color-primary)] mr-1">{description[0]}</span>
              {description.substring(1)}
            </motion.p>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center opacity-10 select-none group-hover:opacity-20 transition-opacity duration-300">
            <span className="text-[8rem] lg:text-[12rem] font-title text-[var(--color-primary)] whitespace-nowrap">0{i + 1}</span>
          </div>
        </div>

        {/* Animated gradient wash */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent pointer-events-none"
          animate={isHovered ? { opacity: 1 } : { opacity: 0.5 }}
        />

        {/* Edge glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
          animate={isHovered ? {
            boxShadow: '0 0 80px rgba(249, 209, 213, 0.4), inset 0 0 80px rgba(249, 209, 213, 0.1)'
          } : {
            boxShadow: '0 0 0px rgba(249, 209, 213, 0)'
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </div>
  );
};

interface StackCardsProps {
  values: Array<{
    title: string;
    description: string;
  }>;
}

export default function StackCards({ values }: StackCardsProps) {
  const containerRef = useRef(null);

  // This scroll progress tracks the ENTIRE values section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <section ref={containerRef} className="relative bg-[var(--color-bg-card)] px-4">
      {values.map((value, index) => {
        // Calculation for the range: [start_scroll_percent, end_scroll_percent]
        const start = index * (1 / values.length);
        const targetScale = 1 - ((values.length - index) * 0.05);

        return (
          <Card
            key={index}
            i={index}
            {...value}
            progress={scrollYProgress}
            range={[start, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </section>
  );
}
