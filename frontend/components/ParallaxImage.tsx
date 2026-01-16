'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number; // How fast the parallax moves (0.1 to 1, default 0.5)
}

export default function ParallaxImage({ 
  src, 
  alt, 
  className = '',
  speed = 0.5 
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Transform the Y position based on scroll
  const y = useTransform(scrollYProgress, [0, 1], [-50 * speed, 50 * speed]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y }}
        className="w-full h-full"
      >
        <Image 
          src={src} 
          alt={alt} 
          fill 
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
