'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const HERO_VIDEO_SRC =
  'https://res.cloudinary.com/dqz1ffhyo/video/upload/v1766503247/WhatsApp_Video_2025-12-23_at_13.54.39_Precise_Proteus_tuqnir.mp4';

const HERO_VIDEO_STILL =
  'https://res.cloudinary.com/dqz1ffhyo/video/upload/q_auto:best,w_1920,so_0,f_jpg/v1766503247/WhatsApp_Video_2025-12-23_at_13.54.39_Precise_Proteus_tuqnir.jpg';

const SPLASH_DURATION_MS = 3200;
const EXIT_SLIDE_DURATION_S = 1.1;
const EXIT_SLIDE_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    try {
      const playPromise = videoRef.current.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    } catch {
      // ignore autoplay errors
    }
  }, []);

  useEffect(() => {
    if (!isClosing) return;
    try {
      videoRef.current?.pause();
    } catch {
      // ignore
    }
  }, [isClosing]);

  const MaskedLetterStill = (
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
            style={{
              fontFamily: 'var(--font-title)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: 'clamp(120px, 18vw, 260px)',
            }}
          >
            <tspan x="50%" dy="-0.55em">MIND</tspan>
            <tspan x="50%" dy="1.15em">SETTLER</tspan>
          </text>
        </mask>
      </defs>

      <g mask="url(#ms-text-mask)">
        <image href={HERO_VIDEO_STILL} x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </g>
    </svg>
  );

  const MaskedLetterVideo = (
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
            style={{
              fontFamily: 'var(--font-title)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: 'clamp(120px, 18vw, 260px)',
            }}
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
      className="fixed inset-0 z-[9999] bg-[var(--color-bg-app)] overflow-hidden"
      initial={{ y: 0 }}
      animate={{ y: isClosing ? '-100%' : 0 }}
      transition={isClosing ? { duration: EXIT_SLIDE_DURATION_S, ease: EXIT_SLIDE_EASE } : { duration: 0 }}
      onAnimationComplete={() => {
        if (isClosing) onComplete();
      }}
    >
      {/* While open, play video in the letters */}
      {!isClosing && MaskedLetterVideo}

      {/* When closing, freeze to still for a clean slide */}
      {isClosing && MaskedLetterStill}
    </motion.div>
  );
}