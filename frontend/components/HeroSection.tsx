'use client';

import React from 'react';

const HeroSection = () => {
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

      {/* SCROLL TO DISCOVER - BOTTOM RIGHT */}
      <div className="absolute bottom-10 right-10 z-20 flex flex-col items-center gap-4">
        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/50 vertical-text">
          Scroll to Discover
        </span>
        <div className="relative h-24 w-[1px] bg-white/20 overflow-hidden">
            {/* THE GLOWING RADIANT LINE */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#F9D1D5] to-transparent animate-scroll-line shadow-[0_0_8px_#F9D1D5]" />
        </div>
      </div>

      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        .animate-scroll-line {
          animation: scroll-line 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;