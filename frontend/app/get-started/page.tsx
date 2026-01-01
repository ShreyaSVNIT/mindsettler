"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import MagneticButton from "@/components/Button";

export default function GetStartedPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F2ECF2] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-32 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-32 w-80 h-80 bg-white/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          {/* Small tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/80 border border-[var(--color-primary)]/30 backdrop-blur-sm"
          >
            <Sparkles size={16} className="text-[var(--color-primary)]" />
            <span className="font-body text-sm text-[var(--color-text-body)] font-medium">
              Expert-Led Mental Wellness
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-title text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight text-[var(--color-text-body)] mb-8"
          >
            TRANSFORM YOUR{" "}
            <span className="block text-[var(--color-primary)] mt-3">
              MENTAL WELLNESS
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="font-body text-lg leading-relaxed text-[var(--color-text-body)]/80 mb-10 max-w-xl"
          >
            MindSettler offers structured, confidential mental wellness sessions designed to help you understand yourself better. Start your journey to emotional clarity today.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/signup">
              <MagneticButton text="Get Started Free" variant="lavender" />
            </Link>

            <Link href="/book">
              <MagneticButton 
                text="Book Session" 
                variant="lavender"
              />
            </Link>
          </motion.div>

          {/* Stats or trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-12 flex items-center gap-8 text-[var(--color-text-body)]/70"
          >
            <div>
              <p className="font-title text-3xl font-bold text-[var(--color-text-body)]">
                500+
              </p>
              <p className="font-body text-sm">Sessions Completed</p>
            </div>
            <div className="w-px h-12 bg-[var(--color-border)]" />
            <div>
              <p className="font-title text-3xl font-bold text-[var(--color-text-body)]">
                98%
              </p>
              <p className="font-body text-sm">Satisfaction Rate</p>
            </div>
            <div className="w-px h-12 bg-[var(--color-border)]" />
            <div>
              <p className="font-title text-3xl font-bold text-[var(--color-text-body)]">
                24/7
              </p>
              <p className="font-body text-sm">Support Available</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative hidden lg:flex items-center justify-center"
        >
          {/* Large circular image container */}
          <div className="relative w-[600px] h-[600px]">
            {/* Decorative rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)]/30"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 rounded-full border-2 border-white/30"
            />

            {/* Main image */}
            <div className="absolute inset-16 rounded-full overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800"
                alt="Mental wellness"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#c0b7d2]/30 to-transparent" />
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-16 right-0 w-32 h-32 rounded-2xl bg-white/90 backdrop-blur-sm border border-[var(--color-primary)]/30 shadow-lg p-4 flex flex-col items-center justify-center"
            >
              <p className="font-title text-4xl font-bold text-[var(--color-primary)]">
                100%
              </p>
              <p className="font-body text-xs text-[var(--color-text-body)] text-center mt-1">
                Confidential
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-24 left-0 w-36 h-36 rounded-2xl bg-white/90 backdrop-blur-sm border border-[var(--color-primary)]/30 shadow-lg p-4 flex flex-col items-center justify-center"
            >
              <p className="font-title text-4xl font-bold text-[var(--color-primary)]">
                24h
              </p>
              <p className="font-body text-xs text-[var(--color-text-body)] text-center mt-1">
                Response Time
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
