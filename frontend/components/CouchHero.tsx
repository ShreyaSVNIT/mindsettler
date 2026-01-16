"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from 'next/image';
import TitleHeader from "./TitleHeader";

interface CouchHeroProps {
  subheader: string;
  title: React.ReactNode;
  description: string;
  alignment?: "left" | "center";
  layout?: "sticky" | "static";
  cta?: React.ReactNode;
  backgroundColor?: string;
  className?: string;
}

export default function CouchHero({
  subheader,
  title,
  description,
  alignment = "center",
  layout = "sticky",
  cta,
  backgroundColor = "var(--color-bg-subtle)",
  className = '',
}: CouchHeroProps) {
  const sectionClasses =
    layout === "sticky"
      ? `sticky top-0 h-[48vh] md:h-[60vh] lg:h-[75vh] flex items-center justify-center px-6 z-20 ${className}`
      : // static layout: occupy a large, but not excessive, viewport height and center content vertically
        `relative min-h-[40vh] md:min-h-[55vh] lg:min-h-[70vh] w-full flex items-center justify-center px-6 overflow-hidden z-20 ${className}`;

  return (
    <section className={sectionClasses} style={{ backgroundColor }}>
      {/* Decorative couches to keep the original look */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[48vh] w-auto hidden xl:block z-0 pointer-events-none">
        <Image
          src="/pinkcouch1.png"
          alt="Relaxing couch"
          width={720}
          height={1200}
          className="h-full w-auto object-cover rounded-r-[3rem] shadow-lg opacity-90"
        />
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[52vh] w-auto hidden xl:block z-0 pointer-events-none">
        <Image
          src="/pinkcouch2.png"
          alt="Comfortable setting"
          width={720}
          height={1200}
          className="h-full w-auto object-cover rounded-l-[3rem] shadow-lg opacity-90"
        />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10 w-full h-full flex flex-col justify-center items-center mt-0 md:mt-0 transform translate-y-0 md:-translate-y-6">
        <TitleHeader
          subheader={subheader}
          title={title}
          description={description}
          alignment={alignment}
        />

        {/* Underline accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="w-24 h-1 bg-[var(--color-primary)] mx-auto mt-4 mb-6 md:mt-8 md:mb-10 rounded-full"
        />

        {cta && <div className="mt-8 md:mt-12 flex justify-center">{cta}</div>}
      </div>
    </section>
  );
}
