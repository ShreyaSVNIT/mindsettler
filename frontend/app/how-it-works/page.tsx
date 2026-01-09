"use client";

import Parallaxcards from "@/components/Parallaxcards";
import HowItWorksFAQs from "@/components/HowItWorksFAQs";
import HealingJourneySection from "@/components/HealingJourneySection";
import CouchHero from "@/components/CouchHero";

export default function HowItWorks() {
  return (
    <main className="relative bg-[var(--color-bg-app)]">
      <CouchHero
        subheader="Your Journey"
        title={
          <>
            How It <span className="text-[var(--color-primary)] italic">Works</span>
          </>
        }
        description="A simple, compassionate process designed to support 
        your mental wellness journey every step of the way"
        alignment="center"
        layout="sticky"
      />

      {/* Spacer to allow scrolling before cards appear */}
      <div className="h-[50vh]" />

      <Parallaxcards />
      <HowItWorksFAQs />
      <HealingJourneySection />
    </main>
  );
}