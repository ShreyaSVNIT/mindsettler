'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import MagneticButton from '@/components/Button';
import WaveDividerSolid from '@/components/WaveDividerSolid';
import MagicBento from '@/components/MagicBento';
import SectionHeader from '@/components/SectionHeader';
import HealingJourneySection from '@/components/HealingJourneySection';

// Animated Counter Component
const AnimatedCounter = ({ value, inView }: { value: string, inView: boolean }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 2000;
    const increment = numericValue / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, numericValue]);

  return <span>{count}{suffix}</span>;
};

interface CardProps {
  i: number;
  title: string;
  description: string;
  progress: any;
  range: number[];
  targetScale: number;
}

const Card = ({ i, title, description, progress, range, targetScale }: CardProps) => {
  const container = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // This helps the card know when it's in view
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  // The scale logic from your reference: shrinks the card as progress through the section increases
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0 px-4">
      <motion.div
        style={{
          scale,
          backgroundColor: 'var(--color-bg-subtle)',
          // This creates the "stacked" edges at the top
          top: `calc(5vh + ${i * 28}px)`,
        }}
        className="relative min-h-[400px] h-auto md:h-[450px] w-full max-w-[900px] rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-white/10 origin-top overflow-hidden group flex flex-col justify-center"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="relative z-10 flex flex-col md:flex-row h-full gap-6 md:gap-10 items-center">
          <div className="flex-1 flex flex-col justify-center">
            <motion.h3
              className="font-title text-3xl md:text-4xl text-[var(--color-text-body)] mb-4 md:mb-6"
              animate={isHovered ? { x: 10 } : { x: 0 }}
            >
              {title}
            </motion.h3>
            <motion.p
              className="font-body text-base md:text-lg opacity-80 leading-relaxed"
              animate={isHovered ? { x: 10 } : { x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <span className="text-3xl md:text-4xl font-title text-[var(--color-primary)] mr-1">{description[0]}</span>
              {description.substring(1)}
            </motion.p>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center opacity-10 select-none group-hover:opacity-20 transition-opacity duration-300">
            <span className="text-[8rem] lg:text-[12rem] font-title text-[var(--color-primary)] whitespace-nowrap">0{i + 1}</span>
          </div>
        </div>

        {/* Animated gradient wash */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent pointer-events-none"
          animate={isHovered ? { opacity: 1 } : { opacity: 0.5 }}
        />

        {/* Edge glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
          animate={isHovered ? {
            boxShadow: '0 0 80px rgba(249, 209, 213, 0.4), inset 0 0 80px rgba(249, 209, 213, 0.1)'
          } : {
            boxShadow: '0 0 0px rgba(249, 209, 213, 0)'
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </div>
  );
};

export default function AboutPage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  // Subtle parallax for hero
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  // Elegant subtle movements
  const imageY = useTransform(heroScrollProgress, [0, 1], [0, -150]);
  const textY = useTransform(heroScrollProgress, [0, 1], [0, 100]);
  const scale = useTransform(heroScrollProgress, [0, 0.5], [1, 1.05]);
  const imageOpacity = useTransform(heroScrollProgress, [0, 0.8, 1], [1, 0.8, 0]);

  // This scroll progress tracks the ENTIRE values section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'submitting'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const values = [
    { title: 'Complete Confidentiality', description: 'Your stories, your struggles, your victories—they stay between us in our sessions. Always private, always safe.' },
    { title: 'Empathy First', description: 'I built this platform to listen without judgment. Every session is a safe space where you can be your most authentic self.' },
    { title: 'Personalized Care', description: 'No two journeys are the same. I tailor each session to truly understand and support your unique needs.' },
    { title: 'Evidence-Based', description: 'Every technique and approach I use is backed by proven research and clinical experience in mental wellness.' },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-bg-subtle)]">
      {/* Hero Section - Elegant Parallax */}
      <section ref={heroRef} className="relative py-40 px-4 overflow-hidden min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content with subtle parallax */}
            <motion.div
              style={{ y: textY }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <span className="text-[var(--color-primary)] text-base md:text-lg tracking-[0.5em] uppercase font-playfair font-bold">
                  About MindSettler
                </span>
              </motion.div>

              <motion.h1
                className="font-title text-6xl md:text-8xl text-[var(--color-text-body)] mb-8 leading-[0.95]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Where
                <span className="block text-[var(--color-primary)] italic mt-2">
                  Healing
                </span>
                <span className="block mt-2">Meets Hope</span>
              </motion.h1>

              <motion.p
                className="font-body text-xl md:text-2xl text-[var(--color-text-body)] opacity-80 leading-relaxed mb-8 body-text"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                I created MindSettler to be more than just a platform. It's a companion in your journey toward
                understanding yourself, embracing your story, and finding peace in the present.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <MagneticButton text="Start Your Journey" />
              </motion.div>
            </motion.div>

            {/* Image with elegant reveal and parallax */}
            <motion.div
              style={{ y: imageY, scale, opacity: imageOpacity }}
              className="relative"
            >
              <div className="relative">
                {/* Subtle background accents */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent rounded-[3.5rem] blur-2xl"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Primary color shadow box */}
                <div className="absolute top-10 left-10 w-full h-[500px] bg-[var(--color-primary)] rounded-[3rem] opacity-100" />

                {/* Main image container with mask reveal and hover zoom */}
                <motion.div
                  className="relative h-[500px] rounded-[3rem] overflow-hidden group"
                  initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Image wrapper with subtle scale and hover zoom */}
                  <motion.div
                    className="relative w-full h-full bg-white"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
                  >
                    <Image
                      src="/parnika.jpeg"
                      alt="Mental wellness"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority
                    />
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-subtle)]/20 to-transparent" />
                  </motion.div>

                  {/* Elegant border */}
                  <div className="absolute inset-0 rounded-[3rem] ring-1 ring-white/10" />
                </motion.div>

                {/* Floating accent elements with rotation on hover */}
                <motion.div
                  className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-[var(--color-primary)]/20"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                  style={{
                    boxShadow: '0 0 60px rgba(249, 209, 213, 0.2)'
                  }}
                />

                <motion.div
                  className="absolute -bottom-8 -left-8 w-32 h-32 rounded-2xl border border-[var(--color-primary)]/10"
                  initial={{ scale: 0, opacity: 0, rotate: 12 }}
                  animate={{ scale: 1, opacity: 1, rotate: 12 }}
                  whileHover={{ rotate: 192 }}
                  transition={{ duration: 0.6, delay: 1.7 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <WaveDividerSolid topColor="var(--color-bg-subtle)" bottomColor="var(--color-bg-app)" />

      {/* What We Offer - MagicBento Grid */}
      <section className="relative py-12 bg-[var(--color-bg-app)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <SectionHeader
              subheader="Our Approach"
              title={<>What Makes Us <span className="italic">Different</span></>}
              bodyText="The core values and principles that guide my mission to make mental wellness accessible to everyone"
              alignment="center"
              decoration="whiskers"
              layout="single"
            />
          </div>

          {/* MagicBento Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <MagicBento
              enableStars={false}
              enableMagnetism={true}
              enableTilt={true}
              enableSpotlight={true}
              enableBorderGlow={true}
            />
          </motion.div>
        </div>
      </section>

      <WaveDividerSolid topColor="var(--color-bg-app)" bottomColor="var(--color-bg-subtle)" />

      {/* Title before cards */}
      <section className="py-24 px-6 bg-[var(--color-bg-subtle)]">
        <div className="max-w-5xl mx-auto text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-title text-5xl md:text-6xl text-[var(--color-text-body)] mb-4"
          >
            What We <span className="text-[var(--color-primary)] italic">Believe In</span>
          </motion.h2>
        </div>
      </section>

      <WaveDividerSolid topColor="var(--color-bg-subtle)" bottomColor="var(--color-bg-card)" />

      {/* IMPORTANT: The ref is on the wrapper. 
          The wrapper MUST have a total height relative to card count.
      */}
      <section ref={containerRef} className="relative bg-[var(--color-bg-card)] px-4">
        {values.map((value, index) => {
          // Calculation for the range: [start_scroll_percent, end_scroll_percent]
          const start = index * (1 / values.length);
          const targetScale = 1 - ((values.length - index) * 0.05);

          return (
            <Card
              key={index}
              i={index}
              {...value}
              progress={scrollYProgress}
              range={[start, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </section>
      <HealingJourneySection />
    </main>
  );
}
