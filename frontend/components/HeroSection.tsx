'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
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
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-110"
          style={{ filter: 'contrast(1.05) brightness(0.7)' }}
        >
          <source 
            src="https://res.cloudinary.com/dqz1ffhyo/video/upload/v1766503247/WhatsApp_Video_2025-12-23_at_13.54.39_Precise_Proteus_tuqnir.mp4" 
            type="video/mp4" 
          />
        </video>
        {/* DARKER OVERLAY FOR TEXT READABILITY */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* MAIN CONTENT - CENTERED AS THE MAIN CHARACTER */}
      <div className="relative z-10 px-6 max-w-5xl flex flex-col items-center">
        
        {/* TOP SUBTITLE */}
        <p className="font-body uppercase tracking-[0.6em] text-white/60 text-[clamp(0.7rem,1.2vw,0.9rem)] mb-8 animate-fade-in">
          Your Journey Inward Begins Here
        </p>

        {/* DECORATIVE WRAPPER FOR TITLE */}
        <div className="relative mb-10">
          {/* Decorative Swirl SVG (Inspired by the reference image) */}
          <svg 
            className="absolute -top-16 -left-12 -right-12 h-[calc(100%+8rem)] w-[calc(100%+6rem)] text-[#F9D1D5]/30 pointer-events-none"
            viewBox="0 0 400 200" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 150Q100 20 200 100T390 50" stroke="currentColor" strokeWidth="0.5" />
            <path d="M20 170Q150 50 380 160" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="200" cy="100" r="80" stroke="currentColor" strokeWidth="0.2" opacity="0.5" />
          </svg>

          <h1 className="font-title leading-[1.1] text-white text-[clamp(3rem,10vw,7.5rem)] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            Embark on an <br />
            <span style={{ color: '#F9D1D5' }} className="italic">Inner Odyssey</span>
          </h1>
        </div>

        {/* REFINED SUPPORTING TEXT */}
        <p className="font-body leading-relaxed text-white/80 text-[clamp(1rem,1.8vw,1.5rem)] max-w-[50ch] mb-12">
          Discover a sanctuary for <span className="text-white">emotional well-being</span>. 
          Expert psycho-education designed to help you navigate life's quieter, more profound moments.
        </p>

        {/* CALL TO ACTION */}
        <button
          style={{ backgroundColor: '#F9D1D5' }}
          className="
            group
            rounded-full
            px-12
            py-5
            font-body
            text-[#453859]
            font-bold
            tracking-widest
            uppercase
            text-sm
            transition-all
            duration-500
            hover:scale-105
            hover:shadow-[0_0_60px_rgba(249,209,213,0.5)]
            active:scale-95
          "
        >
          Explore Further
        </button>
      </div>

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
            hover:border-[#F9D1D5]/50
            hover:bg-[#F9D1D5]/10
          "
        >
          <div className="animate-bounce-slow">
            <ChevronDown size={24} color="white" strokeWidth={1} className="group-hover:text-[#F9D1D5] transition-colors" />
          </div>
        </button>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-15%); }
          50% { transform: translateY(20%); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite ease-in-out;
        }

        .animate-fade-in {
          animation: fade-in 1.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;