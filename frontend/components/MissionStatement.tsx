"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./missionStatement.module.css";
import MagneticButton from "./Button";

export default function MissionStatement() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Morphing shape - happens during the scroll through this section
  const clipPath = useTransform(
    scrollYProgress,
    [0.15, 0.65],
    [
      "inset(15% 20% 15% 20% round 150px 30px 150px 30px)",
      "inset(0% 0% 0% 0% round 0px)",
    ]
  );

  const scale = useTransform(scrollYProgress, [0.15, 0.65], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);

  return (
    <div ref={containerRef} className={styles.outerContainer}>
      <div className={styles.stickyBox}>
        <motion.div style={{ clipPath, scale }} className={styles.contentWrapper}>
          <Image
            src="/spa.jpg?v=2"
            alt="Wellness"
            fill
            className={styles.mainImage}
            priority
            unoptimized
          />
          
          <motion.div style={{ opacity }} className={styles.overlay}>
             <div className={styles.textSide}>
              {/* The Header with glowing dot */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span className="text-white text-base md:text-lg tracking-[0.5em] uppercase font-playfair font-bold">
                  Our Mission
                </span>
              </div>

              {/* Mixed Style Heading */}
              <h2 className="font-title text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 text-white">
                A safe space where <span className="italic">growth</span> meets <span className="italic">compassion</span> and <span className="italic">clarity.</span>
              </h2>

              {/* Description for MindSettler */}
              <p className="text-xl md:text-2xl text-white mb-8 body-text">
                MindSettler is your digital sanctuary for mental well-being. 
                Connect with licensed psychotherapists through structured, 
                confidential sessions designed to help you navigate life's 
                complexities from the comfort of your own space.
              </p>

              <div className={styles.buttonWrapper}>
                <Link href="/book">
                  <MagneticButton text="BOOK A SESSION" />
                </Link>
              </div>
            </div>
             <div className={styles.timelineSide}>
                <div className={styles.timeline}>
                  <div className={styles.verticalLine} />
                  <TimelineItem title="Discovery" desc="Identify your needs with our matching tool" />
                  <TimelineItem title="Selection" desc="Choose from accredited psychotherapists" />
                  <TimelineItem title="Connection" desc="Secure, 1-on-1 video wellness sessions" />
                  <TimelineItem title="Growth" desc="Continuous support on your path to clarity" />
                </div>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function TimelineItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className={styles.step}>
      <div className={styles.dot} />
      <div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
}