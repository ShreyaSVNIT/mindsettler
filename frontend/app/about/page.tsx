'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/Button';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-subtle)]">
      {/* Hero Section */}
      <section className="relative py-32 px-6 bg-[var(--color-bg-app)] overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="uppercase tracking-widest text-xs mb-6 opacity-70 font-body"
          >
            About MindSettler
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-title text-5xl md:text-7xl text-[var(--color-text-body)] mb-8 leading-tight"
          >
            A Sanctuary for <br />
            <span className="text-[var(--color-primary)]">Mental Well-Being</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-lg md:text-xl text-[var(--color-text-body)] opacity-80 max-w-3xl mx-auto leading-relaxed"
          >
            We believe everyone deserves access to compassionate, professional mental health support. 
            MindSettler bridges the gap between traditional therapy and modern convenience, offering 
            structured psycho-education sessions tailored to your unique journey.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="uppercase tracking-widest text-xs mb-4 opacity-60 font-body">
                Our Mission
              </p>
              <h2 className="font-title text-4xl md:text-5xl text-[var(--color-text-body)] mb-6">
                Empowering Your Inner Journey
              </h2>
              <p className="font-body text-[var(--color-text-body)] opacity-80 leading-relaxed mb-6">
                At MindSettler, we're committed to making mental wellness accessible, 
                approachable, and transformative. We provide a safe digital space where 
                you can explore your emotions, build resilience, and develop lasting 
                coping strategies.
              </p>
              <p className="font-body text-[var(--color-text-body)] opacity-80 leading-relaxed">
                Our approach combines evidence-based techniques with compassionate guidance, 
                ensuring every session brings you closer to clarity and balance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
                alt="Mental wellness"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-32">
            {[
              {
                title: 'Confidential',
                description: 'Your privacy is our priority. All sessions are completely confidential and secure.',
              },
              {
                title: 'Professional',
                description: 'Work with licensed psychotherapists trained in evidence-based practices.',
              },
              {
                title: 'Accessible',
                description: 'Mental wellness support available wherever you are, whenever you need it.',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[var(--color-bg-card)] p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="font-title text-2xl text-[var(--color-primary)] mb-4">
                  {value.title}
                </h3>
                <p className="font-body text-[var(--color-text-body)] opacity-80 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-24 px-6 bg-[var(--color-bg-card)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="uppercase tracking-widest text-xs mb-4 opacity-60 font-body">
              Our Approach
            </p>
            <h2 className="font-title text-4xl md:text-5xl text-[var(--color-text-body)] mb-6">
              How We Support You
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                step: '01',
                title: 'Personalized Matching',
                description: 'We help you find the right therapist based on your specific needs, preferences, and wellness goals.',
              },
              {
                step: '02',
                title: 'Structured Sessions',
                description: 'Each session follows a proven framework designed to maximize growth and provide actionable insights.',
              },
              {
                step: '03',
                title: 'Ongoing Support',
                description: 'Between sessions, access resources and tools to continue your progress and maintain momentum.',
              },
              {
                step: '04',
                title: 'Progress Tracking',
                description: 'Monitor your journey with regular check-ins and adjustments to ensure you\'re moving forward.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-bg-app)] flex items-center justify-center">
                    <span className="font-title text-2xl text-[var(--color-primary)]">
                      {item.step}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-title text-2xl text-[var(--color-text-body)] mb-3">
                    {item.title}
                  </h3>
                  <p className="font-body text-[var(--color-text-body)] opacity-80 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="uppercase tracking-widest text-xs mb-4 opacity-60 font-body">
              Expert Care
            </p>
            <h2 className="font-title text-4xl md:text-5xl text-[var(--color-text-body)] mb-6">
              Licensed Professionals
            </h2>
            <p className="font-body text-lg text-[var(--color-text-body)] opacity-80 max-w-3xl mx-auto leading-relaxed mb-12">
              Our network consists of experienced, licensed psychotherapists who specialize 
              in various areas of mental health. Each professional is carefully vetted to 
              ensure they meet our standards of excellence and compassion.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              'Anxiety & Stress',
              'Depression',
              'Relationship Issues',
              'Life Transitions',
              'Trauma Recovery',
              'Self-Esteem',
              'Work-Life Balance',
              'Personal Growth',
            ].map((specialty, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-[var(--color-bg-card)] py-6 px-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors duration-300"
              >
                <p className="font-body text-sm text-[var(--color-text-body)]">
                  {specialty}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
