'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Calendar, MapPin, Phone, Menu, X, Instagram, Linkedin } from 'lucide-react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    // Navigate after animation completes
    setTimeout(() => {
      router.push(href);
    }, 800);
  };

  useEffect(() => {
    const onScroll = () => setIsAtTop(window.scrollY === 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* --- MAIN HEADER --- */}
      <header
        className={`fixed top-0 left-0 w-full z-[130] transition-all duration-500 h-20 group ${isAtTop ? 'bg-transparent' : 'bg-[var(--color-bg-card)]/80 backdrop-blur-xl border-b border-[var(--color-border)]/50'
          }`}
      >
        <div className="h-full w-full flex items-stretch">
          <div className={`flex items-center justify-center px-8 border-r transition-all ${isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'}`}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 hover:scale-110 transition-all relative z-[140] ${isAtTop ? 'text-white' : 'text-[var(--color-text-body)]'}`}
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
            {['How It Works', 'Corporate', 'Resources'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase().replace(/ /g, '-')}`} className={`relative text-[15px] uppercase tracking-[0.25em] font-bold hover:text-[var(--color-primary)] transition-colors group/link ${isAtTop ? 'text-white' : 'text-[var(--color-text-body)]'}`}>
                {item}
                <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[var(--color-primary)] transition-all duration-300 group-hover/link:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className="flex-grow relative flex items-center justify-center px-8 isolate">
            {/* Cloud Shape Background - Smaller & Cleaner */}
            {/* Cloud Shape Background - Stronger Visibility */}
            {pathname === '/' && isAtTop && (
              <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
                <div className="w-[240px] h-[100px] bg-white shadow-[0_0_60px_rgba(255,255,255,1)] rounded-[100%] blur-xl opacity-100"></div>
              </div>
            )}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 mt-2 w-auto h-auto block">
              <Image src="/MindSettlerLogo.png" alt="Logo" width={180} height={115} priority className="max-w-none" />
            </Link>
          </div>

          <div className={`hidden lg:flex items-stretch border-l transition-all ${isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'}`}>
            <Link href="/about" className={`flex items-center justify-center px-8 border-r transition-all hover:bg-[var(--color-primary)]/5 group/link ${isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'}`}>
              <span className={`relative text-[15px] uppercase tracking-[0.25em] font-bold hover:text-[var(--color-primary)] transition-colors ${isAtTop ? 'text-white' : 'text-[var(--color-text-body)]'}`}>
                About
                <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[var(--color-primary)] transition-all duration-300 group-hover/link:w-full"></span>
              </span>
            </Link>
            <Link href="/book" className={`flex items-center gap-3 px-8 border-r transition-all hover:bg-[var(--color-primary)]/5 group/book ${isAtTop ? 'border-transparent group-hover:border-[var(--color-primary)]' : 'border-[var(--color-primary)]'}`}>
              <Calendar size={20} className={isAtTop ? 'text-white' : 'text-[var(--color-text-body)]'} />
              <span className={`text-[14px] uppercase tracking-[0.15em] font-black ${isAtTop ? 'text-white' : 'text-[var(--color-text-body)]'}`}>Book Session</span>
            </Link>
            <div className="flex items-center gap-3 px-8">
              <Phone size={20} className={isAtTop ? 'text-white' : 'text-[var(--color-primary)]'} />
              <span className={`text-[15px] font-black ${isAtTop ? 'text-white' : 'text-[var(--color-text-body)]'}`}>+44 (0)330 311 7799</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- MENU OVERLAY --- */}
      <AnimatePresence mode="wait">
        {menuOpen && (
          <motion.div
            key="menu-overlay"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1]
            }}
            className="fixed top-20 left-0 right-0 h-[calc(100vh-5rem)] z-[120] bg-[var(--color-primary)] flex overflow-hidden"
          >
            {/* LEFT SIDE: TEXT LINKS */}
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center p-12 lg:p-24 relative z-10">
              <div className="space-y-4">
                {['About', 'How It Works', 'Corporate', 'Resources'].map((link, i) => (
                  <motion.div
                    key={link}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    onMouseEnter={() => {
                      setHoveredLink(link);
                      setHoveredIndex(i);
                    }}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="overflow-hidden"
                  >
                    <Link
                      href={`/${link.toLowerCase().replace(/ /g, '-')}`}
                      onClick={(e) => handleLinkClick(e, `/${link.toLowerCase().replace(/ /g, '-')}`)}
                    >
                      <div className="overflow-hidden h-[4.5rem] lg:h-[7.5rem]">
                        <motion.div
                          animate={hoveredLink === link ? { y: '-50%' } : { y: '0%' }}
                          transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
                        >
                          <div className="text-6xl lg:text-8xl font-title font-bold text-white leading-tight uppercase tracking-tighter">{link}</div>
                          <div className="text-6xl lg:text-8xl font-title font-bold text-white leading-tight uppercase tracking-tighter italic">{link}</div>
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-20 space-y-2 text-white/90">
                <p className="text-xl font-medium">+44 (0)330 311 7799</p>
                <p className="text-xl font-medium underline cursor-pointer">hello@mindsettler.com</p>
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
                    <Image src={img.src} alt="wellness" fill className="object-cover" />
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
                    <Image src={img.src} alt="wellness" fill className="object-cover" />
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