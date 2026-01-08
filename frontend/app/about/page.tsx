'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import MagneticButton from '@/components/Button';
import WaveDividerSolid from '@/components/WaveDividerSolid';
import MagicBento from '@/components/MagicBento';

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
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
      <motion.div
        style={{
          scale,
          backgroundColor: 'var(--color-bg-subtle)',
          // This creates the "stacked" edges at the top
          top: `calc(5vh + ${i * 28}px)`, 
        }}
        className="relative h-[450px] w-full max-w-[900px] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/10 origin-top overflow-hidden group"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="relative z-10 flex flex-col md:flex-row h-full gap-10">
          <div className="flex-1 flex flex-col justify-center">
            <motion.h3 
              className="font-title text-4xl text-[var(--color-text-body)] mb-6"
              animate={isHovered ? { x: 10 } : { x: 0 }}
            >
              {title}
            </motion.h3>
            <motion.p 
              className="font-body text-lg opacity-80 leading-relaxed"
              animate={isHovered ? { x: 10 } : { x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <span className="text-4xl font-title text-[var(--color-primary)] mr-1">{description[0]}</span>
              {description.substring(1)}
            </motion.p>
          </div>
          
          <div className="hidden md:flex flex-1 items-center justify-center opacity-10 select-none group-hover:opacity-20 transition-opacity duration-300">
             <span className="text-[12rem] font-title text-[var(--color-primary)]">0{i+1}</span>
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
      <section ref={heroRef} className="relative py-40 px-6 overflow-hidden min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content with subtle parallax */}
            <motion.div
              style={{ y: textY }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block mb-6"
              >
                <div className="bg-[var(--color-bg-app)] px-6 py-2 rounded-full border border-[var(--color-primary)]/10">
                  <p className="uppercase tracking-[0.3em] text-xs font-body text-[var(--color-primary)]">
                    ✦ About MindSettler ✦
                  </p>
                </div>
              </motion.div>
              
              <motion.h1 
                className="font-title text-6xl md:text-8xl text-[var(--color-text-body)] mb-8 leading-[0.95]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Where
                <span className="block text-[var(--color-primary)] italic mt-2">
                  Healing
                </span>
                <span className="block mt-2">Meets Hope</span>
              </motion.h1>
              
              <motion.p 
                className="font-body text-xl text-[var(--color-text-body)] opacity-80 leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                I created MindSettler to be more than just a platform. It's a companion in your journey toward 
                understanding yourself, embracing your story, and finding peace in the present.
              </motion.p>

              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                
                {/* Main image container with mask reveal */}
                <motion.div 
                  className="relative h-[500px] rounded-[3rem] overflow-hidden"
                  initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
                >
                  {/* Image wrapper with subtle scale */}
                  <motion.div
                    className="relative w-full h-full"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
                  >
                    <Image
                      src="/parnika.jpeg"
                      alt="Mental wellness"
                      fill
                      className="object-cover"
                      priority
                    />
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-subtle)]/20 to-transparent" />
                  </motion.div>
                  
                  {/* Elegant border */}
                  <div className="absolute inset-0 rounded-[3rem] ring-1 ring-white/10" />
                </motion.div>

                {/* Floating accent elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-[var(--color-primary)]/20"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                  style={{ 
                    boxShadow: '0 0 60px rgba(249, 209, 213, 0.2)'
                  }}
                />
                
                <motion.div
                  className="absolute -bottom-8 -left-8 w-32 h-32 rounded-2xl border border-[var(--color-primary)]/10 rotate-12"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.7 }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Subtle scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-5 h-8 border border-[var(--color-text-body)]/20 rounded-full flex justify-center pt-1.5">
              <motion.div
                animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-1.5 bg-[var(--color-primary)] rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      <WaveDividerSolid topColor="var(--color-bg-subtle)" bottomColor="var(--color-bg-app)" />

      {/* What We Offer - MagicBento Grid */}
      <section className="relative py-24 bg-[var(--color-bg-app)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--color-primary)]" />
                <span className="text-[var(--color-primary)] text-[10px] tracking-[0.4em] uppercase font-body font-light">
                  Our Approach
                </span>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--color-primary)]" />
              </div>
              <h2 className="font-title text-5xl md:text-6xl lg:text-7xl text-[var(--color-text-body)] mb-4">
                What Makes Us <span className="text-[var(--color-primary)] italic">Different</span>
              </h2>
              <p className="font-body text-lg text-[var(--color-text-body)]/60 max-w-2xl mx-auto">
                The core values and principles that guide my mission to make mental wellness accessible to everyone
              </p>
            </motion.div>
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

      <WaveDividerSolid topColor="var(--color-bg-card)" bottomColor="var(--color-bg-card)" />

      {/* Contact Section - Enhanced */}
      <section className="py-24 px-6 bg-[var(--color-bg-card)] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)] opacity-5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--color-primary)] opacity-5 blur-[120px] rounded-full" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="uppercase tracking-widest text-xs mb-4 opacity-60 font-body"
            >
              Get in Touch
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-title text-4xl md:text-5xl text-[var(--color-text-body)] mb-6"
            >
              Contact Us
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="font-body text-lg text-[var(--color-text-body)] opacity-80 max-w-2xl mx-auto leading-relaxed"
            >
              Have questions about MindSettler? I'm here to help you take the first step 
              toward your wellness journey. Feel free to reach out!
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-[var(--color-bg-subtle)] p-8 rounded-2xl text-center relative overflow-hidden group border border-white/5"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.div 
                className="w-16 h-16 rounded-full bg-[var(--color-bg-app)] flex items-center justify-center mx-auto mb-6 relative z-10"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-[var(--color-primary)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </motion.div>
              <h3 className="font-title text-2xl text-[var(--color-text-body)] mb-3 relative z-10">
                Email
              </h3>
              <a
                href="mailto:hello@mindsettler.com"
                className="font-body text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors relative z-10"
              >
                hello@mindsettler.com
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-[var(--color-bg-subtle)] p-8 rounded-2xl text-center relative overflow-hidden group border border-white/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.div 
                className="w-16 h-16 rounded-full bg-[var(--color-bg-app)] flex items-center justify-center mx-auto mb-6 relative z-10"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-[var(--color-primary)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
              </motion.div>
              <h3 className="font-title text-2xl text-[var(--color-text-body)] mb-3 relative z-10">
                Phone
              </h3>
              <a
                href="tel:+911234567890"
                className="font-body text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors relative z-10"
              >
                +91 123 456 7890
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-[var(--color-bg-subtle)] p-8 rounded-2xl text-center relative overflow-hidden group border border-white/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.div 
                className="w-16 h-16 rounded-full bg-[var(--color-bg-app)] flex items-center justify-center mx-auto mb-6 relative z-10"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-[var(--color-primary)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </motion.div>
              <h3 className="font-title text-2xl text-[var(--color-text-body)] mb-3 relative z-10">
                Hours
              </h3>
              <p className="font-body text-[var(--color-text-body)] opacity-80 relative z-10">
                Monday - Saturday<br />
                9:00 AM - 8:00 PM IST
              </p>
            </motion.div>
          </div>

          {/* Contact Form - Enhanced with micro-interactions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <div className="bg-[var(--color-bg-subtle)] p-8 md:p-12 rounded-3xl shadow-lg border border-white/5 relative overflow-hidden">
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    'radial-gradient(circle at 0% 0%, rgba(249, 209, 213, 0.15) 0%, transparent 50%)',
                    'radial-gradient(circle at 100% 100%, rgba(249, 209, 213, 0.15) 0%, transparent 50%)',
                    'radial-gradient(circle at 0% 0%, rgba(249, 209, 213, 0.15) 0%, transparent 50%)',
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              
              <h3 className="font-title text-3xl text-[var(--color-text-body)] mb-6 text-center relative z-10">
                Send Us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Input - Floating Label */}
                  <div className="relative group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="peer w-full px-4 py-4 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-all duration-300 font-body bg-white placeholder-transparent"
                      placeholder="Your name"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-4 -top-2.5 bg-white px-2 text-sm text-[var(--color-text-body)] opacity-70 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:opacity-50 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[var(--color-primary)] peer-focus:opacity-100"
                    >
                      Full Name *
                    </label>
                    {/* Focus glow */}
                    <div className="absolute inset-0 rounded-xl bg-[var(--color-primary)] opacity-0 group-focus-within:opacity-10 blur-xl transition-opacity duration-500 pointer-events-none -z-10" />
                  </div>

                  {/* Email Input - Floating Label */}
                  <div className="relative group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="peer w-full px-4 py-4 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-all duration-300 font-body bg-white placeholder-transparent"
                      placeholder="your@email.com"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 -top-2.5 bg-white px-2 text-sm text-[var(--color-text-body)] opacity-70 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:opacity-50 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[var(--color-primary)] peer-focus:opacity-100"
                    >
                      Email Address *
                    </label>
                    <div className="absolute inset-0 rounded-xl bg-[var(--color-primary)] opacity-0 group-focus-within:opacity-10 blur-xl transition-opacity duration-500 pointer-events-none -z-10" />
                  </div>
                </div>

                {/* Phone Input - Floating Label */}
                <div className="relative group">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="peer w-full px-4 py-4 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-all duration-300 font-body bg-white placeholder-transparent"
                    placeholder="+91 123 456 7890"
                  />
                  <label
                    htmlFor="phone"
                    className="absolute left-4 -top-2.5 bg-white px-2 text-sm text-[var(--color-text-body)] opacity-70 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:opacity-50 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[var(--color-primary)] peer-focus:opacity-100"
                  >
                    Phone Number
                  </label>
                  <div className="absolute inset-0 rounded-xl bg-[var(--color-primary)] opacity-0 group-focus-within:opacity-10 blur-xl transition-opacity duration-500 pointer-events-none -z-10" />
                </div>

                {/* Message Textarea - Floating Label */}
                <div className="relative group">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="peer w-full px-4 py-4 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-all duration-300 font-body resize-none bg-white placeholder-transparent"
                    placeholder="Tell us how we can help you..."
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-4 -top-2.5 bg-white px-2 text-sm text-[var(--color-text-body)] opacity-70 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:opacity-50 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[var(--color-primary)] peer-focus:opacity-100"
                  >
                    Message *
                  </label>
                  <div className="absolute inset-0 rounded-xl bg-[var(--color-primary)] opacity-0 group-focus-within:opacity-10 blur-xl transition-opacity duration-500 pointer-events-none -z-10" />
                </div>

                {/* Submit Button with Enhanced Animation */}
                <div className="flex justify-center pt-4">
                  <motion.button
                    type="submit"
                    disabled={submitStatus === 'submitting'}
                    className="relative px-12 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-white font-body rounded-xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={submitStatus !== 'submitting' ? { scale: 1.05 } : {}}
                    whileTap={submitStatus !== 'submitting' ? { scale: 0.95 } : {}}
                  >
                    {/* Animated gradient overlay */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        backgroundSize: '200% 100%'
                      }}
                    />
                    
                    {/* Button text */}
                    <span className="relative z-10 font-semibold text-lg">
                      {submitStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                    </span>
                    
                    {/* Ripple effect */}
                    {submitStatus !== 'submitting' && (
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100"
                        initial={false}
                      >
                        <motion.div
                          className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
                          animate={{
                            scale: [0, 20],
                            opacity: [0.5, 0]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeOut"
                          }}
                        />
                      </motion.div>
                    )}
                  </motion.button>
                </div>

                {submitStatus === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center"
                  >
                    <p className="font-body text-green-800">
                      ✓ Thank you! Your message has been sent successfully.
                    </p>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center"
                  >
                    <p className="font-body text-red-800">
                      ✗ Something went wrong. Please try again.
                    </p>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="font-body text-[var(--color-text-body)] opacity-70 mb-6">
              Follow us on social media for wellness tips and updates
            </p>
            <div className="flex justify-center gap-6">
              {[
                { name: 'Instagram', href: '#' },
                { name: 'Facebook', href: '#' },
                { name: 'LinkedIn', href: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-12 h-12 rounded-full border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <span className="sr-only">{social.name}</span>
                  <span className="font-body text-sm text-[var(--color-text-body)] hover:text-[var(--color-primary)]">
                    {social.name[0]}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <WaveDividerSolid topColor="var(--color-bg-card)" bottomColor="var(--color-bg-app)" />

      {/* CTA Section */}
      <section className="py-32 px-6 bg-[var(--color-bg-app)]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-title text-4xl md:text-5xl text-[var(--color-text-body)] mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="font-body text-lg text-[var(--color-text-body)] opacity-80 mb-10 leading-relaxed">
              I believe everyone deserves support on their mental wellness journey. 
              Take the first step toward clarity and well-being—book your confidential session today.
            </p>
            <MagneticButton text="Book a Session" />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
