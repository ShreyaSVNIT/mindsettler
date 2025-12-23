'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Threshold set to 5px for an "instant" feel upon movement
    const onScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 z-50 w-full
        transition-all duration-300 ease-in-out
        ${scrolled
          ? "bg-[#1a161f] py-3 shadow-2xl border-b border-white/5" // Solid dark color on scroll
          : "bg-transparent py-6" // Completely transparent at top
        }
      `}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between">

          {/* Left nav */}
          <nav className="hidden md:flex gap-10">
            {["Home", "Privacy", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                className="
                  font-body text-white text-sm uppercase tracking-[0.2em]
                  relative transition-all duration-300
                  hover:text-[#F9D1D5]
                "
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Center logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/">
              <div className="relative h-10 w-40 transition-all duration-500">
                <Image
                  src="/MindSettlerLogo.png"
                  alt="MindSettler"
                  fill
                  className="object-contain brightness-0 invert" 
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Right CTA */}
          <div className="hidden md:flex">
            <Link
              href="/book"
              style={{ 
                backgroundColor: scrolled ? '#F9D1D5' : 'transparent',
                border: scrolled ? 'none' : '1px solid #F9D1D5',
                color: scrolled ? '#453859' : '#F9D1D5'
              }}
              className="
                rounded-full px-8 py-2
                font-body text-xs font-bold uppercase tracking-widest
                transition-all duration-500
                hover:scale-105
              "
            >
              Book a Session
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;