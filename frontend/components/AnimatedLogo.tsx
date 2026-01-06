'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = ['Healer', 'Warrior', 'Finder', 'Builder', 'Seeker', 'Settler'];

export default function AnimatedLogo({ className = '', isDark = false }: { className?: string; isDark?: boolean }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (hasCompleted) return;

    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => {
        if (prev === words.length - 1) {
          setHasCompleted(true);
          return prev;
        }
        return prev + 1;
      });
    }, 600); // Change word every 600ms

    return () => clearInterval(interval);
  }, [hasCompleted]);

  return (
    <div className={`flex items-center ${className}`}>
      <span className={`font-title text-inherit ${isDark ? 'text-white' : 'text-[var(--color-text-body)]'}`}>
        Mind
      </span>
      <div className="relative inline-block min-w-[140px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentWordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`font-title text-inherit inline-block ${
              currentWordIndex === words.length - 1 
                ? isDark ? 'text-white' : 'text-[var(--color-primary)]'
                : isDark ? 'text-white/70' : 'text-[var(--color-text-body)]/70'
            }`}
          >
            {words[currentWordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
