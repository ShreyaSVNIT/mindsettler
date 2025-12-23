'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface MagneticButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

const MagneticButton = ({ 
  text = "Contact us", 
  onClick, 
  className = "" 
}: MagneticButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        group
        relative
        flex
        items-center
        gap-6
        rounded-full
        py-3
        pl-10
        pr-3
        overflow-hidden
        transition-all
        duration-500
        bg-[var(--color-primary)]
        border border-[var(--color-primary)]
        ${className}
      `}
    >
      {/* THE WASH EFFECT: Bottom-to-top background layer */}
      <div className="
        absolute 
        inset-0 
        z-0 
        w-full 
        h-full 
        translate-y-full 
        bg-[var(--color-bg-app)] 
        transition-transform 
        duration-500 
        ease-out 
        group-hover:translate-y-0
      " />

      {/* Main Text */}
      <span className="
        relative
        z-10
        font-body 
        text-xl 
        tracking-tight 
        transition-colors 
        duration-500 
        text-[var(--color-bg-app)]
        group-hover:text-[var(--color-primary)]
      ">
        {text}
      </span>

      {/* Arrow Circle Container */}
      <div className="
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
        bg-[var(--color-bg-app)]
        group-hover:bg-[var(--color-primary)]
      ">
        {/* ARROW REPLACEMENT ANIMATION (Horizontal) */}
        <div className="relative h-6 w-6 overflow-hidden">
          {/* Original Arrow: Slides out to the RIGHT */}
          <ArrowRight 
            size={24} 
            strokeWidth={1.5}
            className="
              absolute 
              inset-0 
              transition-all 
              duration-500 
              ease-in-out 
              text-[var(--color-primary)] 
              group-hover:translate-x-full 
              group-hover:opacity-0
            " 
          />
          {/* New Arrow: Slides in from the LEFT */}
          <ArrowRight 
            size={24} 
            strokeWidth={1.5}
            className="
              absolute 
              inset-0 
              -translate-x-full 
              opacity-0
              transition-all 
              duration-500 
              ease-in-out 
              text-[var(--color-bg-app)] 
              group-hover:translate-x-0 
              group-hover:opacity-100
            " 
          />
        </div>
      </div>
    </button>
  );
};

export default MagneticButton;