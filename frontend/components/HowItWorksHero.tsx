"use client";

import { motion } from "framer-motion";

export default function HowItWorksHero() {
  return (
    <section className="pt-16 md:pt-32 pb-12 md:pb-20 px-6 flex items-center">
      <div className="mx-auto max-w-4xl text-center py-6 md:py-0">
        <motion.h1
          className="font-title text-4xl md:text-6xl text-[var(--color-primary)] mb-4 md:mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          How It Works
        </motion.h1>
        <motion.p
          className="font-body text-lg md:text-xl text-[var(--color-text-body)] opacity-80 leading-relaxed max-w-xl md:max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          Your journey to better mental wellness starts here. From booking to completion,
          we guide you through every step with care and expertise.
        </motion.p>
      </div>
    </section>
  );
}