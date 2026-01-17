"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function SplitText({
  text,
  className = '',
  tag = 'p',
}: {
  text: string;
  className?: string;
  tag?: string;
}) {
  const letters = Array.from(text);
  const MotionTag: any = (motion as any)[tag] || motion.p;

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <MotionTag
      className={`split-parent ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          variants={child}
          aria-hidden={letter.trim() === ''}
          className="inline-block"
        >
          {letter}
        </motion.span>
      ))}
    </MotionTag>
  );
}
