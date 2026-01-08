'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface MagneticButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'lavender';
}

const MagneticButton = ({ 
  text = "Contact us", 
  onClick, 
  className = "",
  variant = 'default'
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

  return (
    <button
      onClick={onClick}
      className={`
        group
        relative
        flex
        items-center
        gap-4
        rounded-full
        py-3
        pl-8
        pr-3
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
        text-2xl
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
        h-14 
        w-14 
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
        <div className="relative h-6 w-6 overflow-hidden">
          {/* Original Arrow: Slides out to the RIGHT */}
          <ArrowRight 
            size={24} 
            strokeWidth={1.5}
            className={`
              absolute 
              inset-0 
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
            size={24} 
            strokeWidth={1.5}
            className={`
              absolute 
              inset-0 
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