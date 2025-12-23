'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react'; // Optional: install lucide-react or use a simple SVG

const HeroSection = () => {
  const scrollToNextSection = () => {
    // Finds the next section after the hero and scrolls it into view
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className="
        relative
        h-screen
        w-full
        flex
        items-center
        overflow-hidden
        bg-black
      "
    >
      {/* HIGH-CINEMATIC BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(1.05) brightness(0.85)' }}
        >
          <source 
            src="https://res.cloudinary.com/dqz1ffhyo/video/upload/q_auto:best,f_auto/hero-section.mp4" 
            type="video/mp4" 
          />
        </video>
        
        {/* CINEMATIC VIGNETTE */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-transparent to-black/20" />
      </div>

      {/* MAIN CONTENT */}
      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-7xl
          px-[clamp(1rem,4vw,3rem)]
        "
      >
        <div className="max-w-[45ch] space-y-[clamp(1.5rem,3vw,2rem)]">
          <p
            className="
              font-body
              uppercase
              tracking-[0.4em]
              text-white/70
              text-[clamp(0.65rem,1vw,0.75rem)]
            "
          >
            Online Psycho-Education & Support
          </p>

          <h1
            className="
              font-title
              leading-none
              text-white
              text-[clamp(3.5rem,8vw,6rem)]
              drop-shadow-2xl
            "
          >
            <span style={{ color: '#F9D1D5' }}>Mind</span>Settler
          </h1>

          <p
            className="
              font-body
              leading-relaxed
              text-white/90
              text-[clamp(1.1rem,1.6vw,1.35rem)]
              max-w-[35ch]
            "
          >
            A sanctuary for psycho-education and emotional well-being —
            offering clarity and compassion for life’s quieter moments.
          </p>

          <div className="pt-6">
            <button
              style={{ backgroundColor: '#F9D1D5' }}
              className="
                rounded-full
                px-10
                py-4
                font-body
                text-[#453859]
                font-bold
                tracking-wide
                transition-all
                duration-500
                hover:scale-105
                hover:shadow-[0_0_40px_rgba(249,209,213,0.4)]
              "
            >
              Book Your First Session
            </button>
          </div>
        </div>
      </div>

      {/* CENTERED SCROLL INDICATOR (As per provided image) */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="font-body text-[11px] uppercase tracking-[0.2em] text-white/80">
          Scroll to Discover
        </span>
        <button 
          onClick={scrollToNextSection}
          className="
            group
            relative
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            border
            border-white/30
            bg-white/10
            backdrop-blur-sm
            transition-all
            duration-300
            hover:border-white/80
            hover:bg-white/20
          "
        >
          <div className="animate-bounce-slow">
            <ChevronDown size={20} color="white" strokeWidth={1.5} />
          </div>
        </button>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-10%); }
          50% { transform: translateY(15%); }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;