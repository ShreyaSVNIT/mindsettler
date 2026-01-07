"use client";

import Parallaxcards from "@/components/Parallaxcards";
import HowItWorksFAQs from "@/components/HowItWorksFAQs";
import HowItWorksCTA from "@/components/HowItWorksCTA";
import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
    <main className="relative bg-[var(--color-bg-app)]">
      {/* Hero Section - Fixed */}
      <section className="sticky top-0 h-screen flex items-center justify-center bg-[var(--color-bg-app)] px-6 z-0">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-8"
            >
              <div className="flex items-center gap-3 px-8 py-3 rounded-full border-2 border-[var(--color-primary)]/40 bg-white/60 backdrop-blur-sm shadow-lg">
                <span className="text-[var(--color-primary)] text-sm font-body font-bold tracking-[0.2em] uppercase">
                  Your Journey
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-title text-7xl md:text-8xl lg:text-9xl text-[var(--color-text-body)] mb-8 leading-[1.1]"
            >
              How It{" "}
              <span className="text-[var(--color-primary)] italic font-light">Works</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-body text-xl md:text-2xl text-[var(--color-text-body)]/70 max-w-3xl mx-auto leading-relaxed"
            >
              A simple, compassionate process designed to support your mental wellness journey every step of the way
            </motion.p>

            {/* Decorative Element */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="w-24 h-1 bg-[var(--color-primary)] mx-auto mt-12 rounded-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Spacer to allow scrolling before cards appear */}
      <div className="h-[50vh]" />

      <Parallaxcards />
      <HowItWorksFAQs />
      <HowItWorksCTA />
    </main>
  );
}