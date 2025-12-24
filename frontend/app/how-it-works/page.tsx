"use client";

import HowItWorksHero from "@/components/HowItWorksHero";
import HowItWorksJourney from "@/components/HowItWorksJourney";
import HowItWorksFAQs from "@/components/HowItWorksFAQs";
import HowItWorksCTA from "@/components/HowItWorksCTA";

export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-app)]">
      <HowItWorksHero />
      <HowItWorksJourney />
      <HowItWorksFAQs />
      <HowItWorksCTA />
    </main>
  );
}