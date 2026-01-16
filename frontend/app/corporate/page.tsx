'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/Button';
import WaveDividerSolid from '@/components/WaveDividerSolid';
import HealingJourneySection from '@/components/HealingJourneySection';
import SectionHeader from '@/components/SectionHeader';
import CouchHero from '@/components/CouchHero';
import AnimatedCounter from '@/components/AnimatedCounter';
import dynamic from 'next/dynamic';

const MagicBento = dynamic(() => import('@/components/MagicBento'), { ssr: false, loading: () => null });

export default function CorporatePage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    employeeCount: '',
    serviceType: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        employeeCount: '',
        serviceType: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const benefits = [
    { stat: '40%', label: 'Increase in Employee Productivity' },
    { stat: '60%', label: 'Reduction in Workplace Stress' },
    { stat: '80%', label: 'Improved Team Collaboration' },
    { stat: '95%', label: 'Client Satisfaction Rate' },
  ];

  const services = [
    {
      color: '#ffffff',
      title: 'Corporate Workshops',
      description: (
        <>
          <span className="corporate-desc-text">Interactive sessions designed to enhance team well-being, stress management, and emotional intelligence in the workplace. Our workshops foster open dialogue, build resilience, and create lasting positive change in your organizational culture. Each session is tailored to address your team's specific challenges and goals.</span>
          <div className="mt-4 md:mt-0 w-full">
            <div className="relative w-full" style={{ paddingBottom: '56.666%' }}>
              <Image src="/img1.jpeg" alt="Corporate Workshops" fill className="object-cover rounded-xl" />
            </div>
          </div>
        </>
      ),
      label: '',
      tags: ['', '', ''] as [string, string, string],
    },
    {
      color: '#ffffff',
      title: 'Group Therapy Sessions',
      description: (
        <>
          <span className="corporate-desc-text">Confidential group support programs tailored for organizational teams to foster connection, resilience, and collective healing. These sessions create a safe space for employees to share experiences, develop coping strategies, and build meaningful connections with their colleagues. Professional guidance ensures productive and transformative outcomes.</span>
          <div className="mt-4 md:mt-0 w-full">
            <div className="relative w-full" style={{ paddingBottom: '56.666%' }}>
              <Image src="/img2.jpeg" alt="Group Therapy" fill className="object-cover rounded-xl" />
            </div>
          </div>
        </>
      ),
      label: '',
      tags: ['', '', ''] as [string, string, string],
    },
    {
      color: '#ffffff',
      title: 'Organizational Consultations',
      description: (
        <>
          <span className="corporate-desc-text">Strategic mental health planning and consultation services to create a culture of well-being within your organization. We work closely with leadership to develop comprehensive mental health policies, implement effective support systems, and create sustainable wellness initiatives that prioritize employee mental health at every level.</span>
          <div className="mt-4 md:mt-0 w-full">
            <div className="relative w-full" style={{ paddingBottom: '56.666%' }}>
              <Image src="/img3.jpeg" alt="Consultations" fill className="object-cover rounded-xl" />
            </div>
          </div>
        </>
      ),
      label: '',
      tags: ['', '', ''] as [string, string, string],
    },
    {
      color: '#ffffff',
      title: 'Custom Programs',
      description: (
        <>
          <span className="corporate-desc-text">Bespoke mental wellness programs designed to meet the unique needs and goals of your organization and industry. Whether you need stress management training, burnout prevention, or leadership development, we craft solutions that align with your company culture and deliver measurable results for long-term success.</span>
          <div className="mt-4 md:mt-0 w-full">
            <div className="relative w-full" style={{ paddingBottom: '56.666%' }}>
              <Image src="/img4.jpeg" alt="Custom Programs" fill className="object-cover rounded-xl" />
            </div>
          </div>
        </>
      ),
      label: '',
      tags: ['', '', ''] as [string, string, string],
    },
    {
      color: '#ffffff',
      title: 'Leadership Wellness Programs',
      description: (
        <>
          <span className="corporate-desc-text">Develop leadership resilience and emotional intelligence through targeted programs that support managers and executives. Our leadership wellness tracks focus on stress reduction, effective communication, and mindful decision-making, empowering your leaders to foster a mentally healthy workplace from the top down.</span>
          <div className="mt-4 md:mt-0 w-full">
            <div className="relative w-full" style={{ paddingBottom: '56.666%' }}>
              <Image src="/img5.jpeg" alt="Leadership Wellness Programs" fill className="object-cover rounded-xl" />
            </div>
          </div>
        </>
      ),
      label: '',
      tags: ['', '', ''] as [string, string, string],
    },
    {
      color: '#ffffff',
      title: 'Peer Support Circles',
      description: (
        <>
          <span className="corporate-desc-text">Facilitated peer groups where employees can connect, share experiences, and support each other&apos;s mental health journeys. These circles nurture trust and empathy, reduce stigma, and create a sense of belonging, making mental wellness a shared responsibility across your organization.</span>
          <div className="mt-4 md:mt-0 w-full">
            <div className="relative w-full" style={{ paddingBottom: '56.666%' }}>
              <Image src="/img6.jpeg" alt="Peer Support Circles" fill className="object-cover rounded-xl" />
            </div>
          </div>
        </>
      ),
      label: '',
      tags: ['', '', ''] as [string, string, string],
    },
    {
      color: '#ffffff',
      title: 'HR Mental Health Audits',
      description: (
        <>
          <span className="corporate-desc-text">Comprehensive assessments of existing HR policies, benefits, and workplace practices to identify mental health gaps and opportunities. Our audits provide actionable recommendations to create a supportive environment and ensure compliance with best practices in employee mental wellness.</span>
          <div className="mt-4 md:mt-0 w-full">
            <div className="relative w-full" style={{ paddingBottom: '56.666%' }}>
              <Image src="/img7.jpeg" alt="HR Mental Health Audits" fill className="object-cover rounded-xl" />
            </div>
          </div>
        </>
      ),
      label: '',
      tags: ['', '', ''] as [string, string, string],
    },
    {
      color: '#ffffff',
      title: 'Industry-Specific Wellness Tracks',
      description: (
        <>
          <span className="corporate-desc-text">Tailored wellness programs designed for the unique demands and stressors of your industry. Whether in tech, healthcare, education, or manufacturing, our industry tracks address sector-specific challenges, boost engagement, and deliver measurable improvements in well-being and performance.</span>
          <div className="mt-4 md:mt-0 w-full">
            <div className="relative w-full" style={{ paddingBottom: '56.666%' }}>
              <Image src="/img8.jpeg" alt="Industry-Specific Wellness Tracks" fill className="object-cover rounded-xl" />
            </div>
          </div>
        </>
      ),
      label: '',
      tags: ['', '', ''] as [string, string, string],
    },
  ];

  const tabs = ['Corporates', 'Group', 'One-on-one', 'Custom'];
  const [activeTab, setActiveTab] = useState(0);

  const servicesByTab: Record<number, typeof services> = {
    0: services.slice(0, 2),
    1: services.slice(2, 4),
    2: services.slice(4, 6),
    3: services.slice(6, 8),
  };

  return (
    <main className="relative bg-white">
      <CouchHero
        subheader="For Organizations"
        title={
          <>
            Corporate <span className="text-primary italic">Wellness</span>
          </>
        }
        description={`Empowering organizations to prioritize mental health through transformative
workshops, group sessions, and strategic collaborations`}
        alignment="center"
        layout="static"
        backgroundColor="white"
        cta={
          <MagneticButton
            text="Get Started"
            onClick={() =>
              document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })
            }
          />
        }
      />

      {/* Benefits / Stats Section (responsive + animated counters) */}
      <section className="py-12 px-6 bg-bg-app">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h4 className="font-title text-lg text-[var(--color-primary)] mb-2">Benefits</h4>
            <h2 className="font-title text-3xl md:text-4xl">Organizational Impact</h2>
            <p className="max-w-2xl mx-auto text-[var(--color-text-body)] mt-3">Measured improvements from our programs across productivity, stress reduction and team collaboration.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, idx) => (
              <div key={idx} className="bg-white/60 backdrop-blur-sm border border-[var(--color-border)] rounded-2xl p-6 flex flex-col items-start">
                <div className="flex items-center justify-center bg-[var(--color-primary)]/10 rounded-full w-12 h-12 mb-4">
                  <span className="text-[var(--color-primary)] font-bold">{idx + 1}</span>
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-[var(--color-primary)] mb-2">
                  {/* Animated counter supports suffix like % */}
                  <AnimatedCounter value={b.stat} className="inline-block" />
                </div>
                <div className="text-sm md:text-base text-[var(--color-text-body)]">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - similar layout to About page cards */}
      <section className="relative py-24 px-6 bg-bg-app overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <SectionHeader
              subheader="Our Services"
              title={<>What We <span className="text-primary italic">Offer</span></>}
              bodyText="Comprehensive mental wellness solutions tailored for modern workplaces"
              alignment="center"
              decoration="whiskers"
              layout="single"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Small top nav for service topics */}
            <div className="flex justify-center mb-8">
              <nav className="inline-flex rounded-2xl bg-white/30 p-1">
                {tabs.map((tab, idx) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(idx)}
                    className={`px-4 py-2 text-sm rounded-2xl text-text-body focus:outline-none transition-colors ${idx === activeTab ? 'bg-white/80' : 'hover:bg-white/40'}`}
                    type="button"
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Pass only the four service cards (images embedded in their descriptions) */}
            <div className="corporate-bento-override">
              <style>{`
/* --- PART 1: Normalize structure & spacing for ALL cards --- */
.corporate-bento-override
  .magic-bento-card__description {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  align-items: center;
  width: 100%;
  max-width: none !important;
}

.corporate-bento-override
  .corporate-desc-text {
  display: block;
  width: 100%;
  max-width: none;
  font-size: 1.125rem;
  line-height: 1.8;
}

.corporate-bento-override
  .corporate-desc-img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 22px;
}

.corporate-bento-override
  .magic-bento-card {
  padding: 2.5rem 3rem !important;
}

/* --- PART 3: Increase TITLE font size (ALL devices) --- */
.corporate-bento-override
  .magic-bento-card__title {
  font-size: clamp(1.6rem, 2.2vw, 2rem);
  line-height: 1.25;
}
@media (min-width: 1024px) {
  .corporate-bento-override .card-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  .corporate-bento-override
    .card-grid
    > .magic-bento-card:first-child {
    grid-column: 1 / -1 !important;
    padding: 2.5rem 3rem !important;
    min-height: 400px !important;
    border-radius: 28px !important;
  }

  /* Reduce padding for ALL NON-HERO cards (desktop only) */
  .corporate-bento-override
    .magic-bento-card:not(:first-child) {
    padding: 2rem 2.5rem !important;
    min-height: auto !important;
  }
}

@media (max-width: 1023px) {
  .corporate-bento-override
    .magic-bento-card:first-child
    .magic-bento-card__description {
    display: block;
  }

  .corporate-bento-override
    .magic-bento-card:first-child
    .corporate-desc-img {
    width: 100%;
    height: 220px;
    margin-top: 1rem;
  }
}

@media (min-width: 1024px) {
  .corporate-bento-override
    .magic-bento-card:not(:first-child)
    .magic-bento-card__description {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 3rem;
    align-items: center;
    width: 100%;
    max-width: none !important;
  }

  /* Reduce image height for NON-HERO cards */
  .corporate-bento-override
    .magic-bento-card:not(:first-child)
    .corporate-desc-img {
    height: 240px;
    border-radius: 18px;
  }

  .corporate-bento-override
    .magic-bento-card:nth-child(even)
    .corporate-desc-img { order: 1; }

  .corporate-bento-override
    .magic-bento-card:nth-child(even)
    .corporate-desc-text { order: 2; }

  .corporate-bento-override
    .magic-bento-card:nth-child(odd)
    .corporate-desc-img { order: 2; }

  .corporate-bento-override
    .magic-bento-card:nth-child(odd)
    .corporate-desc-text { order: 1; }
}

@media (min-width: 1024px) {
  .corporate-bento-override
    .magic-bento-card:first-child
    .magic-bento-card__description {
    display: grid !important;
    grid-template-columns: 1.2fr 1fr;
    gap: 3rem;
    align-items: center;
    width: 100%;
    max-width: none !important;
  }

  .corporate-bento-override
    .magic-bento-card:first-child
    .corporate-desc-text {
    width: 100%;
    max-width: none;
    font-size: 1.125rem;
    line-height: 1.8;
  }

  .corporate-bento-override
    .magic-bento-card:first-child
    .corporate-desc-img {
    width: 100%;
    height: 340px;
    object-fit: cover;
    border-radius: 22px;
  }
}

/* 🔥 CRITICAL FIX: remove MagicBento inner width constraint */
@media (min-width: 1024px) {
  .corporate-bento-override
    .magic-bento-card:not(:first-child)
    .magic-bento-card__content,
  .corporate-bento-override
    .magic-bento-card:not(:first-child)
    .magic-bento-card__inner,
  .corporate-bento-override
    .magic-bento-card:not(:first-child)
    .magic-bento-card__body {
    width: 100% !important;
    max-width: none !important;
  }
}
/* Removed forced stacking to allow MagicBento's native grid (4 → 2 → 1) */
              `}</style>

              <MagicBento
                cards={servicesByTab[activeTab]}
                enableStars={false}
                enableMagnetism={true}
                enableTilt={true}
                enableSpotlight={true}
                enableBorderGlow={true}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-24 px-6 bg-bg-card">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <SectionHeader
              subheader="Get in Touch"
              title={<>Request <span className="text-primary italic">Services</span></>}
              bodyText="Let's discuss how we can support your organization's mental wellness goals"
              alignment="center"
              decoration="whiskers"
              layout="single"
            />
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="bg-white/50 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-border shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="companyName" className="block font-body font-medium text-text-body mb-2.5 text-sm">
                  Company Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label htmlFor="contactPerson" className="block font-body font-medium text-text-body mb-2.5 text-sm">
                  Contact Person <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-body font-medium text-text-body mb-2.5 text-sm">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block font-body font-medium text-text-body mb-2.5 text-sm">
                  Phone Number <span className="text-primary">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-border bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body placeholder:text-text-body/40"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label htmlFor="employeeCount" className="block font-body font-medium text-text-body mb-2.5 text-sm">
                  Number of Employees
                </label>
                <select
                  id="employeeCount"
                  name="employeeCount"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal appearance-none cursor-pointer bg-white"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23453859'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                >
                  <option value="">Select range</option>
                  <option value="1-50">1-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1,000 employees</option>
                  <option value="1000+">1,000+ employees</option>
                </select>
              </div>

              <div>
                <label htmlFor="serviceType" className="block font-body font-medium text-text-body mb-2.5 text-sm">
                  Service Interest <span className="text-primary">*</span>
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal appearance-none cursor-pointer bg-white"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23453859'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                >
                  <option value="">Select service</option>
                  <option value="workshops">Corporate Workshops</option>
                  <option value="group-therapy">Group Therapy Sessions</option>
                  <option value="consultations">Organizational Consultations</option>
                  <option value="custom">Custom Programs</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="message" className="block font-body font-medium text-text-body mb-2.5 text-sm">
                Tell Us More <span className="text-primary">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal resize-none bg-white"
                placeholder="Tell us about your organization's wellness needs, goals, and any specific challenges you'd like to address..."
              />
            </div>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 bg-[var(--color-bg-lavender)] border-2 border-[var(--color-primary)]/20 rounded-3xl text-center max-w-2xl mx-auto"
              >
                <p className="font-body text-[var(--color-primary)] font-semibold">
                  ✓ Thank you! We'll get back to you within 24 hours.
                </p>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-3xl text-center max-w-2xl mx-auto"
              >
                <p className="font-body text-red-800 font-semibold">
                  Something went wrong. Please try again or contact us directly.
                </p>
              </motion.div>
            )}

            <div className="flex justify-center w-full">
              <div className="w-full sm:w-auto">
                <MagneticButton text={isSubmitting ? 'Sending...' : 'Submit Request'} type="submit" className="w-full" />
              </div>
            </div>
          </motion.form>
        </div>
      </section>

      <HealingJourneySection />
    </main>
  );
}
