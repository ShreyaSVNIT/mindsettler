"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        sticky top-0 z-40 w-full
        transition-all duration-500 ease-out
        ${scrolled
          ? "bg-bg-card shadow-[0_4px_20px_-6px_rgba(69,56,89,0.08)]"
          : "bg-bg-app"
        }
      `}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">

          {/* Left nav */}
          <nav className="hidden md:flex gap-10">
            {["Home", "Privacy", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="
                  font-body text-text-body text-lg
                  relative transition-opacity duration-300
                  hover:opacity-70
                  after:absolute after:-bottom-1 after:left-0
                  after:h-[1px] after:w-0 after:bg-primary
                  after:transition-all after:duration-300
                  hover:after:w-full
                "
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Center logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/">
              <div className="relative h-12 w-48">
                <Image
                  src="/MindSettlerLogo.png"
                  alt="MindSettler"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Right CTA */}
          <div className="hidden md:flex">
            <Link
              href="/book"
              className="
                rounded-full bg-primary px-8 py-3
                font-body text-lg text-white
                transition-all duration-300
                hover:bg-primary-hover
                shadow-[0_4px_12px_-2px_rgba(229,93,128,0.25)]
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
