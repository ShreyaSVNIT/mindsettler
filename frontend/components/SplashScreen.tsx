'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const HERO_VIDEO_SRC = 'https://res.cloudinary.com/dqz1ffhyo/video/upload/v1766503247/WhatsApp_Video_2025-12-23_at_13.54.39_Precise_Proteus_tuqnir.mp4';
const SPLASH_DURATION_MS = 3200;
const EXIT_SLIDE_DURATION_S = 1.8;
const EXIT_SLIDE_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];
const EXIT_WAVE_STRIP_HEIGHT_PX = 220;

const WAVE_PATH_A =
  'M0,0 L1440,0 L1440,160 C1040,100 1080,220 720,160 C400,100 360,220 0,160 Z';
const WAVE_PATH_B =
  'M0,0 L1440,0 L1440,170 C1100,80 1020,250 720,150 C420,70 340,250 0,170 Z';

const LETTER_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-title)',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontSize: 'clamp(140px, 20vw, 300px)',
};

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        (window as any).__msSplashDone = true;
        window.dispatchEvent(new Event('splashDone'));
      } catch {
        // ignore
      }

      setIsClosing(true);
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  // Play video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const maskedVideo = (
    <svg className="absolute inset-0 w-full h-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        <mask id="ms-text-mask" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="100%" height="100%" fill="black" />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            style={LETTER_STYLE}
          >
            <tspan x="50%" dy="-0.55em">MIND</tspan>
            <tspan x="50%" dy="1.15em">SETTLER</tspan>
          </text>
        </mask>
      </defs>

      <g mask="url(#ms-text-mask)">
        <foreignObject x="0" y="0" width="100%" height="100%">
          <div style={{ width: '100%', height: '100%' }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            >
              <source src={HERO_VIDEO_SRC} type="video/mp4" />
            </video>
          </div>
        </foreignObject>
      </g>
    </svg>
  );

  return (
    <motion.div
      className={`fixed inset-0 z-[9999] bg-[var(--color-bg-app)] ${isClosing ? 'overflow-visible' : 'overflow-hidden'}`}
      initial={{ y: 0 }}
      animate={{ y: isClosing ? `calc(-100% - ${EXIT_WAVE_STRIP_HEIGHT_PX}px)` : 0 }}
      transition={{ duration: EXIT_SLIDE_DURATION_S, ease: EXIT_SLIDE_EASE }}
      onAnimationComplete={() => {
        if (isClosing) onComplete();
      }}
    >
      {maskedVideo}

      {/*
        Wave-shaped reveal edge:
        This is a *real geometric edge* (transparent below the curve), not a drawn decoration.
        It attaches to the bottom of the splash layer and only appears during exit.
      */}
      {isClosing && (
        <div
          className="absolute left-0 top-full w-full"
          style={{ height: EXIT_WAVE_STRIP_HEIGHT_PX }}
          aria-hidden="true"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Fill ABOVE the wave, leave below transparent (so the edge is the wave). */}
            <motion.path
              initial={{ d: WAVE_PATH_A }}
              animate={{ d: WAVE_PATH_B }}
              transition={{
                duration: 0.6,
                ease: [0.65, 0, 0.35, 1],
                repeat: Infinity,
                repeatType: 'mirror',
              }}
              fill="var(--color-bg-app)"
            />
          </svg>
        </div>
      )}
    </motion.div>
  );
}