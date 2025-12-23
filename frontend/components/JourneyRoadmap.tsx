"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useInView } from 'framer-motion';

interface SectionProps {
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
  gapSize?: string;
}

const TimelineSection: React.FC<SectionProps> = ({ title, description, image, reverse, gapSize = 'gap-16' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 }); // Detects when section is centered

  const blobShape = reverse 
    ? "polygon(8% 12%, 92% 5%, 100% 88%, 15% 95%)" 
    : "polygon(2% 5%, 95% 15%, 88% 92%, 10% 85%)";

  return (
    <div ref={ref} className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-between ${gapSize} mb-48 relative z-10`}>
      {/* Image with Dynamic Grayscale */}
      <motion.div 
        className="w-full md:w-1/2 p-8 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1, 
          // Turns color when in view, grayscale when scrolled away
          filter: isInView ? "grayscale(0%)" : "grayscale(100%)",
          scale: isInView ? 1 : 0.95 
        }}
        transition={{ duration: 0.8 }}
      >
        <div 
          className="relative w-[450px] h-[320px] shadow-lg transition-all duration-700"
          style={{
            clipPath: blobShape,
            WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
            maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
          }}
        >
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      </motion.div>

      {/* Wellness Journey Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/2 p-12"
      >
        <h3 className="text-4xl font-title mb-4 text-[var(--color-primary)] uppercase tracking-wide">{title}</h3>
        <p className="text-[var(--color-text-body)] font-body font-light max-w-sm leading-relaxed mb-6">{description}</p>
        <button className="text-xs font-body font-medium tracking-[0.25em] border-b-2 border-[var(--color-primary)] pb-1 uppercase hover:text-[var(--color-primary-hover)] hover:border-[var(--color-primary-hover)] transition-all duration-300">
          Explore Session
        </button>
      </motion.div>
    </div>
  );
};

export default function MindSettlerJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"] 
  });

  const offsetDistance = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Centered path: Middle is 500 in a 1000px wide box
  const pathD = "M500,0 C700,500 300,1000 500,1500 S700,2500 500,3000";

  return (
    <div ref={containerRef} className="relative w-full py-24 pb-6 bg-[var(--color-bg-subtle)] overflow-hidden">
      
      {/* THE TRACK (Centered Alignment Fix) */}
      <div className="absolute inset-0 pointer-events-none flex justify-center">
        <div className="relative w-full max-w-[1000px] h-full">
          <svg width="100%" height="100%" viewBox="0 0 1000 3000" preserveAspectRatio="none" className="overflow-visible">
            <path d={pathD} fill="none" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="12 8" />
            <motion.path 
              d={pathD} 
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="3" 
              style={{ pathLength: scrollYProgress }}
            />
          </svg>

          {/* DOT LOCKED TO PATH */}
          <motion.div 
            className="absolute top-0 left-0 w-8 h-8 z-30"
            style={{ 
              offsetPath: `path("${pathD}")`,
              offsetDistance: offsetDistance,
              x: "-50%", 
              y: "-50%" 
            }}
          >
            <div className="w-full h-full bg-[var(--color-primary)] rounded-full border-4 border-white shadow-xl" />
            <div className="absolute inset-0 w-full h-full bg-[var(--color-primary)] rounded-full animate-ping opacity-30" />
          </motion.div>
        </div>
      </div>

      {/* MINDSETTLER CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-8">
        <div className="text-center mb-24">
          <p className="uppercase tracking-widest text-xs mb-4 opacity-70 font-body">
            Your Wellness Journey
          </p>
          <h2 className="font-title text-4xl md:text-5xl text-[var(--color-text-body)] mb-3">Your Path to Clarity</h2>
          <p className="text-[var(--color-text-body)] opacity-70 font-body">A structured journey toward mental well-being.</p>
        </div>

        <TimelineSection 
          title="Self-Discovery"
          description="Identify the patterns that hold you back. Our initial sessions focus on understanding your unique mental landscape."
          image="https://images.unsplash.com/photo-1518063319789-7217e6706b04"
          gapSize="gap-8"
        />
        
        <TimelineSection 
          reverse
          title="Inner Resilience"
          description="Build the tools to navigate stress and anxiety. Learn confidential techniques tailored to your lifestyle."
          image="https://images.unsplash.com/photo-1499209974431-9dac3adaf471"
          gapSize="gap-12"
        />

        <TimelineSection 
          title="Sustainable Wellness"
          description="Establish long-term habits. We ensure you leave with a clear roadmap for your continued growth."
          image="https://images.unsplash.com/photo-1506126613408-eca07ce68773"
          gapSize="gap-8"
        />
      </div>
    </div>
  );
}