import React from 'react';

interface SectionHeaderProps {
  subheader: string;
  title: string | React.ReactNode;
  bodyText?: string;
  alignment?: 'left' | 'center' | 'right';
  decoration?: 'whiskers' | 'dot' | 'none';
  layout?: 'single' | 'split'; // single column or split (title left, body right)
  /** optional class to override title color (e.g. 'text-white') */
  titleColor?: string;
  /** optional class to override body text color */
  bodyColor?: string;
  /** optional class to override subheader color */
  subheaderColor?: string;
  /** optional class to add to the title element for custom sizing */
  titleClassName?: string;
}

export default function SectionHeader({
  subheader,
  title,
  bodyText,
  alignment = 'center',
  decoration = 'whiskers',
  layout = 'single'
  , titleColor, bodyColor, subheaderColor, titleClassName
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
          <div className={`w-full md:w-[45%] ${alignment === 'center' ? 'text-center md:text-left' : alignment === 'right' ? 'text-right md:text-left' : 'text-left'}`}>
          {/* Subheader with decoration */}
          <div className={`flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8 ${justifyClasses[alignment]}`}>
            {decoration === 'whiskers' && (
              <>
                <div className="h-[1px] w-6 sm:w-8 md:w-12 lg:w-16 bg-gradient-to-r from-transparent to-[var(--color-primary)]" />
                <span className="text-[var(--color-primary)] text-sm sm:text-sm md:text-base lg:text-lg tracking-[0.5em] uppercase font-playfair font-bold whitespace-pre-line">
                  {subheader}
                </span>
                <div className="h-[1px] w-6 sm:w-8 md:w-12 lg:w-16 bg-gradient-to-r from-[var(--color-primary)] to-transparent" />
              </>
            )}
            {decoration === 'dot' && (
              <>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                <span className="text-[var(--color-primary)] text-sm sm:text-sm md:text-base lg:text-lg tracking-[0.5em] uppercase font-playfair font-bold whitespace-pre-line">
                  {subheader}
                </span>
              </>
            )}
            {decoration === 'none' && (
              <span className="text-[var(--color-primary)] text-sm sm:text-sm md:text-base lg:text-lg tracking-[0.5em] uppercase font-playfair font-bold whitespace-pre-line">
                {subheader}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className={`font-title text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl ${titleColor ?? 'text-[var(--color-text-body)]'} ${titleClassName ?? ''} leading-tight`}>
            {title}
          </h2>
        </div>

        {/* Right Side: Body Text */}
        {bodyText && (
          <div className={`w-full md:w-[45%] mt-4 md:mt-0 ${alignment === 'center' ? 'text-center md:text-right' : alignment === 'right' ? 'text-right' : 'text-left'}`}>
            <p className={`text-base sm:text-base md:text-xl lg:text-2xl ${bodyColor ?? 'text-[var(--color-text-body)]'} opacity-80 body-text`}>
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
            <span className={`text-[var(--color-primary)] ${subheaderColor ? subheaderColor : ''} text-sm sm:text-sm md:text-base lg:text-lg tracking-[0.5em] uppercase font-playfair font-bold whitespace-pre-line`}>
              {subheader}
            </span>
            <div className="h-[1px] w-6 sm:w-8 md:w-12 lg:w-16 bg-gradient-to-r from-[var(--color-primary)] to-transparent" />
          </>
        )}
        {decoration === 'dot' && (
          <>
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
            <span className={`text-[var(--color-primary)] ${subheaderColor ? subheaderColor : ''} text-sm sm:text-sm md:text-base lg:text-lg tracking-[0.5em] uppercase font-playfair font-bold whitespace-pre-line`}>
              {subheader}
            </span>
          </>
        )}
        {decoration === 'none' && (
          <span className={`text-[var(--color-primary)] ${subheaderColor ? subheaderColor : ''} text-sm sm:text-sm md:text-base lg:text-lg tracking-[0.5em] uppercase font-playfair font-bold whitespace-pre-line`}>
            {subheader}
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className={`font-title text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl ${titleColor ?? 'text-[var(--color-text-body)]'} ${titleClassName ?? ''} leading-tight mb-3 sm:mb-4 md:mb-4`}>
        {title}
      </h2>

      {/* Body Text */}
      {bodyText && (
          <p className={`text-base sm:text-base md:text-xl lg:text-2xl ${bodyColor ?? 'text-[var(--color-text-body)]'} opacity-80 body-text max-w-4xl`}>
          {bodyText}
        </p>
      )}
    </div>
  );
}
