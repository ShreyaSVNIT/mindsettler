"use client";

import Parallaxcards from "@/components/Parallaxcards";
import HowItWorksFAQs from "@/components/HowItWorksFAQs";
import HealingJourneySection from "@/components/HealingJourneySection";
import CouchHero from "@/components/CouchHero";
import MagneticButton from '@/components/Button';

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
        layout="static"
        className="lg:h-screen"
        cta={<a href="/how-it-works#start"><MagneticButton text="Get Started" /></a>}
      />



      <Parallaxcards />
      <HowItWorksFAQs />
      <HealingJourneySection />
    </main>
  );
}