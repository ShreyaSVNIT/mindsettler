"use client";

import Parallaxcards from "@/components/Parallaxcards";
import HowItWorksFAQs from "@/components/HowItWorksFAQs";
import HowItWorksCTA from "@/components/HowItWorksCTA";
import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-app)]">
      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center bg-[var(--color-bg-app)] px-6 pt-32">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center gap-3 px-6 py-2 rounded-full border-2 border-[var(--color-primary)]/30 bg-white/50 backdrop-blur-sm">
                <span className="text-[var(--color-primary)] text-sm font-body font-bold tracking-wider uppercase">
                  Your Journey
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-title text-6xl md:text-7xl lg:text-8xl text-[var(--color-text-body)] mb-6 leading-tight"
            >
              How It{" "}
              <span className="text-[var(--color-primary)] italic">Works</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-body text-lg md:text-xl text-[var(--color-text-body)]/70 max-w-3xl mx-auto"
            >
              A simple, compassionate process designed to support your mental wellness journey every step of the way
            </motion.p>
          </motion.div>
        </div>
      </section>

      <Parallaxcards />
      <HowItWorksFAQs />
      <HowItWorksCTA />
    </main>
  );
}