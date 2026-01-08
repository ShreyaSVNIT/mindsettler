'use client';

import { useRef, useEffect, useCallback } from 'react';
import './GlowCard.css';

interface GlowCardProps {
  children?: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowIntensity?: number;
  glowRadius?: number;
}

/**
 * GlowCard Component
 * 
 * A card component with an animated border glow effect that follows the cursor.
 * 
 * How it works:
 * - Uses CSS custom properties (--glow-x, --glow-y, --glow-intensity) to track cursor position
 * - The ::after pseudo-element creates a radial gradient that follows the cursor
 * - The gradient is masked to only show on the border using CSS mask-composite
 * - The glow effect uses CSS variables for easy customization
 * 
 * @param children - Optional content to display inside the card
 * @param className - Additional CSS classes to apply to the card
 * @param glowColor - RGB color for the glow effect (default: "227, 115, 131" - primary pink)
 * @param glowIntensity - Intensity of the glow (0-1, default: 0.6)
 * @param glowRadius - Radius of the glow effect in pixels (default: 300)
 */
export default function GlowCard({
  children,
  className = '',
  glowColor = '227, 115, 131',
  glowIntensity = 0.6,
  glowRadius = 300
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const updateGlowPosition = useCallback((e: MouseEvent) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate relative position as percentage
    const relativeX = (mouseX / rect.width) * 100;
    const relativeY = (mouseY / rect.height) * 100;

    // Update CSS custom properties
    card.style.setProperty('--glow-x', `${relativeX}%`);
    card.style.setProperty('--glow-y', `${relativeY}%`);
    card.style.setProperty('--glow-intensity', glowIntensity.toString());
  }, [glowIntensity]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    card.addEventListener('mousemove', updateGlowPosition);

    return () => {
      card.removeEventListener('mousemove', updateGlowPosition);
    };
  }, [updateGlowPosition]);

  return (
    <div
      ref={cardRef}
      className={`glow-card ${className}`}
      style={{
        '--glow-color': glowColor,
        '--glow-radius': `${glowRadius}px`,
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-intensity': '0'
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
