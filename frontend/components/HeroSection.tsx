'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import MagneticButton from './Button';

const HeroSection = () => {
  const [showContent, setShowContent] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasShownSplash = sessionStorage.getItem('splashShown');

    const startHero = () => {
      if (videoRef.current) {
        try {
          videoRef.current.currentTime = 0;
          const playPromise = videoRef.current.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
          }
        } catch {
          // ignore play errors
        }
      }

      // Let the video move a bit before text appears
      setTimeout(() => setShowContent(true), 800);
    };

    if (hasShownSplash) {
      // Subsequent visits: no splash, start immediately
      startHero();
      return;
    }

    const handleSplashDone = () => {
      startHero();
    };

    window.addEventListener('splashDone', handleSplashDone);
    return () => window.removeEventListener('splashDone', handleSplashDone);
  }, []);

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black text-center">
      {/* HIGH-CINEMATIC BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0">
        <video
          loop
          muted
          playsInline
          preload="auto"
          ref={videoRef}
          className="w-full h-full object-cover scale-110"
        >
          <source 
            src="https://res.cloudinary.com/dqz1ffhyo/video/upload/v1766503247/WhatsApp_Video_2025-12-23_at_13.54.39_Precise_Proteus_tuqnir.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* MAIN CONTENT - Animated from below */}
      {showContent && (
        <motion.div 
          className="relative z-10 px-6 max-w-5xl flex flex-col items-center"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.7, 0, 0.3, 1] }}
        >
        
        {/* TOP SUBTITLE */}
        <p className="font-body uppercase tracking-[0.6em] text-white/60 text-[clamp(0.7rem,1.2vw,0.9rem)] mb-8">
          Your Journey Inward Begins Here
        </p>

        {/* DECORATIVE WRAPPER FOR TITLE */}
        <div className="relative mb-10">
          {/* Decorative Swirl SVG */}
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

          {/* SIMPLIFIED HEADING */}
          <h1 className="font-title leading-none text-white text-[clamp(3.5rem,12vw,9rem)] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            Mind<span style={{ color: 'var(--color-bg-app)' }}>Settler</span>
          </h1>
        </div>

        {/* REFINED SUPPORTING TEXT */}
        <p className="font-body leading-relaxed text-white/80 text-[clamp(1rem,1.8vw,1.5rem)] max-w-[50ch] mb-12">
          Discover a sanctuary for <span className="text-white">emotional well-being</span>. 
          Expert psycho-education designed to help you navigate life's quieter, more profound moments.
        </p>

        {/* CALL TO ACTION */}
        <div>
          <MagneticButton text="Explore Further" />
        </div>
      </motion.div>
      )}

      {/* CENTERED SCROLL INDICATOR */}
      <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-4">
        <span className="font-body text-[10px] uppercase tracking-[0.4em] text-white/40">
          Scroll to Discover
        </span>
        <button 
          onClick={scrollToNextSection}
          className="
            group
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-white/5
            backdrop-blur-md
            transition-all
            duration-500
            hover:border-[var(--color-primary)]/50
            hover:bg-[var(--color-primary)]/10
          "
        >
          <div className="animate-bounce-slow">
            <ChevronDown size={24} color="white" strokeWidth={1} className="group-hover:text-[var(--color-primary)] transition-colors" />
          </div>
        </button>
      </div>

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