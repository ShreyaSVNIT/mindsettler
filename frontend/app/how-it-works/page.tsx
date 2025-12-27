"use client";

import Parallaxcards from "@/components/Parallaxcards";
import HowItWorksFAQs from "@/components/HowItWorksFAQs";
import HowItWorksCTA from "@/components/HowItWorksCTA";

export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-app)]">
      <Parallaxcards />
      <HowItWorksFAQs />
      <HowItWorksCTA />
    </main>
  );
}