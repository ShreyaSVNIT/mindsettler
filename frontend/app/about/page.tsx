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
                  <span className="block md:inline">Where <span className="inline md:inline text-[var(--color-primary)] italic">Healing</span></span>
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
                  <MagneticButton text="Start Your Journey" />
                </a>
              </motion.div>
            </motion.div>

            {/* Image with elegant reveal and parallax */}
            <motion.div
              style={isMobile ? {} : { y: imageY, scale, opacity: imageOpacity }}
              className="relative"
            >
              <div className="relative">
                {/* Subtle background accents */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent rounded-[3.5rem] blur-2xl"
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

                {/* Primary color shadow box */}
                <div className="absolute top-6 left-6 md:top-10 md:left-10 w-full h-[40vh] sm:h-[48vh] md:h-[60vh] lg:h-[500px] max-h-[600px] bg-[var(--color-primary)]/20 rounded-[2rem] md:rounded-[3rem]" />

                {/* Main image container with mask reveal and hover zoom */}
                <motion.div
                  className="relative h-[40vh] sm:h-[48vh] md:h-[60vh] lg:h-[500px] max-h-[600px] rounded-[2rem] md:rounded-[3rem] overflow-hidden group"
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
                  <div className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] ring-1 ring-white/10" />
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

      <HealingJourneySection />
    </main>
  );
}
