'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Calendar, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600", height: 400, column: 1 },
  { src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600", height: 500, column: 2 },
  { src: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=600", height: 450, column: 1 },
  { src: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?q=80&w=600", height: 550, column: 2 },
  { src: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600", height: 480, column: 1 },
  { src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600", height: 420, column: 2 },
];

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Resources", href: "/resources" },
];

export default function IntegratedHeader() {
  const router = useRouter();
  const [isAtTop, setIsAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    setTimeout(() => {
      router.push(href);
    }, 800);
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY === 0) {
        setIsAtTop(true);
        setIsVisible(true);
      } else {
        setIsAtTop(false);
        if (currentScrollY < lastScrollY) setIsVisible(true);
        else if (currentScrollY > lastScrollY) setIsVisible(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reveal = () => setTimeout(() => setShowIntro(true), 200);

    if ((window as any).__msSplashDone) {
      setShowIntro(true);
      return;
    }

    const handleSplashDone = () => reveal();
    window.addEventListener('splashDone', handleSplashDone);
    return () => window.removeEventListener('splashDone', handleSplashDone);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 w-full z-[130] transition-all duration-500 h-20 group ${isAtTop ? 'bg-transparent' : 'bg-[var(--color-bg-card)]/80 backdrop-blur-xl border-b border-[var(--color-border)]/50'
          } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="h-full w-full flex items-stretch">
          <div className={`flex items-center justify-center px-8 border-r transition-all ${isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'}`}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 hover:scale-110 transition-all relative z-[140] ${isAtTop ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-body)]'}`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={menuOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>

          <nav className={`hidden xl:flex items-center px-12 gap-10 border-r transition-all ${isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'}`}>
            {NAV_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className={`relative text-[15px] uppercase tracking-[0.25em] font-bold hover:text-[var(--color-primary)] transition-colors group/link ${isAtTop ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-body)]'}`}>
                {item.label}
                <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[var(--color-primary)] transition-all duration-300 group-hover/link:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className="flex-grow relative flex items-center justify-center px-8">
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 mt-2">
              <img
                src="/MindSettlerLogo.png"
                alt="Logo"
                className="w-[180px] h-auto"
              />
            </Link>
          </div>

          <div className={`hidden lg:flex items-stretch border-l transition-all ${isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'}`}>
            <Link href="/book" className={`flex items-center gap-3 px-8 border-r transition-all hover:bg-[var(--color-primary)]/5 group/book ${isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'}`}>
              <Calendar size={20} className={isAtTop ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-body)]'} />
              <span className={`text-[14px] uppercase tracking-[0.15em] font-black ${isAtTop ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-body)]'}`}>Book Session</span>
            </Link>
            <Link href="/login" className={`flex items-center gap-3 px-6 border-r transition-all hover:bg-[var(--color-primary)]/5 ${isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'}`}>
              <span className={`text-[14px] uppercase tracking-[0.15em] font-black ${isAtTop ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-body)]'}`}>Login</span>
            </Link>
            <Link href="/get-started" className={`flex items-center gap-3 px-6 transition-all hover:bg-[var(--color-primary)]/5`}>
              <span className={`text-[14px] uppercase tracking-[0.15em] font-black ${isAtTop ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-body)]'}`}>Sign up</span>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* --- MENU OVERLAY --- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu-overlay"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-20 left-0 right-0 h-[calc(100vh-5rem)] z-[120] bg-[var(--color-primary)] flex overflow-hidden"
          >
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center p-12 lg:p-24 relative z-10">
              <div className="space-y-4">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    onMouseEnter={() => { setHoveredLink(link.label); setHoveredIndex(i); }}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <Link href={link.href} onClick={(e) => handleLinkClick(e, link.href)}>
                      <div className="overflow-hidden h-[4.5rem] lg:h-[7.5rem]">
                        <motion.div animate={hoveredLink === link.label ? { y: '-50%' } : { y: '0%' }} transition={{ duration: 0.4 }}>
                          <div className="text-6xl lg:text-8xl font-title font-bold text-white uppercase tracking-tighter">{link.label}</div>
                          <div className="text-6xl lg:text-8xl font-title font-bold text-white uppercase tracking-tighter italic">{link.label}</div>
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Gallery part omitted for brevity, but remains identical to your original code */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}