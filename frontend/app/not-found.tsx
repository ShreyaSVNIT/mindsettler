'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import MagneticButton from '@/components/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-purple-400/10 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="font-title text-[12rem] md:text-[16rem] leading-none text-[var(--color-primary)] opacity-20">
            404
          </h1>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="font-title text-4xl md:text-6xl text-[var(--color-text-body)] mb-6">
            Lost in <span className="italic">thought?</span>
          </h2>
          <p className="text-xl md:text-2xl text-[var(--color-text-body)] opacity-80 mb-12 body-text max-w-xl mx-auto">
            This page seems to have wandered off. Let's guide you back to a place of clarity and peace.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <MagneticButton text="Return Home" href="/home" />
        </motion.div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <button 
            onClick={() => window.history.back()} 
            className="inline-flex items-center gap-2 text-[var(--color-text-body)] opacity-60 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft size={20} />
            <span className="text-sm uppercase tracking-wider">Go Back</span>
          </button>
        </motion.div>

        {/* Decorative Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[var(--color-primary)]" />
            <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
            <div className="h-[1px] w-16 bg-gradient-to-r from-[var(--color-primary)] to-transparent" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
