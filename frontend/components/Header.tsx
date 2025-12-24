// 'use client';

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// const Header = () => {
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     // Threshold set to 5px for an "instant" feel upon movement
//     const onScroll = () => setScrolled(window.scrollY > 5);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     onScroll();
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <header
//       className={`
//         fixed top-0 left-0 z-50 w-full
//         transition-all duration-300 ease-in-out
//         ${scrolled
//           ? "bg-[#1a161f] py-3 shadow-2xl border-b border-white/5" // Solid dark color on scroll
//           : "bg-transparent py-6" // Completely transparent at top
//         }
//       `}
//     >
//       <div className="mx-auto max-w-7xl px-6">
//         <div className="flex items-center justify-between">

//           {/* Left nav */}
//           <nav className="hidden md:flex gap-10">
//             {["Home", "Privacy", "Contact"].map((item) => (
//               <Link
//                 key={item}
//                 href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
//                 className="
//                   font-body text-white text-sm uppercase tracking-[0.2em]
//                   relative transition-all duration-300
//                   hover:text-[#F9D1D5]
//                 "
//               >
//                 {item}
//               </Link>
//             ))}
//           </nav>

//           {/* Center logo */}
//           <div className="absolute left-1/2 -translate-x-1/2">
//             <Link href="/">
//               <div className="relative h-10 w-40 transition-all duration-500">
//                 <Image
//                   src="/MindSettlerLogo.png"
//                   alt="MindSettler"
//                   fill
//                   className="object-contain brightness-0 invert" 
//                   priority
//                 />
//               </div>
//             </Link>
//           </div>

//           {/* Right CTA */}
//           <div className="hidden md:flex">
//             <Link
//               href="/book"
//               style={{ 
//                 backgroundColor: scrolled ? '#F9D1D5' : 'transparent',
//                 border: scrolled ? 'none' : '1px solid #F9D1D5',
//                 color: scrolled ? '#453859' : '#F9D1D5'
//               }}
//               className="
//                 rounded-full px-8 py-2
//                 font-body text-xs font-bold uppercase tracking-widest
//                 transition-all duration-500
//                 hover:scale-105
//               "
//             >
//               Book a Session
//             </Link>
//           </div>

//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50
        transition-all duration-300
        ${scrolled
          ? 'bg-[var(--color-bg-card)]/80 backdrop-blur-md border-b border-[var(--color-border)]'
          : 'bg-transparent'}
      `}
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex items-center justify-between h-20">

          {/* LEFT — Links (Desktop) / Logo (Mobile) */}
          <div className="flex items-center gap-10">
            {/* Desktop Links */}
            <nav className="hidden md:flex gap-10">
              {['Home', 'How It Works', 'Privacy', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={
                    item === 'Home' ? '/' :
                    item === 'How It Works' ? '/how-it-works' :
                    `/${item.toLowerCase()}`
                  }
                  className={`
                    font-body
                    text-lg
                    transition-opacity
                    hover:opacity-80
                    ${scrolled
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-bg-app)]'}
                  `}
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Mobile Logo */}
            <div className="md:hidden">
              <Link href="/">
                <Image
                  src="/MindSettlerLogo.png"
                  alt="MindSettler"
                  width={165}
                  height={52}
                  priority
                  className="object-contain"
                />
              </Link>
            </div>
          </div>

          {/* CENTER — Logo (Desktop) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <Link href="/">
              <Image
                src="/MindSettlerLogo.png"
                alt="MindSettler"
                width={175}
                height={56}
                priority
                className="object-contain"
              />
            </Link>
          </div>

          {/* RIGHT — CTA (Desktop) / Hamburger (Mobile) */}
          <div className="flex items-center">
            {/* Desktop CTA */}
            <Link
              href="/book"
              className={`
                hidden md:inline-flex
                font-body
                text-sm
                px-5 py-2
                rounded-full
                transition
                ${scrolled
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-bg-app)] text-[var(--color-text-body)]'}
              `}
            >
              Book a Session
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`
                md:hidden
                text-2xl
                ${scrolled
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-bg-app)]'}
              `}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="
            md:hidden
            bg-[var(--color-bg-card)]/90
            backdrop-blur-lg
            border-t border-[var(--color-border)]
            px-6 py-6
            space-y-6
          "
        >
          {['Home', 'How It Works', 'Privacy', 'Contact'].map((item) => (
            <Link
              key={item}
              href={
                item === 'Home' ? '/' :
                item === 'How It Works' ? '/how-it-works' :
                `/${item.toLowerCase()}`
              }
              onClick={() => setMenuOpen(false)}
              className="
                block
                font-body
                text-xl
                text-[var(--color-primary)]
              "
            >
              {item}
            </Link>
          ))}

          <Link
            href="/book"
            onClick={() => setMenuOpen(false)}
            className="
              block
              text-center
              font-body
              text-base
              px-6 py-3
              rounded-full
              bg-[var(--color-primary)]
              text-white
            "
          >
            Book a Session
          </Link>
        </div>
      )}
    </header>
  );
}
