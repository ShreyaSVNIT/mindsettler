'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Calendar, MapPin, Phone, Menu, X, Instagram, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Wellness-themed images for the gallery
const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600", height: 400, column: 1 },
  { src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600", height: 500, column: 2 },
  { src: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=600", height: 450, column: 1 },
  { src: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?q=80&w=600", height: 550, column: 2 },
  { src: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600", height: 480, column: 1 },
  { src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600", height: 420, column: 2 },
];

export default function IntegratedHeader() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(0);

  useEffect(() => {
    let ticking = false;
    
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Check if at top
          setIsAtTop(currentScrollY === 0);
          
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setScrollDirection('down');
          } else if (currentScrollY < lastScrollY) {
            setScrollDirection('up');
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* --- SEGMENTED MAIN HEADER (Based on Reference Image) --- */}
      <header
        suppressHydrationWarning
        className={`
          fixed top-0 left-0 w-full z-[130] 
          transition-all duration-500 ease-in-out
          h-20 group
          ${isAtTop 
            ? 'bg-transparent border-transparent' 
            : 'bg-[var(--color-bg-card)]/80 backdrop-blur-xl border-b border-[var(--color-border)]/50'}
        `}
      >
        <div className="h-full w-full flex items-stretch">
          
          {/* 1. HAMBURGER BUTTON CELL */}
          <div className={`flex items-center justify-center px-8 border-r transition-all ${
            isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'
          }`}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 hover:scale-110 transition-all relative z-[140] ${isAtTop ? 'text-white' : 'text-[var(--color-text-body)]'}`}
            >
              {menuOpen ? <X size={28} strokeWidth={2} /> : <Menu size={28} strokeWidth={2} />}
            </button>
          </div>

          {/* 2. NAVIGATION LINKS CELL */}
          <nav className={`hidden xl:flex items-center px-12 gap-10 border-r transition-all ${
            isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'
          }`}>
            {['About', 'How It Works', 'Resources'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                className={`relative text-[15px] uppercase tracking-[0.25em] font-bold hover:text-[var(--color-primary)] transition-colors py-1 group/link ${
                  isAtTop ? 'text-white' : 'text-[var(--color-text-body)]'
                }`}
              >
                {item}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[var(--color-primary)] transition-all duration-300 group-hover/link:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* 3. LOGO CELL (Fluid Space) */}
          <div className="flex-grow relative flex items-center justify-center px-8">
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 transition-all duration-500 mt-2">
              <Image 
                src="/MindSettlerLogo.png" 
                alt="MindSettler" 
                width={200}
                height={67}
                className="transition-all duration-500"
                priority
              />
            </Link>
          </div>

          {/* 4. UTILITY ACTIONS CELLS */}
          <div className={`hidden lg:flex items-stretch border-l transition-all ${
            isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'
          }`}>
            
            <Link 
              href="/book" 
              className={`flex items-center gap-3 px-8 border-r transition-all hover:bg-[var(--color-primary)]/5 group/book ${
                isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'
              }`}
            >
              <Calendar size={20} strokeWidth={2} className={`group-hover/book:text-[var(--color-primary)] transition-colors ${
                isAtTop ? 'text-white' : 'text-[var(--color-text-body)]'
              }`} />
              <span className={`relative text-[14px] uppercase tracking-[0.15em] font-black group-hover/book:text-[var(--color-primary)] transition-colors ${
                isAtTop ? 'text-white' : 'text-[var(--color-text-body)]'
              }`}>
                Book Session
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[var(--color-primary)] transition-all duration-300 group-hover/book:w-full"></span>
              </span>
            </Link>

            <Link 
              href="/visit" 
              className={`flex items-center gap-3 px-8 border-r transition-all hover:bg-[var(--color-primary)]/5 group/visit ${
                isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'
              }`}
            >
              <MapPin size={20} strokeWidth={2} className={`group-hover/visit:text-[var(--color-primary)] transition-colors ${
                isAtTop ? 'text-white' : 'text-[var(--color-text-body)]'
              }`} />
              <span className={`relative text-[14px] uppercase tracking-[0.15em] font-black group-hover/visit:text-[var(--color-primary)] transition-colors ${
                isAtTop ? 'text-white' : 'text-[var(--color-text-body)]'
              }`}>
                Visit Us
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[var(--color-primary)] transition-all duration-300 group-hover/visit:w-full"></span>
              </span>
            </Link>

            <div className="flex items-center gap-3 px-8">
              <Phone size={20} strokeWidth={2} className={isAtTop ? 'text-white' : 'text-[var(--color-primary)]'} />
              <span className={`text-[15px] font-black ${
                isAtTop ? 'text-white' : 'text-[var(--color-text-body)]'
              }`}>
                +44 (0)330 311 7799
              </span>
            </div>
          </div>

          {/* MOBILE SPACER */}
          <div className="lg:hidden w-16 border-l border-[#e8e6eb]" />
        </div>
      </header>

      {/* --- FULLSCREEN MENU OVERLAY (Unchanged Logic) --- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-20 left-0 right-0 bottom-0 z-[120] bg-[var(--color-primary)] flex" // Starts below header
          >
            {/* LEFT SIDE: TEXT LINKS */}
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center p-12 lg:p-24 relative z-10">
              <div className="space-y-4">
                {['About', 'How It Works', 'Resources'].map((link, i) => (
                  <motion.div
                    key={link}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    onMouseEnter={() => setHoveredIndex(i)}
                  >
                    <Link 
                      href={`/${link.toLowerCase().replace(/ /g, '-')}`}
                      onClick={() => setMenuOpen(false)}
                      className="text-6xl lg:text-8xl font-title font-bold text-white hover:text-white/40 transition-colors duration-300 block"
                    >
                      {link}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-20 space-y-2 text-white font-body">
                <p className="text-xl font-medium">+44 (0)330 311 7799</p>
                <p className="text-xl font-medium underline">hello@mindsettler.com</p>
              </div>

              <div className="mt-auto flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-white/80">
                <div className="flex gap-6"><span>Privacy</span><span>Terms</span><span>Cookies</span></div>
                <div className="flex items-center gap-4">
                   <Instagram size={18} />
                   <Linkedin size={18} />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: MASONRY GALLERY (Unchanged Logic) */}
            <div className="hidden lg:flex w-1/2 h-full overflow-hidden gap-4 p-6 relative">
              {/* Column 1 */}
              <motion.div 
                className="flex-1 flex flex-col gap-4"
                animate={{ y: -hoveredIndex * 80 }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {GALLERY_IMAGES.filter(img => img.column === 1).map((img, i) => (
                  <div key={i} className="relative overflow-hidden shrink-0 rounded-sm" style={{ height: `${img.height}px` }}>
                    <Image src={img.src} alt="wellness" fill className="object-cover" />
                  </div>
                ))}
              </motion.div>

              {/* Column 2 */}
              <motion.div 
                className="flex-1 flex flex-col gap-4 pt-32"
                animate={{ y: hoveredIndex * 80 }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {GALLERY_IMAGES.filter(img => img.column === 2).map((img, i) => (
                  <div key={i} className="relative overflow-hidden shrink-0 rounded-sm" style={{ height: `${img.height}px` }}>
                    <Image src={img.src} alt="wellness" fill className="object-cover" />
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}