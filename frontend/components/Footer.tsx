'use client';

import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin } from "lucide-react";
import ScrollVelocity from "./ScrollVelocity";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[var(--color-bg-subtle)] to-[var(--color-bg-card)] overflow-hidden group">

      {/* Marquee */}
      <div className="relative border-y border-[var(--color-border)] bg-[var(--color-bg-app)] py-8">
        <ScrollVelocity
          texts={['MINDFUL HEALING ✦ COMPASSIONATE CARE ✦ TRANSFORMATIVE JOURNEY ✦']}
          velocity={170}
          className="text-5xl md:text-6xl font-title font-bold text-[var(--color-primary)] tracking-wider"
        />
      </div>

      {/* Background Text */}
      <div className="absolute bottom-10 left-0 right-0 pointer-events-none select-none">
        <h2 className="text-[clamp(160px,30vw,420px)] font-title font-bold text-[var(--color-text-body)] opacity-[0.02] group-hover:opacity-[0.07] transition-opacity duration-300 whitespace-nowrap leading-none">
          MindSettler
        </h2>
      </div>

      {/* Decorative glows */}
      <div className="absolute top-32 right-20 w-56 h-56 bg-[var(--color-primary)] opacity-[0.03] blur-[100px] rounded-full" />
      <div className="absolute bottom-32 left-20 w-80 h-80 bg-[var(--color-primary)] opacity-[0.02] blur-[120px] rounded-full" />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pt-20 relative z-10">

        {/* MAIN GRID */}
        <div
          className="
            grid gap-20 mb-36 items-start
            grid-cols-1
            md:[grid-template-columns:0.9fr_1.4fr_1fr]
          "
        >

          {/* LEFT COLUMN — QUICK LINKS + POLICIES (SIDE BY SIDE) */}
          <div className="grid grid-cols-2 gap-10 max-w-md justify-self-end">

            {/* Our Policies */}
            <div className="flex flex-col gap-4 items-start">
              <h4 className="text-sm font-semibold tracking-[0.25em] uppercase">
                Our Policies
              </h4>

              <nav className="flex flex-col gap-3 text-[15px]">
                <Link href="/privacy-policy" className="hover:text-[var(--color-primary)] transition">
                  Privacy Policy
                </Link>
                <Link href="/non-refund-policy" className="hover:text-[var(--color-primary)] transition">
                  Non-Refund Policy
                </Link>
                <Link href="/confidentiality-policy" className="hover:text-[var(--color-primary)] transition">
                  Confidentiality Policy
                </Link>
              </nav>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-4 items-start">
              <h4 className="text-sm font-semibold tracking-[0.25em] uppercase">
                Quick Links
              </h4>

              <nav className="flex flex-col gap-3 text-[15px]">
  {[
    { label: 'About', href: '/about' },
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'Book Session', href: '/book' },
    { label: 'Contact', href: '/about#contact' },
  ].map((item) => (
    <Link
      key={item.label}
      href={item.href}
      className="text-[var(--color-text-body)] hover:text-[var(--color-primary)] transition"
    >
      {item.label}
    </Link>
  ))}
</nav>

            </div>

            
          </div>

          {/* CENTER — MINDSETTLER */}
          <div className="flex flex-col gap-5 items-center text-center">
            <Link href="/" className="relative w-48 h-14">
              <Image
                src="/MindSettlerLogo.png"
                alt="MindSettler"
                fill
                className="object-contain"
              />
            </Link>

            <p className="text-[20px] max-w-md text-[var(--color-text-body)] opacity-80 leading-relaxed">
              Your guided journey to mental clarity and emotional balance.
            </p>

            <div className="flex gap-4 pt-1">
              <a
                href="https://www.instagram.com/mindsettlerbypb/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--color-border)]
                  hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)]
                  transition-all duration-300 hover:-translate-y-1"
              >
                <Instagram size={16} />
              </a>

              <a
                href="https://www.linkedin.com/in/parnika-bajaj-190719195/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--color-border)]
                  hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)]
                  transition-all duration-300 hover:-translate-y-1"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* RIGHT — MAP */}
          <div className="flex flex-col gap-5 items-center md:items-end">
            <h4 className="text-sm font-semibold tracking-[0.25em] uppercase">
              Find Us
            </h4>

            <div className="w-full max-w-[300px] h-[170px] rounded-xl overflow-hidden border border-[var(--color-border)] shadow-md">

              <iframe
                src="https://maps.google.com/maps?q=Cafe+De+Meet+Siguiente+Surat&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-[var(--color-border)] pt-14 pb-12 text-center text-xs opacity-60">
          © {new Date().getFullYear()} MindSettler — All rights reserved
        </div>

      </div>
    </footer>
  );
}
