'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = ['Healer', 'Finder', 'Builder', 'Seeker', 'Settler'];

export default function AnimatedLogo({
  className = '',
  isDark = false,
}: {
  className?: string;
  isDark?: boolean;
}) {
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
    }, 600);

    return () => clearInterval(interval);
  }, [hasCompleted]);

  return (
    <span
      className={`inline-flex items-center justify-center leading-none ${className}`}
    >
      {/* Mind */}
      <span className={isDark ? 'text-white' : 'text-[var(--color-text-body)]'}>
        Mind
      </span>

      {/* Animated word */}
      <span className="relative inline-flex items-center justify-center w-[5.5ch]">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentWordIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute text-[var(--color-bg-app)]"
          >
            {words[currentWordIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
