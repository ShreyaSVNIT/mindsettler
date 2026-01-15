'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SplashScreen from './SplashScreen';
import { initFirebase } from '@/lib/firebase';
import { pingBackends } from '@/lib/api';
import ChatWidget from '@/app/ChatBot/ChatWidget';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hasShownSplash = sessionStorage.getItem('splashShown');
    const isHomePage = pathname === '/';

    if (isHomePage && !hasShownSplash) {
      Promise.resolve().then(() => setShowSplash(true));
      sessionStorage.setItem('splashShown', 'true');
    } else {
      Promise.resolve().then(() => setShowSplash(false));
      // Make downstream components behave the same as if the splash just finished.
      (window as any).__msSplashDone = true;
      setTimeout(() => {
        window.dispatchEvent(new Event('splashDone'));
      }, 0);
    }
    

    // Initialize Firebase Analytics (client-side only, Spark plan)
    initFirebase().catch((err) => {
      // Silently fail - analytics should never break the app
      if (process.env.NODE_ENV === 'development') {
        console.warn('Firebase initialization warning:', err);
      }
    });
    // Fire-and-forget pings to keep backends warm
    pingBackends().catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Backend ping warning:', err);
      }
    });
  }, [pathname]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };
 
  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {children}
      {!showSplash && <ChatWidget />}
    </>
  );
}