"use client";

import React from "react";
import { motion } from "framer-motion";
import TitleHeader from "./TitleHeader";

interface CouchHeroProps {
  subheader: string;
  title: React.ReactNode;
  description: string;
  alignment?: "left" | "center";
  layout?: "sticky" | "static";
  cta?: React.ReactNode;
  backgroundColor?: string;
}

export default function CouchHero({
  subheader,
  title,
  description,
  alignment = "center",
  layout = "sticky",
  cta,
  backgroundColor = "var(--color-bg-app)",
}: CouchHeroProps) {
  const sectionClasses =
    layout === "sticky"
      ? `sticky top-0 h-screen flex items-center justify-center px-6 z-0 overflow-hidden`
      : `relative min-h-[80vh] flex items-center justify-center px-6 pt-[calc(var(--header-h)+12rem)] pb-20 overflow-hidden`;

  return (
    <section className={sectionClasses} style={{ backgroundColor }}>
      {/* Decorative couches to keep the original look */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[70vh] w-auto hidden xl:block z-0 pointer-events-none">
        <img
          src="/pinkcouch1.png"
          alt="Relaxing couch"
          className="h-full w-auto object-cover rounded-r-[3rem] shadow-2xl opacity-90"
        />
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[70vh] w-auto hidden xl:block z-0 pointer-events-none">
        <img
          src="/pinkcouch2.png"
          alt="Comfortable setting"
          className="h-full w-auto object-cover rounded-l-[3rem] shadow-2xl opacity-90"
        />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10 -translate-y-6 md:-translate-y-10">
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
          className="w-24 h-1 bg-[var(--color-primary)] mx-auto mt-12 rounded-full"
        />

        {cta && <div className="mt-12 flex justify-center">{cta}</div>}
      </div>
    </section>
  );
}
