"use client";

import Parallaxcards from "@/components/Parallaxcards";
import HowItWorksFAQs from "@/components/HowItWorksFAQs";
import HealingJourneySection from "@/components/HealingJourneySection";
import TitleHeader from "@/components/TitleHeader";
import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
    <main className="relative bg-[var(--color-bg-app)]">
      {/* Hero Section - Fixed */}
      <section className="sticky top-0 h-screen flex items-center justify-center bg-[var(--color-bg-app)] px-6 z-0 overflow-hidden">
        {/* Left Decorative Couch */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[70vh] w-auto hidden xl:block z-0 pointer-events-none">
          <img
            src="/pinkcouch1.png"
            alt="Relaxing couch"
            className="h-full w-auto object-cover rounded-r-[3rem] shadow-2xl opacity-90"
          />
        </div>

        {/* Right Decorative Couch */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[70vh] w-auto hidden xl:block z-0 pointer-events-none">
          <img
            src="/pinkcouch2.png"
            alt="Comfortable setting"
            className="h-full w-auto object-cover rounded-l-[3rem] shadow-2xl opacity-90"
          />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <TitleHeader
            subheader="Your Journey"
            title={<>How It{" "}<span className="text-[var(--color-primary)] italic">Works</span></>}
            description="A simple, compassionate process designed to support your mental wellness journey every step of the way"
            alignment="center"
          />

          {/* Decorative Element */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="w-24 h-1 bg-[var(--color-primary)] mx-auto mt-12 rounded-full"
          />
        </div>
      </section>

      {/* Spacer to allow scrolling before cards appear */}
      <div className="h-[50vh]" />

      <Parallaxcards />
      <HowItWorksFAQs />
      <HealingJourneySection />
    </main>
  );
}