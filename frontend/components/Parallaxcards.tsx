"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Calendar,
  CheckCircle,
  Users,
  MessageSquare,
  Star,
} from "lucide-react";

/* ---------------- DATA ---------------- */

const STEPS = [
  {
    id: 1,
    title: "Step 01 · Book Your Session",
    description:
      "Choose a time that feels right for you. This first step is about choosing yourself.",
    icon: Calendar,
    image: "/step1.jpg",
  },
  {
    id: 2,
    title: "Step 02 · Receive Confirmation",
    description:
      "Clear details help you feel prepared and reduce uncertainty. We'll send you everything you need.",
    icon: CheckCircle,
    image: "/step2.jpg",
  },
  {
    id: 3,
    title: "Step 03 · Prepare & Connect",
    description:
      "Review the shared resources and get ready to open up in a comfortable space of your choice.",
    icon: Users,
    image: "/step3.jpg",
  },
  {
    id: 4,
    title: "Step 04 · Engage in Your Session",
    description:
      "Work with your therapist in a safe, confidential, and supportive environment designed for healing.",
    icon: MessageSquare,
    image: "/step4.jpg",
  },
  {
    id: 5,
    title: "Step 05 · Post-Session Support",
    description:
      "Continue your journey with personalized follow-ups, resources, and ongoing guidance.",
    icon: Star,
    image: "/step5.jpg",
  },
];

/* ---------------- COMPONENT ---------------- */

export default function ParallaxCards() {
  const [activeId, setActiveId] = useState(3);
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
      className="
        relative min-h-screen w-full flex items-center justify-center overflow-hidden
        pt-28 md:pt-0
      "
      style={{ backgroundColor: "var(--color-bg-app)" }}
    >
      {/* ---------- BACKGROUND IMAGE ---------- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          className="absolute inset-0"
          style={{ y: backgroundY }}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative w-full h-full">
            <Image
              src={activeStep.image}
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.35))",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ---------- CARDS ---------- */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-7xl px-6">
        {STEPS.map((step) => {
          const isActive = activeId === step.id;
          const Icon = step.icon;

          return (
            <motion.div
              key={step.id}
              onMouseEnter={() => setActiveId(step.id)} // UNCHANGED
              layout
              initial={false}
              animate={{
                width: isActive ? 520 : 320,
                height: isActive ? 520 : 320,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 30,
                mass: 1.5,
              }}
              className="relative rounded-[40px] overflow-hidden cursor-pointer flex flex-col p-10 shadow-2xl w-full md:w-auto"
              style={{
                backgroundColor: isActive
                  ? "var(--color-bg-card)"
                  : "rgba(255,255,255,0.55)",
                border: "1px solid var(--color-border)",
                backdropFilter: isActive ? "none" : "blur(14px)",
              }}
            >
              <motion.div layout className="flex flex-col h-full">
                {/* ICON */}
                <motion.div
                  layout="position"
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: "var(--color-bg-app)",
                    color: "var(--color-primary)",
                  }}
                >
                  <Icon className="w-7 h-7" />
                </motion.div>

                {/* TITLE — ONLY VISUAL CHANGE */}
                <motion.h3
                  layout="position"
                  className="font-title text-3xl font-extrabold mb-4"
                  style={{ color: "var(--color-primary)" }}
                >
                  {step.title}
                </motion.h3>

                {/* DESCRIPTION — UNCHANGED */}
                <AnimatePresence>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
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
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
