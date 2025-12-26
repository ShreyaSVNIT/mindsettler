'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Instagram, Linkedin, ArrowRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      
      // Scroll down = pull left (increase left movement)
      // Scroll up = pull right (slow down or reverse)
      setScrollOffset(prev => prev - scrollDelta * 2); // Increased multiplier for more visible effect
      
      lastScrollY = currentScrollY;
    };

    // Damping effect - gradually reduce offset back to 0
    const dampingInterval = setInterval(() => {
      setScrollOffset(prev => prev * 0.95); // Reduce by 5% each frame
    }, 50);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(dampingInterval);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && agreed) {
      // Handle newsletter signup
      console.log('Newsletter signup:', email);
      setEmail('');
      setAgreed(false);
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-[var(--color-bg-subtle)] to-[var(--color-bg-card)] overflow-hidden">
      {/* Animated Marquee */}
      <div className="relative border-y border-[var(--color-border)] bg-[var(--color-bg-app)] py-8 overflow-hidden">
        <div 
          className="flex whitespace-nowrap animate-marquee-base"
          style={{ 
            '--scroll-offset': `${scrollOffset}px`,
          } as React.CSSProperties}
        >
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span className="text-6xl md:text-7xl font-title font-bold text-[var(--color-primary)] tracking-wider">
                MINDFUL HEALING
              </span>
              <span className="text-3xl text-[var(--color-primary)] opacity-40">✦</span>
              <span className="text-6xl md:text-7xl font-title font-bold text-[var(--color-primary)] tracking-wider">
                COMPASSIONATE CARE
              </span>
              <span className="text-3xl text-[var(--color-primary)] opacity-40">✦</span>
              <span className="text-6xl md:text-7xl font-title font-bold text-[var(--color-primary)] tracking-wider">
                TRANSFORMATIVE JOURNEY
              </span>
              <span className="text-3xl text-[var(--color-primary)] opacity-40">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Large Background Text */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none overflow-hidden">
        <h2 className="text-[clamp(200px,35vw,500px)] font-title font-bold text-[var(--color-text-body)] opacity-[0.02] whitespace-nowrap leading-none tracking-tighter">
          MindSettler
        </h2>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-40 right-20 w-64 h-64 bg-[var(--color-primary)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-40 left-20 w-96 h-96 bg-[var(--color-primary)] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Stay Connected */}
          <div className="flex flex-col gap-6">
            <h4 className="font-title text-sm text-[var(--color-text-body)] font-semibold uppercase tracking-[0.2em] mb-2">Stay Connected</h4>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 rounded-xl group"
              >
                <Instagram size={20} className="text-[var(--color-text-body)] group-hover:text-white transition-colors" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 rounded-xl group"
              >
                <Linkedin size={20} className="text-[var(--color-text-body)] group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="font-title text-sm text-[var(--color-text-body)] font-semibold uppercase tracking-[0.2em] mb-2">Quick Links</h4>
            <nav className="flex flex-col gap-4 font-body">
              <Link href="/about" className="text-[var(--color-text-body)] hover:text-[var(--color-primary)] transition-colors text-[15px]">
                About
              </Link>
              <Link href="/how-it-works" className="text-[var(--color-text-body)] hover:text-[var(--color-primary)] transition-colors text-[15px]">
                How it Works
              </Link>
              <Link href="/book" className="text-[var(--color-text-body)] hover:text-[var(--color-primary)] transition-colors text-[15px]">
                Book Session
              </Link>
              <Link href="/about#contact" className="text-[var(--color-text-body)] hover:text-[var(--color-primary)] transition-colors text-[15px]">
                Contact
              </Link>
            </nav>
          </div>

          {/* Find Us */}
          <div className="flex flex-col gap-6">
            <h4 className="font-title text-sm text-[var(--color-text-body)] font-semibold uppercase tracking-[0.2em] mb-2">Find Us</h4>
            <div className="flex flex-col gap-4 font-body text-[var(--color-text-body)]">
              <p className="leading-relaxed text-[15px] opacity-80">
                MindSettler<br />
                Online Platform<br />
                India
              </p>
              <a href="tel:+911234567890" className="hover:text-[var(--color-primary)] transition-colors text-[15px]">
                +44 (0)330 311 7799
              </a>
              <a href="mailto:hello@mindsettler.com" className="hover:text-[var(--color-primary)] transition-colors underline decoration-1 underline-offset-4 text-[15px]">
                hello@mindsettler.com
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-6">
            <h4 className="font-title text-sm text-[var(--color-text-body)] font-semibold uppercase tracking-[0.2em] mb-2">Newsletter</h4>
            <p className="font-body text-[15px] text-[var(--color-text-body)] opacity-80 leading-relaxed">
              Stay updated with wellness tips and insights
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors font-body text-[15px] text-[var(--color-text-body)] placeholder:text-[var(--color-text-body)] placeholder:opacity-40"
                />
                <button
                  type="submit"
                  disabled={!email || !agreed}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 disabled:hover:scale-100"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
              
              <label className="flex items-start gap-3 text-xs font-body text-[var(--color-text-body)] opacity-60 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[var(--color-primary)] cursor-pointer"
                />
                <span className="leading-relaxed">
                  By ticking this box, you confirm acceptance of the{' '}
                  <Link href="/privacy-policy" className="underline hover:text-[var(--color-primary)] transition-colors decoration-1 underline-offset-2">
                    Terms
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy-policy" className="underline hover:text-[var(--color-primary)] transition-colors decoration-1 underline-offset-2">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-body text-[var(--color-text-body)] opacity-50 pb-8">
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-[var(--color-primary)] hover:opacity-100 transition-all">
              Privacy
            </Link>
            <span className="opacity-30">|</span>
            <Link href="/non-refund-policy" className="hover:text-[var(--color-primary)] hover:opacity-100 transition-all">
              Terms
            </Link>
            <span className="opacity-30">|</span>
            <Link href="/confidentiality-policy" className="hover:text-[var(--color-primary)] hover:opacity-100 transition-all">
              Confidentiality
            </Link>
          </div>
          <p className="tracking-wider">© {new Date().getFullYear()} MindSettler — All rights reserved</p>
        </div>
      </div>

      <style jsx>{`
        .animate-marquee-base {
          --scroll-offset: 0px;
        }
        @keyframes marquee-base {
          0% {
            transform: translateX(calc(0% + var(--scroll-offset)));
          }
          100% {
            transform: translateX(calc(-33.333% + var(--scroll-offset)));
          }
        }
        .animate-marquee-base {
          animation: marquee-base 20s linear infinite;
        }
      `}</style>
    </footer>
  );
}