'use client';

import { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import { initFirebase } from '@/lib/firebase';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
 
  // Prevent hydration mismatch by not rendering splash until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
    </>
  );
}