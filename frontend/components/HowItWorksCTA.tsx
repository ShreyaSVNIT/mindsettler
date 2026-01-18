"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MagneticButton from "./Button";

export default function HowItWorksCTA() {
  return (
    <section className="px-6 py-16 relative overflow-hidden bg-[var(--color-bg-app)]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-primary)]/10"></div>
      </div>

      <div className="mx-auto max-w-5xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="font-title text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-6 leading-tight">
            Ready to Start Your Journey?
          </h2>
          <p className="font-body text-lg md:text-xl text-[var(--color-text-body)] opacity-80 mb-10 max-w-3xl mx-auto leading-relaxed">
            Take the first step towards better mental wellness today. Our team is here to support you every step of the way.
          </p>
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MagneticButton text="Begin This Phase" href="/book" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}