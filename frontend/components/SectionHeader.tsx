import React from 'react';

interface SectionHeaderProps {
  subheader: string;
  title: string | React.ReactNode;
  bodyText?: string;
  alignment?: 'left' | 'center' | 'right';
  decoration?: 'whiskers' | 'dot' | 'none';
  layout?: 'single' | 'split'; // single column or split (title left, body right)
}

export default function SectionHeader({
  subheader,
  title,
  bodyText,
  alignment = 'center',
  decoration = 'whiskers',
  layout = 'single'
}: SectionHeaderProps) {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  const justifyClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  if (layout === 'split') {
    return (
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8 md:gap-12 mb-12 sm:mb-16 md:mb-24 max-w-full mx-auto">
        {/* Left Side: Subheader + Title */}
        <div className="w-full md:w-[45%]">
          {/* Subheader with decoration */}
          <div className={`flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8 ${justifyClasses.left}`}>
            {decoration === 'whiskers' && (
              <>
                <div className="h-[1px] w-6 sm:w-8 md:w-12 lg:w-16 bg-gradient-to-r from-transparent to-[var(--color-primary)]" />
                <span className="text-[var(--color-primary)] text-sm sm:text-sm md:text-base lg:text-lg tracking-[0.5em] uppercase font-playfair font-bold whitespace-nowrap">
                  {subheader}
                </span>
                <div className="h-[1px] w-6 sm:w-8 md:w-12 lg:w-16 bg-gradient-to-r from-[var(--color-primary)] to-transparent" />
              </>
            )}
            {decoration === 'dot' && (
              <>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                <span className="text-[var(--color-primary)] text-sm sm:text-sm md:text-base lg:text-lg tracking-[0.5em] uppercase font-playfair font-bold whitespace-nowrap">
                  {subheader}
                </span>
              </>
            )}
            {decoration === 'none' && (
              <span className="text-[var(--color-primary)] text-sm sm:text-sm md:text-base lg:text-lg tracking-[0.5em] uppercase font-playfair font-bold whitespace-nowrap">
                {subheader}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="font-title text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[var(--color-text-body)] leading-tight">
            {title}
          </h2>
        </div>

        {/* Right Side: Body Text */}
        {bodyText && (
          <div className="w-full md:w-[45%] text-right mt-4 md:mt-0">
            <p className="text-base sm:text-base md:text-xl lg:text-2xl text-[var(--color-text-body)] opacity-80 body-text">
              {bodyText}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Single column layout (original MentalHealthBasics style)
  return (
    <div className={`flex flex-col ${alignmentClasses[alignment]} mb-8 sm:mb-12 md:mb-16`}>
      {/* Subheader with decoration */}
      <div className={`flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-4 ${justifyClasses[alignment]}`}>
        {decoration === 'whiskers' && (
          <>
            <div className="h-[1px] w-6 sm:w-8 md:w-12 lg:w-16 bg-gradient-to-r from-transparent to-[var(--color-primary)]" />
            <span className="text-[var(--color-primary)] text-sm sm:text-sm md:text-base lg:text-lg tracking-[0.5em] uppercase font-playfair font-bold">
              {subheader}
            </span>
            <div className="h-[1px] w-6 sm:w-8 md:w-12 lg:w-16 bg-gradient-to-r from-[var(--color-primary)] to-transparent" />
          </>
        )}
        {decoration === 'dot' && (
          <>
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
            <span className="text-[var(--color-primary)] text-sm sm:text-sm md:text-base lg:text-lg tracking-[0.5em] uppercase font-playfair font-bold">
              {subheader}
            </span>
          </>
        )}
        {decoration === 'none' && (
          <span className="text-[var(--color-primary)] text-sm sm:text-sm md:text-base lg:text-lg tracking-[0.5em] uppercase font-playfair font-bold">
            {subheader}
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="font-title text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[var(--color-text-body)] leading-tight mb-3 sm:mb-4 md:mb-4">
        {title}
      </h2>

      {/* Body Text */}
      {bodyText && (
        <p className="text-base sm:text-base md:text-xl lg:text-2xl text-[var(--color-text-body)] opacity-80 body-text max-w-4xl">
          {bodyText}
        </p>
      )}
    </div>
  );
}
