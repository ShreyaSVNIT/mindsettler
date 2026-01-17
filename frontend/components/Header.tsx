'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import { Calendar, Menu, X, Info, Building2, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';
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
  const headerRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const [compactNav, setCompactNav] = useState(false);
  const ICON_CLASS = 'w-5 h-5 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-5 xl:h-5';

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

  // Detect overlap between center logo and nav items; switch to compact spacing when overlap occurs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkOverlap = () => {
      if (!logoRef.current || !navRef.current) {
        setCompactNav(false);
        return;
      }
      // Only run on large screens where nav is visible
      if (window.innerWidth < 1024) {
        setCompactNav(false);
        return;
      }
      const logoRect = logoRef.current.getBoundingClientRect();
      const navLinks = Array.from(navRef.current.querySelectorAll('a')) as HTMLElement[];
      let overlap = false;
      for (const link of navLinks) {
        const r = link.getBoundingClientRect();
        if (!(r.right < logoRect.left || r.left > logoRect.right)) {
          overlap = true;
          break;
        }
      }
      setCompactNav(overlap);
    };

    const onResize = () => checkOverlap();
    window.addEventListener('resize', onResize);
    const obs = new MutationObserver(() => checkOverlap());
    if (headerRef.current) obs.observe(headerRef.current, { childList: true, subtree: true });
    // initial check
    checkOverlap();

    return () => {
      window.removeEventListener('resize', onResize);
      obs.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const body = document.body;
    const documentElement = document.documentElement;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;

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

  // Full-screen menu images (random selection from public/img1..img13)
  const [overlayImages, setOverlayImages] = useState<string[]>([]);
  useEffect(() => {
    // pick 6 unique random images from 1..13
    const picks = new Set<number>();
    while (picks.size < 6) picks.add(Math.floor(Math.random() * 13) + 1);
    setOverlayImages(Array.from(picks).map((n) => `/img${n}.jpg`));
  }, []);

  return (
    <>
      {/* --- MAIN HEADER --- */}
      <header
        className={`fixed top-0 left-0 w-full z-[130] h-14 md:h-16 lg:h-20 group transform transition-transform duration-300 ${showHeader || menuOpen ? 'translate-y-0' : '-translate-y-full'} ${isAtTop ? 'bg-transparent' : 'bg-[var(--color-bg-card)]/80 backdrop-blur-xl border-b border-[var(--color-border)]/50'}`}
      >
        <div className="h-full w-full flex items-stretch relative">
          {/* LEFT: menu button + nav (balanced) */}
          <div className="flex items-center flex-1">
            <div className={`w-20 md:w-24 lg:w-28 flex items-center justify-center h-full border-r transition-all ${isAtTop ? 'border-transparent' : 'border-[var(--color-primary)]'}`}>
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
                    {menuOpen ? <X className={ICON_CLASS} /> : <Menu className={ICON_CLASS} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>

            <nav ref={navRef} className={`hidden lg:flex items-center h-full px-6 gap-6 xl:gap-8 border-r transition-all ${isAtTop ? 'border-transparent' : 'border-[var(--color-primary)]'}`}>
              {[
                { label: 'About', href: '/about', Icon: Info },
                { label: 'Corporate', href: '/corporate', Icon: Building2 },
                { label: 'Resources', href: '/resources', Icon: BookOpen }
              ].map((item) => {
                const linkColorClass = isHomeAtTop ? 'text-white hover:text-white' : 'text-[var(--color-text-body)] hover:text-[var(--color-primary)]';
                const iconColorClass = isHomeAtTop ? 'text-white' : 'text-[var(--color-text-body)] group-hover/link:text-[var(--color-primary)]';
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => { if (menuOpen) setMenuOpen(false); }}
                    className={`relative transition-colors group/link flex items-center justify-center ${linkColorClass}`}
                    title={item.label}
                  >
                    <item.Icon className={`2xl:hidden ${ICON_CLASS} ${iconColorClass}`} />
                    <span className={`hidden 2xl:block relative text-[15px] uppercase tracking-[0.25em] font-bold transition-colors ${linkColorClass} group-hover/link:opacity-100`}>
                      {item.label}
                      <span className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-300 group-hover/link:w-full ${isHomeAtTop ? 'bg-white' : 'bg-[var(--color-primary)]'}`}></span>
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* CENTER: logo */}
          <div ref={logoRef} className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center isolate pointer-events-none z-[150]">
            {pathname === '/' && isAtTop && (
              <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
                <div className="w-[240px] h-[60px] bg-white shadow-[0_0_40px_rgba(255,255,255,0.7)] rounded-[100%] blur-xl opacity-70"></div>
              </div>
            )}
            <Link href="/" className="block pointer-events-auto">
              <Image
                src="/MindSettlerLogo.png"
                alt="Logo"
                width={220}
                height={140}
                priority
                sizes="(max-width: 640px) 130px, (max-width: 1024px) 160px, 220px"
                className="max-w-none mx-auto w-32 h-auto md:w-40 lg:w-48 xl:w-52"
              />
            </Link>
          </div>

          {/* RIGHT: condensed actions */}
            <div className="flex items-center justify-end flex-1 gap-1">
            <div className="w-20 md:w-24 lg:hidden flex items-center justify-center gap-2 border-l border-[var(--color-primary)]/20 pr-2">
              <Link href="/admin" className={`tap-target p-2 hover:scale-110 transition-all ${isHomeAtTop ? 'text-white hover:text-white' : 'text-[var(--color-text-body)] opacity-70 hover:text-[var(--color-primary)]'}`} title="Admin">
                <ShieldCheck className={ICON_CLASS} />
              </Link>
              <Link href="/book" className={`tap-target p-2 hover:scale-110 transition-all ${isHomeAtTop ? 'text-white hover:text-white' : 'text-[var(--color-text-body)] opacity-70 hover:text-[var(--color-primary)]'}`}>
                <Calendar className={ICON_CLASS} />
              </Link>
            </div>

            <div className={`hidden lg:flex items-stretch h-full gap-4 xl:gap-6 border-l transition-all ${isAtTop ? 'border-transparent' : 'border-[var(--color-primary)]'}`}>
              <Link href="/how-it-works" className={`flex items-center justify-center gap-2 min-w-[150px] md:min-w-[170px] px-3 md:px-4 border-r transition-all hover:bg-[var(--color-primary)]/5 group/link ${isAtTop ? 'border-transparent' : 'border-[var(--color-primary)]'}`} title="How It Works">
                <Sparkles className={`2xl:hidden ${ICON_CLASS} ${isHomeAtTop ? 'text-white' : 'text-[var(--color-text-body)] group-hover/link:text-[var(--color-primary)]'}`} />
                <span className={`hidden 2xl:block relative text-[15px] uppercase tracking-[0.25em] font-bold transition-colors ${isHomeAtTop ? 'text-white group-hover/link:text-white' : 'text-[var(--color-text-body)] group-hover/link:text-[var(--color-primary)]'} group-hover/link:opacity-100`}>
                  How It Works
                  <span className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-300 group-hover/link:w-full ${isHomeAtTop ? 'bg-white' : 'bg-[var(--color-primary)]'}`}></span>
                </span>
              </Link>
              <Link href="/book" className={`flex items-center justify-center gap-2 min-w-[150px] md:min-w-[170px] px-3 md:px-4 border-r transition-all hover:bg-[var(--color-primary)]/5 group/book ${isAtTop ? 'border-transparent' : 'border-[var(--color-primary)]'}`} title="Book Session">
                <Calendar className={`${ICON_CLASS} ${isHomeAtTop ? 'text-white group-hover/book:text-white' : 'text-[var(--color-text-body)] group-hover/book:text-[var(--color-primary)]'} transition-colors group-hover/book:opacity-100`} />
                <span className={`hidden 2xl:block relative text-[14px] uppercase tracking-[0.15em] font-black transition-colors ${isHomeAtTop ? 'text-white group-hover/book:text-white' : 'text-[var(--color-text-body)] group-hover/book:text-[var(--color-primary)]'} group-hover/book:opacity-100`}>
                  Book Session
                  <span className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-300 group-hover/book:w-full ${isHomeAtTop ? 'bg-white' : 'bg-[var(--color-primary)]'}`}></span>
                </span>
              </Link>
              <Link
                href={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/admin`}
                className={`flex items-center justify-center gap-2 min-w-[150px] md:min-w-[170px] px-3 md:px-4 transition-all group/book ${isHomeAtTop ? 'text-white group-hover/book:text-white' : 'text-[var(--color-text-body)] group-hover/book:text-[var(--color-primary)]'} group-hover/book:opacity-100`}
                title="Admin"
              >
                <ShieldCheck className={`${ICON_CLASS} ${isHomeAtTop ? 'text-white group-hover/book:text-white' : 'text-[var(--color-text-body)] group-hover/book:text-[var(--color-primary)]'}`} />
                <span className={`hidden 2xl:block relative text-[15px] uppercase tracking-[0.25em] font-bold ${isHomeAtTop ? 'text-white group-hover/book:text-white' : 'text-[var(--color-text-body)] group-hover/book:text-[var(--color-primary)]'}`}>
                  Admin
                  <span className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-300 group-hover/book:w-full ${isHomeAtTop ? 'bg-white' : 'bg-[var(--color-primary)]'}`}></span>
                </span>
              </Link>
            </div>
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
            className="fixed inset-0 z-[120] bg-[var(--color-primary)] text-white flex overflow-hidden pt-16 lg:pt-20"
          >
            {/* Backdrop / tap-to-close for mobile */}
            <div className="absolute inset-0 z-0 lg:hidden" onClick={() => setMenuOpen(false)} aria-hidden="true" />

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
                      <Link href={linkObj.href} onClick={(e) => handleLinkClick(e, linkObj.href)} className="block">
                        <div className="overflow-hidden min-h-[1.75rem] sm:min-h-[2rem] md:min-h-[2.5rem] lg:min-h-[3rem]">
                          <motion.div className="h-[200%] flex flex-col" animate={hoveredLink === linkObj.label ? { y: '-50%' } : { y: '0%' }} transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}>
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

            {/* RIGHT SIDE: TWO-COLUMN PARALLAX GALLERY (local /imgN images, duplicated for infinite feel, very tall tiles) */}
            <div className="hidden lg:flex w-1/2 h-full p-8 relative">
              <div className="absolute inset-0 -z-10" />
              <div className="w-full h-full overflow-hidden rounded-lg flex gap-6">
                {(() => {
                  const defaults = ['/img1.jpg','/img2.jpg','/img3.jpg','/img4.jpg','/img5.jpg','/img6.jpg','/img7.jpg','/img8.jpg'];
                  const imgs = overlayImages.length ? overlayImages : defaults;
                  const left = imgs.filter((_, i) => i % 2 === 0);
                  const right = imgs.filter((_, i) => i % 2 === 1);
                  const leftDup = [...left, ...left];
                  const rightDup = [...right, ...right];

                  return (
                    <>
                      <motion.div className="flex-1 flex flex-col gap-6 pr-3" animate={hoveredIndex ? { y: -hoveredIndex * 14 } : { y: 0 }} transition={{ type: 'spring', stiffness: 80, damping: 18 }}>
                        {leftDup.map((src, i) => (
                          <div key={`l-${i}`} className="relative h-[880px] md:h-[1280px] rounded-xl overflow-hidden shadow-2xl">
                            <Image src={src} alt={`menu-left-${i}`} fill sizes="(max-width: 1024px) 40vw, 25vw" className="object-cover" />
                          </div>
                        ))}
                      </motion.div>

                      <motion.div className="flex-1 flex flex-col gap-6 pl-3" animate={hoveredIndex ? { y: hoveredIndex * 10 } : { y: 0 }} transition={{ type: 'spring', stiffness: 70, damping: 20 }}>
                        {rightDup.map((src, i) => (
                          <div key={`r-${i}`} className="relative h-[880px] md:h-[1280px] rounded-xl overflow-hidden shadow-2xl">
                            <Image src={src} alt={`menu-right-${i}`} fill sizes="(max-width: 1024px) 40vw, 25vw" className="object-cover" />
                          </div>
                        ))}
                      </motion.div>
                    </>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}