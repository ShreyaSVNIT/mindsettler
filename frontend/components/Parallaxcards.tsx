"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

/* ---------------- DATA ---------------- */

const STEPS = [
  {
    id: 1,
    title: "Book Your Session",
    description:
      "Choose a time that feels right for you. This first step is about choosing yourself.",
    image: "/step1.jpg",
    link: "/book",
    cta: "Book Now",
  },
  {
    id: 2,
    title: "Prepare & Connect",
    description:
      "Review the shared resources and get ready to open up in a comfortable space of your choice.",
    image: "/step2.jpg",
    link: "/resources",
    cta: "View Resources",
  },
  {
    id: 3,
    title: "Engage in Your Session",
    description:
      "Work with your therapist in a safe, confidential, and supportive environment designed for healing.",
    image: "/step3.jpg",
    link: "/confidentiality-policy",
    cta: "Learn More",
  },
  {
    id: 4,
    title: "Continue Your Journey",
    description:
      "Receive personalized follow-ups, resources, and ongoing guidance to support your mental wellness.",
    image: "/step4.jpg",
    link: "/resources",
    cta: "Explore Support",
  },
];

/* ---------------- COMPONENT ---------------- */

export default function ParallaxCards() {
  const [activeId, setActiveId] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const activeStep = STEPS.find((s) => s.id === activeId)!;

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden z-10"
      style={{ backgroundColor: "var(--color-bg-app)" }}
    >
      {/* ---------- BACKGROUND IMAGE ---------- */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            className="absolute inset-0"
            style={{ y: backgroundY }}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              opacity: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
              scale: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
            }}
          >
            <Image
              src={activeStep.image}
              alt=""
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

      </div>

      {/* ---------- CARDS ---------- */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-7xl px-6">
        {STEPS.map((step) => {
          const isActive = activeId === step.id;

          return (
            <motion.div
              key={step.id}
              onMouseEnter={() => setActiveId(step.id)}
              layout
              initial={false}
              animate={{
                width: isActive ? 480 : 320,
                height: isActive ? 420 : 280,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 30,
                mass: 1.5,
              }}
              className="relative rounded-2xl overflow-hidden cursor-pointer flex flex-col shadow-2xl w-full md:w-auto"
              style={{
                backgroundColor: isActive
                  ? "var(--color-bg-card)"
                  : "rgba(255,255,255,0.45)",
                border: "1px solid var(--color-border)",
                backdropFilter: isActive ? "none" : "blur(24px)",
                padding: "40px", // Even padding on all sides
              }}
            >
              <motion.div layout className="flex flex-col h-full justify-between">
                <div>
                  {/* STEP NUMBER CIRCLE */}
                  <motion.div
                    layout="position"
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-6 font-title text-2xl font-bold"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "var(--color-bg-card)",
                    }}
                  >
                    {step.id}
                  </motion.div>

                  {/* TITLE */}
                  <motion.h3
                    layout="position"
                    className="font-title text-3xl font-extrabold mb-4"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {step.title}
                  </motion.h3>

                  {/* DESCRIPTION - comes from below quickly */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="font-body text-lg leading-relaxed"
                        style={{
                          color: "var(--color-text-body)",
                          opacity: 0.9,
                        }}
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* SEPARATOR LINE AND CTA - at bottom */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="mt-auto pt-6"
                    >
                      {/* SEPARATOR LINE */}
                      <div
                        className="h-[1px] w-full mb-4"
                        style={{ backgroundColor: "var(--color-text-body)", opacity: 0.2 }}
                      />

                      {/* CTA LINK */}
                      <Link
                        href={step.link}
                        className="flex items-center justify-between font-body font-bold text-lg transition-none group/link w-full"
                        style={{ color: "var(--color-text-body)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--color-primary)";
                        }}
                      >
                        <span>{step.cta}</span>
                        <div className="relative h-5 w-5 overflow-hidden">
                          {/* Original Arrow: Slides out to the RIGHT */}
                          <ArrowRight
                            className="absolute inset-0 transition-all duration-500 ease-in-out group-hover/link:translate-x-full group-hover/link:opacity-0 w-5 h-5"
                          />
                          {/* New Arrow: Slides in from the LEFT */}
                          <ArrowRight
                            className="absolute inset-0 -translate-x-full opacity-0 transition-all duration-500 ease-in-out group-hover/link:translate-x-0 group-hover/link:opacity-100 w-5 h-5"
                          />
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
