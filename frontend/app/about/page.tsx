'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import MagneticButton from '@/components/Button';
import WaveDividerSolid from '@/components/WaveDividerSolid';
import dynamic from 'next/dynamic';

const MagicBento = dynamic(() => import('@/components/MagicBento'), { ssr: false, loading: () => null });
import SectionHeader from '@/components/SectionHeader';
import HealingJourneySection from '@/components/HealingJourneySection';
import FounderIntroduction from '@/components/FounderIntroduction';
import TitleHeader from '@/components/TitleHeader';

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

export default function AboutPage() {
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

  // Disable heavy parallax transforms on small screens to avoid jank
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767.98px)');
    setIsMobile(mq.matches);
    const onChange = () => setIsMobile(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

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

  return (
    <main className="min-h-screen bg-[var(--color-bg-subtle)]">
      {/* Hero Section - Elegant Parallax */}
      <section ref={heroRef} className="relative py-20 md:py-40 px-4 overflow-hidden md:min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text Content with subtle parallax */}
            <motion.div
              style={{ y: textY }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <TitleHeader
                subheader="About MindSettler"
                title={<>
                  <span className="block md:inline">Where <span className="inline md:inline text-[var(--color-primary)] italic">Healing </span></span>
                  <span className="block md:inline md:ml-2">Meets Hope</span>
                </>}
                description="I created MindSettler to be more than just a platform. It's a companion in your journey toward understanding yourself, embracing your story, and finding peace in the present."
                alignment="left"
              />

              <div className="mb-4 md:mb-8" />

              <motion.div
                className="flex flex-wrap gap-4 justify-center md:justify-start mb-2 md:mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <a href="/how-it-works">
                  <MagneticButton text="Start Your Journey" className="transform md:scale-105" />
                </a>
              </motion.div>
            </motion.div>

            {/* Image with elegant reveal and parallax */}
            <motion.div
              style={isMobile ? {} : { y: imageY, scale, opacity: imageOpacity }}
              className="relative"
            >
              <div className="relative">
                {/* Subtle background accents - hidden on small screens */}
                <motion.div
                  className="hidden md:block absolute -inset-4 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent rounded-[3.5rem] blur-2xl"
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.2, 0.35, 0.2]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Primary color shadow box - hide on mobile to avoid 3D pink shadow */}
                <div className="hidden md:block absolute top-6 left-6 md:top-10 md:left-10 w-full h-[48vh] md:h-[60vh] lg:h-[500px] max-h-[600px] bg-[var(--color-primary)]/20 rounded-[2rem] md:rounded-[3rem]" />

                {/* Main image container with mask reveal and hover zoom */}
                <motion.div
                  className="relative h-[32vh] sm:h-[44vh] md:h-[56vh] lg:h-[500px] max-h-[600px] rounded-[2rem] md:rounded-[3rem] overflow-hidden group max-w-[92%] sm:max-w-[85%] md:max-w-none mx-auto md:mx-0"
                  initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Image wrapper with subtle scale and hover zoom */}
                  <motion.div
                    className="relative w-full h-full bg-white border-2 border-[var(--color-primary)]/30"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
                  >
                    <Image
                      src="/parnika.jpeg"
                      alt="Parnika Bajaj - founder of MindSettler"
                      fill
                      loading="eager"
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 600px"
                      style={{ objectPosition: '50% 35%' }}
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      priority
                    />
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-subtle)]/20 to-transparent" />
                  </motion.div>

                  {/* Elegant border replacement (kept for larger screens) */}
                  <div className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] ring-1 ring-white/10 hidden md:block" />
                </motion.div>

                {/* Floating accent elements with rotation on hover */}
                <motion.div
                  className="hidden lg:block absolute -top-4 -right-4 md:-top-6 md:-right-6 w-16 h-16 md:w-24 md:h-24 rounded-full border border-[var(--color-primary)]/20"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                  style={{
                    boxShadow: '0 0 60px rgba(249, 209, 213, 0.2)'
                  }}
                />

                <motion.div
                  className="hidden lg:block absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 w-20 h-20 md:w-32 md:h-32 rounded-2xl border border-[var(--color-primary)]/10"
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

      {/* simple solid divider instead of decorative wave */}
      <div className="w-full h-px bg-[var(--color-border)]" />

      {/* What We Offer - MagicBento Grid */}
      <section className="relative py-8 bg-[var(--color-bg-app)] overflow-hidden">
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

      {/* simple solid divider instead of decorative wave */}
      <div className="w-full h-px bg-[var(--color-border)]" />

      {/* Founder Introduction Section */}
      <FounderIntroduction
        videoUrl="/aboutus.mp4"
        introduction="I'm Parnika Bajaj, and I founded MindSettler in April 2023 with a vision to make mental wellness accessible, approachable, and truly transformative. After years of studying psychology across two continents and working with diverse individuals, I realized that the biggest barrier to mental health wasn't awareness—it was accessibility and the fear of judgment. MindSettler is my answer to that gap: a safe, confidential space where healing is personalized, evidence-based, and deeply empathetic."
        education={[
          "Master of Arts in Counseling Psychology, Golden Gate University (2022)",
          "Bachelor of Science (Hons) in Psychology, University of Edinburgh (2018-2022)"
        ]}
        experience={[
          "Founder of MindSettler (April 2023 - Present)",
          "2+ years of building a platform that prioritizes mental wellness",
          "Specialized in anxiety, depression, and relationship counseling",
          "Trained in evidence-based therapeutic approaches"
        ]}
        certifications={[
          "Trained in Counseling Psychology",
          "Evidence-Based Therapeutic Practices",
          "Individual and Corporate Wellness Programs"
        ]}
      />

      {/* simple solid divider */}
      <div className="w-full h-px bg-[var(--color-border)]" />

      {/* Meet the Developers Section */}
      <section className="relative py-16 md:py-24 px-4 bg-[var(--color-bg-subtle)]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <SectionHeader
              subheader="Our Team"
              title={<>Meet the <span className="italic">Developers</span></>}
              bodyText="The talented team behind MindSettler's technical innovation"
              alignment="center"
              decoration="whiskers"
              layout="single"
            />
          </div>

          {/* Developers Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              { 
                name: 'Kavya Bhatiya', 
                role: 'Developer',
                image: 'https://res.cloudinary.com/dqz1ffhyo/image/upload/v1772358996/WhatsApp_Image_2026-02-18_at_09.07.10_1_yj5egq.jpg',
                linkedin: 'https://www.linkedin.com/in/kavya-bhatiya-a4864a263',
                github: 'https://github.com/kvb1201'
              },
              { 
                name: 'Nishchay Mittal', 
                role: 'Developer',
                image: 'https://res.cloudinary.com/dqz1ffhyo/image/upload/v1772359641/WhatsApp_Image_2026-03-01_at_15.35.53_f0bkr5.jpg',
                linkedin: 'https://www.linkedin.com/in/nishchay-mittal-437822324',
                github: 'https://github.com/NishchayMittal'
              },
              { 
                name: 'Shreya Ashar', 
                role: 'Developer',
                image: 'https://res.cloudinary.com/dqz1ffhyo/image/upload/v1761063022/WhatsApp_Image_2025-10-21_at_21.39.26_wsoq8n.jpg',
                linkedin: 'https://www.linkedin.com/in/shreya-ashar-18a027191/',
                github: 'https://github.com/ShreyaSVNIT'
              },
              { 
                name: 'Nidhi Arora', 
                role: 'Developer',
                linkedin: 'https://www.linkedin.com/in/nidhi-arora-/',
                github: 'https://github.com/NidhiArora21'
              }
            ].map((dev, index) => (
              <motion.div
                key={dev.name}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Card Container */}
                <div className="relative bg-pink-50/30 rounded-[2rem] overflow-hidden border border-[var(--color-border)] transition-all duration-500 hover:shadow-xl hover:shadow-[var(--color-primary)]/10 hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="relative w-full aspect-square overflow-hidden">
                    {/* Placeholder gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 via-[var(--color-bg-lavender)] to-[var(--color-primary)]/10" />
                    
                    {/* Decorative elements */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'radial-gradient(circle at center, var(--color-primary) 0%, transparent 70%)',
                        opacity: 0.1
                      }}
                    />
                    
                    {/* Actual Image or Placeholder */}
                    {dev.image ? (
                      <Image
                        src={dev.image}
                        alt={dev.name}
                        fill
                        loading="lazy"
                        quality={75}
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/50 backdrop-blur-sm border-2 border-[var(--color-primary)]/30 flex items-center justify-center">
                          <span className="text-4xl md:text-5xl font-serif text-[var(--color-primary)]">
                            {dev.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent" />
                  </div>

                  {/* Info Container */}
                  <div className="p-6 text-center">
                    {/* Name */}
                    <h3 className="text-xl md:text-2xl font-serif text-[var(--color-text-body)] mb-2 font-medium">
                      {dev.name}
                    </h3>
                    
                    {/* Role */}
                    <p className="text-sm md:text-base text-[var(--color-text-body)]/70 mb-4">
                      {dev.role}
                    </p>

                    {/* Social Links */}
                    <div className="flex justify-center gap-4">
                      {/* GitHub Link */}
                      <a
                        href={dev.github || '#github'}
                        target={dev.github ? '_blank' : undefined}
                        rel={dev.github ? 'noopener noreferrer' : undefined}
                        className="group/link w-10 h-10 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] flex items-center justify-center transition-all duration-300 hover:bg-[var(--color-primary)]/5 hover:scale-110"
                        aria-label={`${dev.name}'s GitHub`}
                      >
                        <svg
                          className="w-5 h-5 text-[var(--color-text-body)]/60 group-hover/link:text-[var(--color-primary)] transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>

                      {/* LinkedIn Link */}
                      <a
                        href={dev.linkedin || '#linkedin'}
                        target={dev.linkedin ? '_blank' : undefined}
                        rel={dev.linkedin ? 'noopener noreferrer' : undefined}
                        className="group/link w-10 h-10 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] flex items-center justify-center transition-all duration-300 hover:bg-[var(--color-primary)]/5 hover:scale-110"
                        aria-label={`${dev.name}'s LinkedIn`}
                      >
                        <svg
                          className="w-5 h-5 text-[var(--color-text-body)]/60 group-hover/link:text-[var(--color-primary)] transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[var(--color-primary)]/30 group-hover:scale-150 transition-transform duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* simple solid divider */}
      <div className="w-full h-px bg-[var(--color-border)]" />

      <HealingJourneySection />
    </main>
  );
}
