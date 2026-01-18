"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from './Button';
import AnimatedLogo from './AnimatedLogo';

const HERO_VIDEO_POSTER =
  'https://res.cloudinary.com/dqz1ffhyo/video/upload/q_auto:best,w_1920,so_0,f_jpg/v1766503247/WhatsApp_Video_2025-12-23_at_13.54.39_Precise_Proteus_tuqnir.jpg';

const HeroSection: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);

    const startHero = () => {
      if (videoRef.current) {
        try {
          const playPromise = videoRef.current.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => { });
          }
        } catch {
          // ignore play errors
        }
      }

      setTimeout(() => setShowContent(true), 150);
    };

    if ((window as any).__msSplashDone) {
      startHero();
      return;
    }

    const handleSplashDone = () => startHero();
    window.addEventListener('splashDone', handleSplashDone);
    return () => {
      window.removeEventListener('splashDone', handleSplashDone);
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  // Parallax effect: move video slower than scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (prefersReducedMotion) return;

    let ticking = false;
    const factor = 0.22; // slower rate than content

    const onScroll = () => {
      if (!parallaxRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY || window.pageYOffset;
          // translate less than scroll for subtle parallax
          const translateY = Math.round(scrolled * factor);
          parallaxRef.current!.style.transform = `translate3d(0, calc(${translateY}px - 0px), 0)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // run once to set initial position
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [prefersReducedMotion]);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black text-center py-12 md:py-24">
      <div ref={parallaxRef} className="absolute inset-0 z-0" style={{ willChange: 'transform' }}>
        <video
          loop
          muted
          playsInline
          preload="metadata"
          ref={videoRef}
          poster={HERO_VIDEO_POSTER}
          className="w-full h-full object-cover object-center md:object-top md:scale-105 lg:scale-110"
        >
          <source
            src="https://res.cloudinary.com/dqz1ffhyo/video/upload/q_auto:best,w_1920/v1766503247/WhatsApp_Video_2025-12-23_at_13.54.39_Precise_Proteus_tuqnir.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/30" />
      </div>

      {showContent && (
        <motion.div
          className="relative z-10 px-6 max-w-6xl mx-auto flex flex-col items-center"
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          animate={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: 1.0, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
        >
          <p className="font-playfair font-bold uppercase tracking-[0.5em] text-white text-[clamp(0.85rem,1.5vw,1.1rem)] mb-8">
            Your Journey Inward Begins Here
          </p>

          <div className="relative mb-10">
            <svg
              className="absolute -top-16 -left-12 -right-12 h-[calc(100%+8rem)] w-[calc(100%+6rem)] text-[var(--color-primary)]/20 pointer-events-none"
              viewBox="0 0 400 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 150Q100 20 200 100T390 50" stroke="currentColor" strokeWidth="0.5" />
              <path d="M20 170Q150 50 380 160" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="200" cy="100" r="80" stroke="currentColor" strokeWidth="0.2" opacity="0.3" />
            </svg>

            <h1 className="font-title leading-none text-[clamp(3.5rem,12vw,9rem)] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <AnimatedLogo isDark={true} />
            </h1>
          </div>

          <p className="font-body leading-relaxed text-white text-[clamp(1.1rem,2.0vw,1.4rem)] max-w-[50ch] mb-8 md:mb-12">
            <span className="block md:hidden">Confidential therapy sessions. Book a free consultation.</span>
            <span className="hidden md:block">Discover a sanctuary for <span className="text-white">emotional well-being</span>. Expert psycho-education designed to help you navigate life's quieter, more profound moments.</span>
          </p>

          <div className="flex items-center gap-4">
            <MagneticButton text="Explore" href="/how-it-works" aria-label="Explore how MindSettler works" />
            <MagneticButton text="Book" href="/book" aria-label="Book a session" />
          </div>
        </motion.div>
      )}

      <div className="h-12 md:h-20" aria-hidden="true" />

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-15%); }
          50% { transform: translateY(20%); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite ease-in-out;
        }

        .animate-fade-in {
          animation: fade-in 1.2s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;