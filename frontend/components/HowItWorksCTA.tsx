"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MagneticButton from "./Button";

export default function HowItWorksCTA() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-primary)]/10"></div>
        <div className="absolute top-10 right-10 w-20 h-20 bg-[var(--color-primary)] rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-[var(--color-primary)] rounded-full blur-xl"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-2 h-2 bg-[var(--color-primary)] rounded-full opacity-30"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-32 right-32 w-1 h-1 bg-[var(--color-primary)] rounded-full opacity-40"
          animate={{
            y: [0, 15, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full opacity-25"
          animate={{
            x: [0, 10, 0],
            opacity: [0.25, 0.5, 0.25]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[var(--color-primary)]/10 via-[var(--color-primary)]/5 to-[var(--color-primary)]/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm border border-white/20 shadow-xl"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="font-title text-4xl text-[var(--color-primary)] mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="font-body text-xl text-[var(--color-text-body)] opacity-80 mb-8 max-w-2xl mx-auto">
              Take the first step towards better mental wellness today. Our team is here to support you every step of the way.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/book">
                <MagneticButton text="Begin This Phase" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}