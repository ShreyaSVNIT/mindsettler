import React from 'react';
import { motion } from 'framer-motion';
import SplitText from './SplitText';

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
  // On small screens we want left-aligned sections to be centered for better mobile layout.
  const alignmentClasses = {
    left: 'text-center md:text-left items-center md:items-start',
    center: 'text-center items-center'
  };

  const descriptionClasses = alignment === 'center'
    ? 'max-w-2xl mx-auto'
    : 'max-w-2xl mx-auto md:max-w-prose md:mx-0';

  return (
    <div className={`flex flex-col ${alignmentClasses[alignment]}`}>
      {/* Subheader */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-3 sm:mb-4 md:mb-6"
      >
        <span className="text-[var(--color-primary)] text-sm sm:text-sm md:text-base lg:text-lg tracking-[0.5em] uppercase font-playfair font-bold">
          {subheader}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="font-title text-5xl sm:text-6xl md:text-7xl lg:text-9xl text-[var(--color-text-body)] mb-4 sm:mb-6 md:mb-8 leading-tight sm:leading-[0.95]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {typeof title === 'string' ? (
          <SplitText text={title} className="text-inherit" tag="span" />
        ) : (
          title
        )}
      </motion.h1>

      {/* Description */}
      {description && (
        <motion.p
            className={`font-body text-base sm:text-base md:text-xl lg:text-2xl text-[var(--color-text-body)] opacity-80 leading-relaxed whitespace-pre-line ${descriptionClasses}`}
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
