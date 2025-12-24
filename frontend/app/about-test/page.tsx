'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticButton from '@/components/Button';
import WaveDividerSolid from '@/components/WaveDividerSolid';

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
        className="relative h-[450px] w-full max-w-[900px] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/10 origin-top overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row h-full gap-10">
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="font-title text-4xl text-[var(--color-text-body)] mb-6">{title}</h3>
            <p className="font-body text-lg opacity-80 leading-relaxed">
              <span className="text-4xl font-title text-[var(--color-primary)] mr-1">{description[0]}</span>
              {description.substring(1)}
            </p>
          </div>
          
          <div className="hidden md:flex flex-1 items-center justify-center opacity-10 select-none">
             <span className="text-[12rem] font-title text-[var(--color-primary)]">0{i+1}</span>
          </div>
        </div>
        
        {/* Subtle accent wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
};

export default function AboutTestPage() {
  const containerRef = useRef(null);
  
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
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

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
    { title: 'Complete Confidentiality', description: 'Your stories, your struggles, your victories—they all stay between you and your therapist. Always.' },
    { title: 'Empathy First', description: 'We listen without judgment. Every session is a safe space where you can be your most authentic self.' },
    { title: 'Personalized Care', description: 'No two journeys are the same. We match you with therapists who truly understand your unique needs.' },
    { title: 'Evidence-Based', description: 'Our therapists use proven techniques backed by research and decades of clinical experience.' },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-bg-subtle)]">
      {/* Hero Section - Artistic Layout */}
      <section className="relative py-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
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
                <div className="bg-[var(--color-bg-app)] px-6 py-2 rounded-full">
                  <p className="uppercase tracking-[0.3em] text-xs font-body text-[var(--color-primary)]">
                    ✦ About MindSettler ✦
                  </p>
                </div>
              </motion.div>
              
              <h1 className="font-title text-6xl md:text-8xl text-[var(--color-text-body)] mb-8 leading-[0.95]">
                Where
                <span className="block text-[var(--color-primary)] italic mt-2">
                  Healing
                </span>
                <span className="block mt-2">Meets Hope</span>
              </h1>
              
              <p className="font-body text-xl text-[var(--color-text-body)] opacity-80 leading-relaxed mb-8">
                We're not just a platform. We're your companion in the journey toward 
                understanding yourself, embracing your story, and finding peace in the present.
              </p>

              <div className="flex flex-wrap gap-4">
                <MagneticButton text="Start Your Journey" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative">
                {/* Decorative boxes */}
                <div className="absolute -top-8 -left-8 w-full h-full bg-[var(--color-bg-app)] rounded-[3rem] -z-10" />
                <div className="absolute -bottom-8 -right-8 w-full h-full border-4 border-[var(--color-primary)] opacity-20 rounded-[3rem] -z-10" />
                <div className="absolute -top-4 -right-4 w-32 h-32 border-4 border-[var(--color-primary)] rounded-2xl -z-5 opacity-30" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[var(--color-primary)] rounded-full -z-5 opacity-10" />
                <div className="absolute top-1/2 -right-8 w-16 h-16 border-2 border-[var(--color-text-body)] rounded-lg -z-5 opacity-20 rotate-12" />
                
                {/* Main image container */}
                <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10">
                  <Image
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
                    alt="Mental wellness"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <WaveDividerSolid topColor="var(--color-bg-subtle)" bottomColor="var(--color-bg-card)" />

      {/* Stats Section - Creative Numbers */}
      <section className="py-24 px-6 bg-[var(--color-bg-card)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Lives Transformed', icon: '✨' },
              { number: '50+', label: 'Licensed Therapists', icon: '🌱' },
              { number: '95%', label: 'Satisfaction Rate', icon: '💫' },
              { number: '24/7', label: 'Support Available', icon: '🌙' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="text-center p-8 bg-[var(--color-bg-subtle)] rounded-2xl relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="font-title text-5xl text-[var(--color-primary)] mb-2">
                  {stat.number}
                </div>
                <div className="font-body text-sm text-[var(--color-text-body)] opacity-70 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveDividerSolid topColor="var(--color-bg-card)" bottomColor="var(--color-bg-subtle)" />

      {/* Our Story - Timeline */}
      <section className="py-32 px-6 bg-[var(--color-bg-subtle)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="uppercase tracking-[0.3em] text-xs mb-4 opacity-60 font-body"
            >
              Our Journey
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-title text-5xl md:text-6xl text-[var(--color-text-body)]"
            >
              The <span className="text-[var(--color-primary)] italic">Story</span> Behind Us
            </motion.h2>
          </div>

          <div className="space-y-24">
            {[
              {
                year: 'The Beginning',
                title: 'A Vision Born from Empathy',
                description: 'MindSettler was founded on the belief that mental wellness should be accessible, judgment-free, and deeply personal. We saw too many people suffering in silence, and we knew we had to change that.',
                position: 'left',
              },
              {
                year: 'The Mission',
                title: 'Breaking Down Barriers',
                description: 'We built a platform that removes the stigma around seeking help. No waiting rooms, no awkward encounters—just you, your therapist, and a safe digital space designed for healing.',
                position: 'right',
              },
              {
                year: 'Today',
                title: 'Growing Together',
                description: 'Every session, every breakthrough, every moment of clarity—these are the victories we celebrate. We\'re here not just as a service, but as your partner in wellness.',
                position: 'left',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: item.position === 'left' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className={`flex ${item.position === 'right' ? 'justify-end' : ''}`}
              >
                <div className={`max-w-xl ${item.position === 'right' ? 'text-right' : ''}`}>
                  <div className="inline-block mb-4">
                    <span className="bg-[var(--color-bg-app)] text-[var(--color-primary)] font-title text-2xl px-6 py-2 rounded-full">
                      {item.year}
                    </span>
                  </div>
                  <h3 className="font-title text-3xl text-[var(--color-text-body)] mb-4">
                    {item.title}
                  </h3>
                  <p className="font-body text-lg text-[var(--color-text-body)] opacity-80 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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

      {/* Contact Section */}
      <section className="py-24 px-6 bg-[var(--color-bg-card)]">
        <div className="max-w-6xl mx-auto">
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
              Have questions about our services? We're here to help you take the first step 
              toward your wellness journey.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-[var(--color-bg-subtle)] p-8 rounded-2xl text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--color-bg-app)] flex items-center justify-center mx-auto mb-6">
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
              </div>
              <h3 className="font-title text-2xl text-[var(--color-text-body)] mb-3">
                Email
              </h3>
              <a
                href="mailto:hello@mindsettler.com"
                className="font-body text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
              >
                hello@mindsettler.com
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-[var(--color-bg-subtle)] p-8 rounded-2xl text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--color-bg-app)] flex items-center justify-center mx-auto mb-6">
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
              </div>
              <h3 className="font-title text-2xl text-[var(--color-text-body)] mb-3">
                Phone
              </h3>
              <a
                href="tel:+911234567890"
                className="font-body text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
              >
                +91 123 456 7890
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[var(--color-bg-subtle)] p-8 rounded-2xl text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--color-bg-app)] flex items-center justify-center mx-auto mb-6">
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
              </div>
              <h3 className="font-title text-2xl text-[var(--color-text-body)] mb-3">
                Hours
              </h3>
              <p className="font-body text-[var(--color-text-body)] opacity-80">
                Monday - Saturday<br />
                9:00 AM - 8:00 PM IST
              </p>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <div className="bg-[var(--color-bg-subtle)] p-8 md:p-12 rounded-3xl shadow-lg">
              <h3 className="font-title text-3xl text-[var(--color-text-body)] mb-6 text-center">
                Send Us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block font-body text-sm text-[var(--color-text-body)] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors font-body bg-white"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-body text-sm text-[var(--color-text-body)] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors font-body bg-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block font-body text-sm text-[var(--color-text-body)] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors font-body bg-white"
                    placeholder="+91 123 456 7890"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-body text-sm text-[var(--color-text-body)] mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors font-body resize-none bg-white"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                    <p className="font-body text-green-800">
                      ✓ Thank you! Your message has been sent successfully.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                    <p className="font-body text-red-800">
                      ✗ Something went wrong. Please try again.
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-body px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    {!isSubmitting && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                        />
                      </svg>
                    )}
                  </button>
                </div>
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
              Take the first step toward mental clarity and emotional well-being. 
              Book your confidential session today.
            </p>
            <MagneticButton text="Book a Session" />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
