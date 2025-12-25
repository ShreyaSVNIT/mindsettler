'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [slideUp, setSlideUp] = useState(false);

  useEffect(() => {
    // Wait for all resources to load
    const handleLoad = () => {
      if (document.readyState === 'complete') {
        // Minimum display time of 1.5 seconds
        setTimeout(() => {
          setSlideUp(true);
          // Notify parent that splash is complete after slide animation
          setTimeout(() => {
            onComplete();
          }, 800);
        }, 1500);
      }
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      
      // Fallback: Force hide after 3 seconds max
      const timeout = setTimeout(() => {
        setSlideUp(true);
        setTimeout(() => {
          onComplete();
        }, 800);
      }, 3000);

      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(timeout);
      };
    }
  }, [onComplete]);

  return (
    <div
      className={`
        fixed inset-0 z-[9999] 
        bg-bg-app 
        flex items-center justify-center
        transition-transform duration-[800ms] ease-in-out
        ${slideUp ? '-translate-y-full' : 'translate-y-0'}
      `}
    >
      <div className="flex flex-col items-center gap-16">
        {/* Logo with fade-in animation */}
        <div
          className="animate-fade-in"
          style={{
            animation: 'fadeIn 0.8s ease-in-out',
          }}
        >
          <Image
            src="/MindSettlerLogo.png"
            alt="MindSettler Logo"
            width={450}
            height={450}
            priority
            className="drop-shadow-2xl"
          />
        </div>

        {/* Loading bar */}
        <div className="w-[300px] h-2 bg-text-body/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-text-body rounded-full animate-loading-bar"
            style={{
              animation: 'loadingBar 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes loadingBar {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 70%;
            margin-left: 0%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
