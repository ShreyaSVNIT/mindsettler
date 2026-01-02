'use client';

import { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import { initFirebase } from '@/lib/firebase';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Important: render the same tree on server + initial client render to avoid hydration mismatches.
  // We only decide to show the splash after mount.
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasShownSplash = sessionStorage.getItem('splashShown');

    if (hasShownSplash) {
      setShowSplash(false);

      // Make downstream components behave the same as if the splash just finished.
      // Use a microtask so listeners have a chance to attach.
      (window as any).__msSplashDone = true;
      setTimeout(() => {
        window.dispatchEvent(new Event('splashDone'));
      }, 0);
    } else {
      setShowSplash(true);
      sessionStorage.setItem('splashShown', 'true');
    }

    // Initialize Firebase Analytics (client-side only, Spark plan)
    initFirebase().catch((err) => {
      // Silently fail - analytics should never break the app
      if (process.env.NODE_ENV === 'development') {
        console.warn('Firebase initialization warning:', err);
      }
    });
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };
 
  return (
    <>
      {/* App (hero + header) always rendered so video can play under splash */}
      {children}

      {/* Splash overlays on top, then unmounts with no cross-cut */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
    </>
  );
}