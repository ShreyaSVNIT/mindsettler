import React from 'react';
import { motion } from 'framer-motion';

interface TitleHeaderProps {
  subheader: string;
  title: string | React.ReactNode;
  description?: string;
  alignment?: 'left' | 'center';
}

export default function TitleHeader({
  subheader,
  title,
  description,
  alignment = 'left'
}: TitleHeaderProps) {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center'
  };

  return (
    <div className={`flex flex-col ${alignmentClasses[alignment]}`}>
      {/* Subheader */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <span className="text-[var(--color-primary)] text-base md:text-lg tracking-[0.5em] uppercase font-playfair font-bold">
          {subheader}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="font-title text-6xl md:text-8xl text-[var(--color-text-body)] mb-8 leading-[0.95]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {title}
      </motion.h1>

      {/* Description */}
      {description && (
        <motion.p
          className="font-body text-xl md:text-2xl text-[var(--color-text-body)] opacity-80 leading-relaxed body-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
