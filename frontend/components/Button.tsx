'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface MagneticButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'lavender';
  size?: 'default' | 'small';
}

const MagneticButton = ({
  text = "Contact us",
  onClick,
  className = "",
  variant = 'default',
  size = 'default'
}: MagneticButtonProps) => {
  const baseStyles = variant === 'lavender'
    ? "bg-[var(--color-text-body)] border border-[var(--color-text-body)]"
    : "bg-[var(--color-primary)] border border-[var(--color-primary)]";

  const washEffectBg = variant === 'lavender'
    ? "bg-[var(--color-bg-lavender)]"
    : "bg-[var(--color-bg-app)]";

  const textColorDefault = variant === 'lavender'
    ? "text-[var(--color-bg-lavender)]"
    : "text-[var(--color-bg-app)]";

  const textColorHover = variant === 'lavender'
    ? "group-hover:text-[var(--color-text-body)]"
    : "group-hover:text-[var(--color-primary)]";

  const arrowBgDefault = variant === 'lavender'
    ? "bg-[var(--color-bg-lavender)]"
    : "bg-[var(--color-bg-app)]";

  const arrowBgHover = variant === 'lavender'
    ? "group-hover:bg-[var(--color-text-body)]"
    : "group-hover:bg-[var(--color-primary)]";

  const arrowColorDefault = variant === 'lavender'
    ? "text-[var(--color-text-body)]"
    : "text-[var(--color-primary)]";

  const arrowColorHover = variant === 'lavender'
    ? "group-hover:text-[var(--color-bg-lavender)]"
    : "group-hover:text-[var(--color-bg-app)]";

  // Size variations - Responsive by default
  const textSize = size === 'small'
    ? "text-base md:text-lg"
    : "text-xl md:text-3xl";

  const arrowContainerSize = size === 'small'
    ? "h-8 w-8 md:h-10 md:w-10"
    : "h-10 w-10 md:h-14 md:w-14";

  // Use Tailwind classes for icon sizing instead of fixed prop
  const arrowIconClass = size === 'small'
    ? "w-4 h-4"
    : "w-4 h-4 md:w-6 md:h-6";

  const buttonPadding = size === 'small'
    ? "py-1.5 pl-4 pr-1.5 gap-2 md:py-2 md:pl-6 md:pr-2 md:gap-3"
    : "py-2 pl-5 pr-2 gap-3 md:pl-8 md:gap-4";

  return (
    <button
      onClick={onClick}
      className={`
        group
        relative
        flex
        items-center
        ${buttonPadding}
        rounded-full
        overflow-hidden
        transition-all
        duration-500
        ${baseStyles}
        ${className}
      `}
    >
      {/* THE WASH EFFECT: Bottom-to-top background layer */}
      <div className={`
        absolute 
        inset-0 
        z-0 
        w-full 
        h-full 
        translate-y-full 
        ${washEffectBg}
        transition-transform 
        duration-500 
        ease-out 
        group-hover:translate-y-0
      `} />

      {/* Main Text */}
      <span className={`
        relative
        z-10
        font-title
        font-semibold
        ${textSize}
        uppercase
        tracking-tight 
        transition-colors 
        duration-500 
        ${textColorDefault}
        ${textColorHover}
      `}>
        {text}
      </span>

      {/* Arrow Circle Container */}
      <div className={`
        relative
        z-10
        flex 
        ${arrowContainerSize}
        items-center 
        justify-center 
        rounded-full 
        overflow-hidden
        transition-all 
        duration-500 
        ${arrowBgDefault}
        ${arrowBgHover}
      `}>
        {/* ARROW REPLACEMENT ANIMATION (Horizontal) */}
        <div className={`relative overflow-hidden ${arrowIconClass}`}>
          {/* Original Arrow: Slides out to the RIGHT */}
          <ArrowRight
            strokeWidth={1.5}
            className={`
              absolute 
              inset-0 
              w-full h-full
              transition-all 
              duration-500 
              ease-in-out 
              ${arrowColorDefault}
              group-hover:translate-x-full 
              group-hover:opacity-0
            `}
          />
          {/* New Arrow: Slides in from the LEFT */}
          <ArrowRight
            strokeWidth={1.5}
            className={`
              absolute 
              inset-0 
              w-full h-full
              -translate-x-full 
              opacity-0
              transition-all 
              duration-500 
              ease-in-out 
              ${arrowColorHover}
              group-hover:translate-x-0 
              group-hover:opacity-100
            `}
          />
        </div>
      </div>
    </button>
  );
};

export default MagneticButton;