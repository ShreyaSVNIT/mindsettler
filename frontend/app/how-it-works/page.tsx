"use client";

import Parallaxcards from "@/components/Parallaxcards";
import HowItWorksFAQs from "@/components/HowItWorksFAQs";
import Orb from "@/components/Orb";
// import FloatingWords from "@/components/FloatingWords";
import WatercolorBackground from "@/components/WatercolorBackground";
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
      <section className="relative w-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] h-[80vh] bg-[var(--color-bg-app)] overflow-hidden py-24 z-10 flex flex-col items-center justify-center">

        {/* Watercolor Background Layer */}
        <div className="absolute inset-0 z-[-1]">
          <WatercolorBackground />
        </div>

        {/* Central Glow Effect */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 250, 240, 0.6) 25%, rgba(255, 235, 200, 0.3) 50%, transparent 70%)",
              filter: "blur(50px)",
              boxShadow: "0 0 100px rgba(255, 255, 255, 0.5), 0 0 150px rgba(255, 235, 200, 0.3)",
            }}
          />
        </div>

        <div className="absolute inset-0 z-0">
          <Orb
            hoverIntensity={3}
            rotateOnHover={true}
            transparent={true}
          />
        </div>

        {/* <div className="absolute inset-0 z-10">
          <FloatingWords />
        </div> */}

        {/* Text Overlay - Centered via Flexbox + Text Align Center */}
        <div className="relative z-20 w-[400px] max-w-[70vw] mx-auto text-center pointer-events-none">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-title text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-body)] leading-tight drop-shadow-sm"
          >
            "Healing isn't always a <span className="text-[var(--color-primary)] italic">straight line</span>,
            <br />
            but it doesn't have to be <span className="text-[var(--color-primary)] italic">a circle</span>"
          </motion.h2>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 pointer-events-auto"
          >
            <a
              href="/book"
              className="inline-block px-8 py-4 bg-[var(--color-primary)] text-white font-body font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Book a Session
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}