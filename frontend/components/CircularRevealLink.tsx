"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Props {
  href: string;
  children: React.ReactElement;
  duration?: number; // seconds
}

export default function CircularRevealLink({ href, children, duration = 0.9 }: Props) {
  const router = useRouter();
  const [reveal, setReveal] = useState(false);
  const [circle, setCircle] = useState<{ x: number; y: number; r: number } | null>(null);
  const inFlight = useRef(false);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;

    // For performance and to ensure the overlay persists across navigation,
    // create an imperative DOM overlay and animate its clip-path from the top-center.
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    const centerX = Math.round(vw / 2);
    const centerY = 0; // top of the page
    const radius = Math.ceil(Math.hypot(vw / 2, vh));

    // overlay element
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';
    overlay.style.background = 'rgba(255,255,255,0.98)';
    overlay.style.willChange = 'clip-path, opacity, transform';
    overlay.style.clipPath = `circle(0px at ${centerX}px ${centerY}px)`;

    document.body.appendChild(overlay);

    // Use Web Animations API for a lightweight, GPU-friendly animation
    const anim = (overlay as any).animate(
      [
        { clipPath: `circle(0px at ${centerX}px ${centerY}px)`, opacity: 1 },
        { clipPath: `circle(${radius}px at ${centerX}px ${centerY}px)`, opacity: 1 },
      ],
      {
        duration: duration * 1000,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      }
    );

    // start navigation immediately so the target page loads behind the overlay
    try {
      router.push(href);
    } catch (err) {
      // fallback: set location
      window.location.href = href;
    }

    // remove overlay after animation finishes
    anim.finished?.then(() => {
      overlay.remove();
      inFlight.current = false;
    }).catch(() => {
      overlay.remove();
      inFlight.current = false;
    });
  };

  // clone child to attach handler
  const child = React.cloneElement(children, {
    onClick: (e: any) => {
      // preserve existing handler if any
      if (children.props.onClick) children.props.onClick(e);
      handleClick(e);
    },
  });

  return (
    <>
      {child}

      <AnimatePresence>
        {reveal && circle && (
          <motion.div
            initial={{ clipPath: `circle(0px at ${circle.x}px ${circle.y}px)`, opacity: 1 }}
            animate={{ clipPath: `circle(${circle.r}px at ${circle.x}px ${circle.y}px)`, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(255,255,255,0.98)",
              zIndex: 9999,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
