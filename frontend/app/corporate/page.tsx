'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticButton from '@/components/Button';
import WaveDividerSolid from '@/components/WaveDividerSolid';
import HealingJourneySection from '@/components/HealingJourneySection';
import SectionHeader from '@/components/SectionHeader';
import CouchHero from '@/components/CouchHero';
import AnimatedCounter from '@/components/AnimatedCounter';
import dynamic from 'next/dynamic';
import { ChevronRight, ChevronLeft, Building2, Users, DollarSign, MessageSquare, CheckCircle2 } from 'lucide-react';

const MagicBento = dynamic(() => import('@/components/MagicBento'), { ssr: false, loading: () => null });

// Multi-step form state types
type FormStep = 1 | 2 | 3;

interface CorporateFormData {
  // Step 1: Company Information
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  
  // Step 2: Requirements
  employeeCount: string;
  serviceType: string;
  budgetRange: string;
  timeline: string;
  
  // Step 3: Details
  message: string;
  preferredContactMethod: string;
  bestTimeToContact: string;
}

export default function CorporatePage() {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<CorporateFormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    industry: '',
    employeeCount: '',
    serviceType: '',
    budgetRange: '',
    timeline: '',
    message: '',
    preferredContactMethod: 'email',
    bestTimeToContact: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<Record<keyof CorporateFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof CorporateFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep = (step: FormStep): boolean => {
    const newErrors: Partial<Record<keyof CorporateFormData, string>> = {};

    if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
    } else if (step === 2) {
      if (!formData.employeeCount) newErrors.employeeCount = 'Please select employee count';
      if (!formData.serviceType) newErrors.serviceType = 'Please select a service';
      if (!formData.budgetRange) newErrors.budgetRange = 'Please select a budget range';
      if (!formData.timeline) newErrors.timeline = 'Please select a timeline';
    } else if (step === 3) {
      if (!formData.message.trim()) newErrors.message = 'Please provide details about your needs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(3, prev + 1) as FormStep);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as FormStep);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send email using the backend or a serverless function
      const response = await fetch('/api/send-corporate-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          to: 'mindsettler.dev@gmail.com',
        }),
      });

      if (!response.ok) throw new Error('Failed to send inquiry');

      setSubmitStatus('success');
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        industry: '',
        employeeCount: '',
        serviceType: '',
        budgetRange: '',
        timeline: '',
        message: '',
        preferredContactMethod: 'email',
        bestTimeToContact: '',
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Submission error:', error);
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

  // Progress percentage for multi-step form
  const progress = (currentStep / 3) * 100;

  return (
    <main className="relative bg-white">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-purple-400/10 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

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
        className="h-screen"
        backgroundColor="white"
      />

      

      {/* Services Section with parallax images */}
      <section id="services" className="relative py-24 px-6 bg-bg-app overflow-hidden">
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

            {/* Service cards with stagger entrance */}
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

      {/* Contact Form Section - Multi-Step */}
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

          {/* Success Message */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 bg-[var(--color-bg-lavender)] border-2 border-[var(--color-primary)]/20 rounded-3xl p-10 text-center shadow-xl"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-6xl mb-4"
              >
                <CheckCircle2 className="w-16 h-16 mx-auto text-[var(--color-primary)]" />
              </motion.div>
              <h3 className="font-title text-3xl text-[var(--color-primary)] mb-3">Thank You!</h3>
              <p className="font-body text-lg text-[var(--color-text-body)] max-w-md mx-auto">
                We've received your inquiry and will get back to you within 24 hours.
              </p>
            </motion.div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 bg-red-50 border-2 border-red-200 rounded-3xl p-6 text-center"
            >
              <p className="font-body text-red-800 font-semibold">
                Something went wrong. Please try again or contact us directly at mindsettler.dev@gmail.com
              </p>
            </motion.div>
          )}

          {/* Multi-Step Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[var(--color-bg-lavender)] rounded-3xl shadow-2xl p-8 md:p-12 border border-[var(--color-primary)]/20"
          >
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="font-body text-sm font-semibold text-[var(--color-text-body)]">
                  Step {currentStep} of 3
                </span>
                <span className="font-body text-sm text-[var(--color-text-body)]/60">
                  {currentStep === 1 ? 'Company Info' : currentStep === 2 ? 'Requirements' : 'Details'}
                </span>
              </div>
              <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--color-primary)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Company Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[var(--color-primary)]/10 p-3 rounded-xl">
                      <Building2 className="w-6 h-6 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="font-body text-xl font-bold text-[var(--color-text-body)]">
                      Company Information
                    </h3>
                  </div>

                  <div>
                    <label htmlFor="companyName" className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                      Company Name <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                      placeholder="Your company name"
                    />
                    {errors.companyName && <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.companyName}</p>}
                  </div>

                  <div>
                    <label htmlFor="contactPerson" className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                      Contact Person <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                      placeholder="Full name"
                    />
                    {errors.contactPerson && <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.contactPerson}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                        Email Address <span className="text-[var(--color-primary)]">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                        placeholder="you@company.com"
                      />
                      {errors.email && <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                        Phone Number <span className="text-[var(--color-primary)]">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                        placeholder="+1 (555) 000-0000"
                      />
                      {errors.phone && <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="industry" className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                      Industry <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <input
                      type="text"
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                      placeholder="e.g., Technology, Healthcare, Education"
                    />
                    {errors.industry && <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.industry}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Requirements */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[var(--color-primary)]/10 p-3 rounded-xl">
                      <Users className="w-6 h-6 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="font-body text-xl font-bold text-[var(--color-text-body)]">
                      Program Requirements
                    </h3>
                  </div>

                  <div>
                    <label htmlFor="employeeCount" className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                      Number of Employees <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <select
                      id="employeeCount"
                      name="employeeCount"
                      value={formData.employeeCount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                    >
                      <option value="">Select range</option>
                      <option value="1-50">1-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1,000 employees</option>
                      <option value="1000+">1,000+ employees</option>
                    </select>
                    {errors.employeeCount && <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.employeeCount}</p>}
                  </div>

                  <div>
                    <label htmlFor="serviceType" className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                      Service Interest <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                    >
                      <option value="">Select service</option>
                      <option value="workshops">Corporate Workshops</option>
                      <option value="group-therapy">Group Therapy Sessions</option>
                      <option value="consultations">Organizational Consultations</option>
                      <option value="custom">Custom Programs</option>
                      <option value="leadership">Leadership Wellness Programs</option>
                      <option value="peer-support">Peer Support Circles</option>
                      <option value="hr-audit">HR Mental Health Audits</option>
                      <option value="industry-specific">Industry-Specific Wellness</option>
                    </select>
                    {errors.serviceType && <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.serviceType}</p>}
                  </div>

                  <div>
                    <label htmlFor="budgetRange" className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                      Budget Range <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <select
                      id="budgetRange"
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-25k">Under ₹25,000</option>
                      <option value="25k-50k">₹25,000 - ₹50,000</option>
                      <option value="50k-100k">₹50,000 - ₹1,00,000</option>
                      <option value="100k-250k">₹1,00,000 - ₹2,50,000</option>
                      <option value="250k-500k">₹2,50,000 - ₹5,00,000</option>
                      <option value="500k-plus">₹5,00,000+</option>
                      <option value="flexible">Flexible / To be discussed</option>
                    </select>
                    {errors.budgetRange && <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.budgetRange}</p>}
                  </div>

                  <div>
                    <label htmlFor="timeline" className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                      Expected Timeline <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                    >
                      <option value="">Select timeline</option>
                      <option value="immediate">Immediate (within 2 weeks)</option>
                      <option value="1-month">Within 1 month</option>
                      <option value="2-3-months">2-3 months</option>
                      <option value="3-6-months">3-6 months</option>
                      <option value="flexible">Flexible timeline</option>
                    </select>
                    {errors.timeline && <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.timeline}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Additional Details */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[var(--color-primary)]/10 p-3 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="font-body text-xl font-bold text-[var(--color-text-body)]">
                      Additional Details
                    </h3>
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                      Tell Us More <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal resize-none bg-white"
                      placeholder="Tell us about your organization's wellness needs, goals, and any specific challenges you'd like to address..."
                    />
                    {errors.message && <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.message}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="preferredContactMethod" className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                        Preferred Contact Method
                      </label>
                      <select
                        id="preferredContactMethod"
                        name="preferredContactMethod"
                        value={formData.preferredContactMethod}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="video-call">Video Call</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="bestTimeToContact" className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                        Best Time to Contact
                      </label>
                      <select
                        id="bestTimeToContact"
                        name="bestTimeToContact"
                        value={formData.bestTimeToContact}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                      >
                        <option value="">Select time</option>
                        <option value="morning">Morning (9 AM - 12 PM)</option>
                        <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                        <option value="evening">Evening (4 PM - 7 PM)</option>
                        <option value="anytime">Anytime</option>
                      </select>
                    </div>
                  </div>

                  {/* Privacy note */}
                  <div className="bg-[var(--color-primary)]/5 p-4 rounded-xl border border-[var(--color-primary)]/10">
                    <p className="font-body text-xs text-[var(--color-text-body)]/70 text-center">
                      🔒 Your information is confidential and secure. We'll only use it to discuss your wellness program needs.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-[var(--color-primary)]/10">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[var(--color-primary)]/20 hover:border-[var(--color-primary)] text-[var(--color-text-body)] font-body font-semibold transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-body font-semibold transition-all ml-auto"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="ml-auto">
                    {isSubmitting ? (
                      <button
                        disabled
                        className="bg-[var(--color-primary)]/50 text-white font-body font-semibold px-12 py-4 rounded-full transition-all cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                      >
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </button>
                    ) : (
                      <MagneticButton text="Submit Request" type="submit" />
                    )}
                  </div>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <HealingJourneySection />
    </main>
  );
}
