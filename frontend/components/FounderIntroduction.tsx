'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/SectionHeader';
import MagneticButton from '@/components/Button';

interface FounderIntroductionProps {
  videoUrl: string;
  founderName?: string;
  education?: string[];
  experience?: string[];
  introduction?: string;
  certifications?: string[];
}

export default function FounderIntroduction({
  videoUrl,
  founderName = "Parnika Bajaj",
  education = [
    "Master's in Clinical Psychology, University of Delhi",
    "Bachelor's in Psychology, Lady Shri Ram College"
  ],
  experience = [
    "5+ years of clinical practice in mental health counseling",
    "Specialized in anxiety, depression, and relationship therapy",
    "Former consultant at Apollo Hospitals"
  ],
  introduction = "I'm Parnika, and I created MindSettler because I believe everyone deserves a safe space to heal. My journey in psychology began with a simple question: how can we make mental wellness accessible to everyone, not just a privileged few?"
  ,
  certifications = [
    "Trained in Counseling Psychology",
    "Evidence-Based Therapeutic Practices"
  ]
}: FounderIntroductionProps) {
  return (
    <section className="relative py-20 px-4 bg-[var(--color-bg-subtle)] overflow-hidden">
      {/* Ambient Glow Effects */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[var(--color-primary)]/5 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-400/5 blur-3xl"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-16">
          <SectionHeader
            subheader="About MindSettler"
            title={<>Meet the <span className="italic">Founder</span></>}
            bodyText="Learn about the vision, education, and experience behind MindSettler"
            alignment="center"
            decoration="whiskers"
            layout="single"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Video Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative">
              {/* Decorative background element */}


              {/* Watch Introduction Tag */}




              {/* Video Container */}
              <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl aspect-[9/16] w-full max-w-[420px] sm:max-w-[480px] mx-auto">
                <video
                  src={videoUrl}
                  poster="/parnika.jpeg"
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  aria-label="What is MindSettler - Introduction Video"
                  style={{
                    // Custom video progress bar styling
                    accentColor: 'var(--color-primary)',
                  }}
                >
                  Your browser does not support the video tag.
                </video>

              </div>
            </div>
          </motion.div>

          {/* Introduction Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 flex flex-col justify-start"
          >
            {/* Introduction Text */}
            <motion.p
              className="font-body text-base md:text-lg lg:text-xl text-[var(--color-text-body)] opacity-80 leading-relaxed mb-8 md:mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {introduction}
            </motion.p>

            {/* Education Section */}
            {education && education.length > 0 && (
              <motion.div
                className="mb-6 md:mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h4 className="font-title text-lg md:text-xl lg:text-2xl text-[var(--color-text-body)] mb-3 md:mb-4 tracking-wider uppercase">
                  Education
                </h4>
                <ul className="space-y-2 md:space-y-3">
                  {education.map((item, index) => (
                    <li key={index} className="font-body text-base md:text-lg lg:text-xl text-[var(--color-text-body)] opacity-80 flex items-start">
                      <span className="text-[var(--color-primary)] mr-3 self-start mt-1.5">•</span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Experience Section */}
            {experience && experience.length > 0 && (
              <motion.div
                className="mb-6 md:mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h4 className="font-title text-lg md:text-xl lg:text-2xl text-[var(--color-text-body)] mb-3 md:mb-4 tracking-wider uppercase">
                  Experience
                </h4>
                <ul className="space-y-2 md:space-y-3">
                  {experience.map((item, index) => (
                    <li key={index} className="font-body text-base md:text-lg lg:text-xl text-[var(--color-text-body)] opacity-80 flex items-start">
                      <span className="text-[var(--color-primary)] mr-3 self-start mt-1.5">•</span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Certifications Section - match styling with Education/Experience for consistency */}
            {certifications && certifications.length > 0 && (
              <motion.div
                className="mb-6 md:mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h4 className="font-title text-lg md:text-xl lg:text-2xl text-[var(--color-text-body)] mb-3 md:mb-4 tracking-wider uppercase">
                  Certifications
                </h4>
                <ul className="space-y-2 md:space-y-3">
                  {certifications.map((item, index) => (
                    <li key={index} className="font-body text-base md:text-lg lg:text-xl text-[var(--color-text-body)] opacity-80 flex items-start">
                      <span className="text-[var(--color-primary)] mr-3 self-start mt-1.5">•</span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Learn More Button - Centered in viewport */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="w-full mt-12 flex items-center justify-center"
        >
          <MagneticButton text="Learn More" href="/resources" />
        </motion.div>
      </div>
    </section>
  );
}
