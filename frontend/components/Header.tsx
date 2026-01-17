'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { Calendar, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600", height: 400, column: 1 },
  { src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600", height: 500, column: 2 },
  { src: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=600", height: 450, column: 1 },
  { src: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?q=80&w=600", height: 550, column: 2 },
  { src: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=600", height: 480, column: 1 },
  { src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600", height: 420, column: 2 },
];

export default function IntegratedHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAtTop, setIsAtTop] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    // Navigate after animation completes
    setTimeout(() => {
      router.push(href);
    }, 800);
  };

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const currentY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsAtTop(currentY === 0);

          // If menu is open, keep header visible
          if (menuOpen) {
            setShowHeader(true);
            lastY = currentY;
            ticking = false;
            return;
          }

          const delta = currentY - lastY;
          const threshold = 10; // small buffer to avoid jitter
          if (delta > threshold && currentY > 50) {
            // scrolling down
            setShowHeader(false);
          } else if (delta < -threshold) {
            // scrolling up
            setShowHeader(true);
          }

          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const { body, documentElement } = document;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [menuOpen]);

  // Close menu on Escape for consistent behavior on mobile/tablet
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Home page at top: white, else: primary
  const isHome = pathname === '/' || pathname === '/home';
  const isHomeAtTop = isHome && isAtTop;
  const menuLinks = [
    { label: 'About', href: '/about' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Corporate', href: '/corporate' },
    { label: 'Resources', href: '/resources' },
    { label: 'Book Session', href: '/book' },
  ];

  return (
    <>
      {/* --- MAIN HEADER --- */}
      <header
        className={`fixed top-0 left-0 w-full z-[130] h-14 md:h-16 lg:h-20 group transform transition-transform duration-300 ${showHeader || menuOpen ? 'translate-y-0' : '-translate-y-full'
          } ${isAtTop ? 'bg-transparent' : 'bg-[var(--color-bg-card)]/80 backdrop-blur-xl border-b border-[var(--color-border)]/50'}`}
      >
        <div className="h-full w-full flex items-stretch relative">
          <div className={`w-24 md:w-28 lg:w-32 flex items-center justify-center border-r transition-all ${isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'}`}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="main-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className={`tap-target p-3 hover:scale-110 transition-all relative z-[140] ${isHomeAtTop ? 'text-white hover:text-white' : 'text-[var(--color-text-body)] opacity-70 hover:text-[var(--color-primary)]'} hover:opacity-100`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={menuOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {menuOpen ? <X className="w-6 h-6 md:w-7 md:h-7" /> : <Menu className="w-6 h-6 md:w-7 md:h-7" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>

          <nav className={`hidden lg:flex items-center px-8 gap-12 border-r transition-all ${isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'}`}>
            {['About', 'Corporate', 'Resources'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                className={`relative transition-colors group/link ${isHomeAtTop ? 'text-white hover:text-white' : 'text-[var(--color-text-body)] opacity-70 hover:text-[var(--color-primary)]'} hover:opacity-100`}
              >
                <span className={`relative text-[15px] uppercase tracking-[0.25em] font-bold transition-colors ${isHomeAtTop ? 'text-white group-hover/link:text-white' : 'text-[var(--color-text-body)] opacity-70 group-hover/link:text-[var(--color-primary)]'} group-hover/link:opacity-100`}>
                  {item}
                  <span className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-300 group-hover/link:w-full ${isHomeAtTop ? 'bg-white' : 'bg-[var(--color-primary)]'}`}></span>
                </span>
              </Link>
            ))}
          </nav>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-1 md:mt-0 flex items-center justify-center isolate pointer-events-none z-[150]">
            {/* Cloud Shape Background - Reduced Size & Opacity */}
            {pathname === '/' && isAtTop && (
              <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
                <div className="w-[240px] h-[60px] bg-white shadow-[0_0_40px_rgba(255,255,255,0.7)] rounded-[100%] blur-xl opacity-70"></div>
              </div>
            )}
            <Link href="/" className="block pointer-events-auto">
              <Image
                src="/MindSettlerLogo.png"
                alt="Logo"
                width={180}
                height={115}
                priority
                sizes="(max-width: 640px) 130px, 180px"
                className="max-w-none mx-auto w-32 h-auto md:w-auto"
              />
            </Link>
          </div>

          <div className="w-24 md:w-28 lg:w-32 lg:hidden" aria-hidden="true" />
          <div className={`hidden lg:flex ml-auto items-stretch gap-6 border-l transition-all ${isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'}`}>
            <Link href="/how-it-works" className={`flex items-center justify-center px-6 md:px-8 border-r transition-all hover:bg-[var(--color-primary)]/5 group/link ${isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'}`}>
              <span className={`relative text-[15px] uppercase tracking-[0.25em] font-bold transition-colors
                ${isHomeAtTop ? 'text-white group-hover/link:text-white' : 'text-[var(--color-text-body)] opacity-70 group-hover/link:text-[var(--color-primary)]'} group-hover/link:opacity-100`}
              >
                How It Works
                <span className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-300 group-hover/link:w-full ${isHomeAtTop ? 'bg-white' : 'bg-[var(--color-primary)]'}`}></span>
              </span>
            </Link>
            <Link href="/book" className={`flex items-center gap-3 px-6 md:px-8 border-r transition-all hover:bg-[var(--color-primary)]/5 group/book ${isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'}`}>
              <Calendar size={20} className={`${isHomeAtTop ? 'text-white group-hover/book:text-white' : 'text-[var(--color-text-body)] opacity-70 group-hover/book:text-[var(--color-primary)]'} transition-colors group-hover/book:opacity-100`} />
              <span className={`relative text-[14px] uppercase tracking-[0.15em] font-black transition-colors
                ${isHomeAtTop ? 'text-white group-hover/book:text-white' : 'text-[var(--color-text-body)] opacity-70 group-hover/book:text-[var(--color-primary)]'} group-hover/book:opacity-100`}
              >
                Book Session
                <span className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-300 group-hover/book:w-full ${isHomeAtTop ? 'bg-white' : 'bg-[var(--color-primary)]'}`}></span>
              </span>
            </Link>
            <Link
              href="/admin"
              className={`relative flex items-center justify-center px-6 md:px-8 transition-all group/link
                ${isHomeAtTop ? 'text-white hover:text-white' : 'text-[var(--color-text-body)] opacity-70 hover:text-[var(--color-primary)]'} hover:opacity-100`}
            >
              <span className="relative text-[15px] uppercase tracking-[0.25em] font-bold">
                Admin
                <span className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-300 group-hover/link:w-full ${isHomeAtTop ? 'bg-white' : 'bg-[var(--color-primary)]'}`}></span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* --- MENU OVERLAY --- */}
      <AnimatePresence mode="wait">
        {menuOpen && (
          <motion.div
            key="menu-overlay"
            id="main-menu"
            role="dialog"
            aria-modal="true"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1]
            }}
            className="fixed inset-0 z-[120] bg-[var(--color-primary)] flex overflow-hidden pt-16 lg:pt-20"
          >
            {/* Backdrop / tap-to-close for mobile */}
            <div
              className="absolute inset-0 z-0 lg:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            {/* LEFT SIDE: TEXT LINKS */}
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center p-4 sm:p-6 lg:p-16 relative z-10">
              <div className="pr-3">
                <div className="flex flex-col gap-[0.5px] pr-0">
                  {menuLinks.map((linkObj, i) => (
                    <motion.div
                      key={linkObj.label}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.45 }}
                      onMouseEnter={() => {
                        setHoveredLink(linkObj.label);
                        setHoveredIndex(i);
                      }}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="overflow-hidden -mt-[0.5px]"
                    >
                      <Link
                        href={linkObj.href}
                        onClick={(e) => handleLinkClick(e, linkObj.href)}
                        className="block"
                      >
                        <div className="overflow-hidden min-h-[1.75rem] sm:min-h-[2rem] md:min-h-[2.5rem] lg:min-h-[3rem]">
                          <motion.div
                            className="h-[200%] flex flex-col"
                            animate={hoveredLink === linkObj.label ? { y: '-50%' } : { y: '0%' }}
                            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
                          >
                            <div className="h-[49.5%] flex-none text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-title font-bold text-white leading-none uppercase tracking-tight">{linkObj.label}</div>
                            <div className={`h-[49.5%] flex-none text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-title font-bold text-white leading-none uppercase tracking-tight italic transition-all duration-300 ${hoveredLink === linkObj.label ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>{linkObj.label}</div>
                          </motion.div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: PARALLAX GALLERY */}
            <div className="hidden lg:flex w-1/2 h-full gap-6 p-8 relative">
              <motion.div
                className="flex-1 flex flex-col gap-6"
                animate={{ y: -hoveredIndex * 120 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {GALLERY_IMAGES.filter(img => img.column === 1).map((img, i) => (
                  <motion.div
                    key={i}
                    className="relative overflow-hidden shrink-0 rounded-xl shadow-2xl"
                    style={{ height: `${img.height}px` }}
                  >
                    <Image src={img.src} alt="wellness" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="flex-1 flex flex-col gap-6 pt-40"
                animate={{ y: hoveredIndex * 220 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                {GALLERY_IMAGES.filter(img => img.column === 2).map((img, i) => (
                  <motion.div
                    key={i}
                    className="relative overflow-hidden shrink-0 rounded-xl shadow-2xl"
                    style={{ height: `${img.height}px` }}
                  >
                    <Image src={img.src} alt="wellness" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}