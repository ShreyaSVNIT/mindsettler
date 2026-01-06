'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Instagram, Linkedin, ArrowRight } from "lucide-react";
import ScrollVelocity from "./ScrollVelocity";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

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
      {/* Animated Marquee with ScrollVelocity */}
      <div className="relative border-y border-[var(--color-border)] bg-[var(--color-bg-app)] py-8 overflow-hidden">
        <ScrollVelocity
          texts={['MINDFUL HEALING ✦ COMPASSIONATE CARE ✦ TRANSFORMATIVE JOURNEY ✦']}
          velocity={170}
          className="text-6xl md:text-7xl font-title font-bold text-[var(--color-primary)] tracking-wider"
        />
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

          {/* Brand & Social - Column 1 */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="block relative w-48 h-16">
              <Image src="/MindSettlerLogo.png" alt="MindSettler" fill className="object-contain object-left" />
            </Link>
            <p className="font-body text-[15px] text-[var(--color-text-body)] opacity-80 leading-relaxed max-w-xs">
              Your guided journey to mental clarity and emotional balance.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.instagram.com/mindsettlerbypb/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 rounded-full group shadow-sm hover:shadow-md hover:-translate-y-1"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={18} className="text-[var(--color-text-body)] group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="font-title text-sm text-[var(--color-text-body)] font-semibold uppercase tracking-[0.2em] mb-2">Quick Links</h4>
            <nav className="flex flex-col gap-4 font-body">
              {['About', 'How it Works', 'Book Session', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Contact' ? '/about#contact' : `/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-[var(--color-text-body)] hover:text-[var(--color-primary)] transition-all text-[15px] flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-border)] group-hover:bg-[var(--color-primary)] transition-colors"></span>
                  <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Find Us */}
          <div className="flex flex-col gap-6">
            <h4 className="font-title text-sm text-[var(--color-text-body)] font-semibold uppercase tracking-[0.2em] mb-2">Find Us</h4>
            <div className="flex flex-col gap-4 font-body text-[var(--color-text-body)] w-full h-full pb-2">
              <div className="w-full h-64 rounded-xl overflow-hidden border border-[var(--color-border)] shadow-md hover:shadow-lg transition-shadow duration-300">
                <iframe
                  src="https://maps.google.com/maps?q=Cafe+De+Meet+Siguiente+Surat&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
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
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          will-change: transform;
        }
      `}</style>
    </footer>
  );
}