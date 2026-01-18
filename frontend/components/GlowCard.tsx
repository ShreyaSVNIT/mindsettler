'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './GlowCard.css';

const DEFAULT_PARTICLE_COUNT = 6;
const DEFAULT_GLOW_COLOR = '227, 115, 131';

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'glow-card-particle';
  el.style.cssText = `
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 8px rgba(${color}, 0.8);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

interface GlowCardProps {
  children?: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowIntensity?: number;
  glowRadius?: number;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  enableParticles?: boolean;
  particleCount?: number;
}

/**
 * Enhanced GlowCard Component
 * 
 * A card component with an animated border glow effect that follows the cursor.
 * Includes interactive features: tilt, magnetism, and particle effects on hover.
 * 
 * How it works:
 * - Uses CSS custom properties (--glow-x, --glow-y, --glow-intensity) to track cursor position
 * - The ::after pseudo-element creates a radial gradient that follows the cursor
 * - The gradient is masked to only show on the border using CSS mask-composite
 * - Optional particle effects emit on hover using GSAP animations
 * - Optional 3D tilt effect for immersive interaction
 * - Optional magnetism effect that pulls the card toward the cursor
 * 
 * @param children - Optional content to display inside the card
 * @param className - Additional CSS classes to apply to the card
 * @param glowColor - RGB color for the glow effect (default: "227, 115, 131" - primary pink)
 * @param glowIntensity - Intensity of the glow (0-1, default: 0.6)
 * @param glowRadius - Radius of the glow effect in pixels (default: 300)
 * @param enableTilt - Enable 3D tilt on hover (default: true)
 * @param enableMagnetism - Enable card magnetism toward cursor (default: true)
 * @param enableParticles - Enable particle effects on hover (default: true)
 * @param particleCount - Number of particles to emit (default: 6)
 */
export default function GlowCard({
  children,
  className = '',
  glowColor = DEFAULT_GLOW_COLOR,
  glowIntensity = 0.6,
  glowRadius = 300,
  enableTilt = true,
  enableMagnetism = true,
  enableParticles = true,
  particleCount = DEFAULT_PARTICLE_COUNT
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);
  
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const touch = 'ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsTouchDevice(Boolean(touch));
    setReduceMotion(Boolean(reduced));
  }, []);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current || !enableParticles) return;
    if (isTouchDevice) return; // disable heavy particle work on touch
    if (reduceMotion) return; // respect reduced motion

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current!.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 60,
          y: (Math.random() - 0.5) * 60,
          rotation: Math.random() * 360,
          duration: 1.5 + Math.random() * 1.5,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.2,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles, enableParticles]);

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

    // Tilt effect
    const tiltEnabled = enableTilt && !isTouchDevice && !reduceMotion;
    if (tiltEnabled) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((mouseY - centerY) / centerY) * -4;
      const rotateY = ((mouseX - centerX) / centerX) * 4;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.2,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    }

    // Magnetism effect
    const magnetismEnabled = enableMagnetism && !isTouchDevice;
    if (magnetismEnabled && isHoveredRef.current) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const magnetX = (mouseX - centerX) * 0.02;
      const magnetY = (mouseY - centerY) * 0.02;

      magnetismAnimationRef.current = gsap.to(card, {
        x: magnetX,
        y: magnetY,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [glowIntensity, enableTilt, enableMagnetism]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // keep hover/particle/magnetism logic here; view animations handled by consumer

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      if (enableParticles && !isTouchDevice && !reduceMotion) {
        animateParticles();
      }
      gsap.to(card, {
        duration: 0.3,
        ease: 'power2.out',
        onStart: () => {
          card.style.setProperty('--brand-shadow', `0 20px 50px rgba(${glowColor}, 0.25)`);
        }
      });
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      if (enableParticles) {
        clearAllParticles();
      }

      if (enableTilt || enableMagnetism) {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
          onStart: () => {
            card.style.setProperty('--brand-shadow', `0 12px 40px rgba(${glowColor}, 0.1)`);
          }
        });
      } else {
        gsap.to(card, {
          duration: 0.3,
          ease: 'power2.out',
          onStart: () => {
            card.style.setProperty('--brand-shadow', `0 12px 40px rgba(${glowColor}, 0.1)`);
          }
        });
      }

      card.style.setProperty('--glow-intensity', '0');
    };

    // Only attach pointer listeners for non-touch devices
    if (!isTouchDevice) {
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
      card.addEventListener('mousemove', updateGlowPosition);
    }

    return () => {
      isHoveredRef.current = false;
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mousemove', updateGlowPosition);
      if (enableParticles) {
        clearAllParticles();
      }
      // no-op cleanup for view observer (handled by consumer components)
    };
  }, [updateGlowPosition, animateParticles, clearAllParticles, enableParticles, enableTilt, enableMagnetism, glowColor, isTouchDevice, reduceMotion]);

  const baseCardClasses = 'group overflow-hidden rounded-xl border shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md';

  return (
    <div
      ref={cardRef}
      className={`glow-card ${baseCardClasses} ${className}`}
      style={{
        '--glow-color': glowColor,
        '--brand-pink': glowColor,
        '--brand-shadow': `0 12px 40px rgba(${glowColor}, 0.1)`,
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
