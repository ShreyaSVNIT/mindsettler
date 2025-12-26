'use client';

import { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Check if splash screen has been shown in this session
    const hasShownSplash = sessionStorage.getItem('splashShown');
    
    if (!hasShownSplash) {
      // Show splash screen
      setShowSplash(true);
      sessionStorage.setItem('splashShown', 'true');
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {children}
    </>
  );
}
