'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

import styles from './FlowingMenu.module.css';

export type FlowingMenuItem = {
  id: string;
  label: string;
  image: string;
  onSelect?: () => void;
};

type Props = {
  items: FlowingMenuItem[];
  speed?: number;
};

type Edge = 'top' | 'bottom';

function distMetric(x: number, y: number, x2: number, y2: number) {
  const xDiff = x - x2;
  const yDiff = y - y2;
  return xDiff * xDiff + yDiff * yDiff;
}

function findClosestEdge(mouseX: number, mouseY: number, width: number, height: number): Edge {
  const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
  const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
  return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
}

function MenuItem({ item, speed }: { item: FlowingMenuItem; speed: number }) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const marqueeInnerRef = useRef<HTMLDivElement | null>(null);
  const firstPartRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults = useMemo(() => ({ duration: 0.6, ease: 'expo' as const }), []);

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!firstPartRef.current) return;
      const contentWidth = firstPartRef.current.offsetWidth;
      if (!contentWidth) return;

      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [item.label, item.image]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current || !firstPartRef.current) return;

      const contentWidth = firstPartRef.current.offsetWidth;
      if (!contentWidth) return;

      animationRef.current?.kill();
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1,
      });
    };

    const timer = window.setTimeout(setupMarquee, 50);

    return () => {
      window.clearTimeout(timer);
      animationRef.current?.kill();
      animationRef.current = null;
    };
  }, [repetitions, speed, item.label, item.image]);

  const handleMouseEnter = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;

    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;

    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  const handleFocus = () => {
    if (!marqueeRef.current || !marqueeInnerRef.current) return;
    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: '101%' }, 0)
      .set(marqueeInnerRef.current, { y: '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleBlur = () => {
    if (!marqueeRef.current || !marqueeInnerRef.current) return;
    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: '101%' }, 0)
      .to(marqueeInnerRef.current, { y: '-101%' }, 0);
  };

  return (
    <div className={styles.item} ref={itemRef}>
      <button
        type="button"
        className={styles.link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={() => item.onSelect?.()}
      >
        {item.label}
      </button>

      <div className={styles.marquee} ref={marqueeRef}>
        <div className={styles.marqueeInnerWrap}>
          <div className={styles.marqueeInner} ref={marqueeInnerRef} aria-hidden="true">
            {Array.from({ length: repetitions }).map((_, idx) => (
              <div
                className={styles.marqueePart}
                key={idx}
                ref={idx === 0 ? firstPartRef : undefined}
              >
                <span className={styles.marqueeText}>{item.label}</span>
                <div className={styles.marqueeImg} style={{ backgroundImage: `url(${item.image})` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlowingMenu({ items, speed = 14 }: Props) {
  return (
    <div className={styles.wrap}>
      <nav className={styles.menu} aria-label="Resources navigation">
        {items.map((item) => (
          <MenuItem key={item.id} item={item} speed={speed} />
        ))}
      </nav>
    </div>
  );
}
