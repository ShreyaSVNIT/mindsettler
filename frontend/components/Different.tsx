"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./different.module.css";

export default function Different() {
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
              <div className={styles.headerLabel}>
                <span className={styles.glowingDot}></span>
                <span className={styles.label}>OUR MISSION</span>
              </div>

              {/* Mixed Style Heading */}
              <h2 className={styles.heading}>
                A safe space where <span>growth meets compassion </span> and <span> clarity.</span>
              </h2>

              {/* Description for MindSettler */}
              <p className={styles.descriptionText}>
                MindSettler is your digital sanctuary for mental well-being. 
                Connect with licensed psychotherapists through structured, 
                confidential sessions designed to help you navigate life's 
                complexities from the comfort of your own space.
              </p>

              <button className={styles.btn}>
                <span>✻</span> BOOK A SESSION <span>✻</span>
              </button>
            </div>
             <div className={styles.archSide}>
                <div className={styles.arch}>
                   <div className={styles.timeline}>
                    <div className={styles.verticalLine} />
                    <TimelineItem title="Discovery" desc="Identify your needs with our matching tool" />
                    <TimelineItem title="Selection" desc="Choose from accredited psychotherapists" />
                    <TimelineItem title="Connection" desc="Secure, 1-on-1 video wellness sessions" />
                    <TimelineItem title="Growth" desc="Continuous support on your path to clarity" />
                  </div>
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