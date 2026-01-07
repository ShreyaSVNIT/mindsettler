'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/Button';
import WaveDividerSolid from '@/components/WaveDividerSolid';

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

  const services = [
    {
      title: 'Corporate Workshops',
      description: 'Interactive sessions designed to enhance team well-being, stress management, and emotional intelligence in the workplace.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    },
    {
      title: 'Group Therapy Sessions',
      description: 'Confidential group support programs tailored for organizational teams to foster connection, resilience, and collective healing.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      title: 'Organizational Consultations',
      description: 'Strategic mental health planning and consultation services to create a culture of well-being within your organization.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      ),
    },
    {
      title: 'Custom Programs',
      description: 'Bespoke mental wellness programs designed to meet the unique needs and goals of your organization and industry.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const benefits = [
    {
      stat: '40%',
      label: 'Increase in Employee Productivity',
    },
    {
      stat: '60%',
      label: 'Reduction in Workplace Stress',
    },
    {
      stat: '80%',
      label: 'Improved Team Collaboration',
    },
    {
      stat: '95%',
      label: 'Client Satisfaction Rate',
    },
  ];

  return (
    <main className="relative bg-[var(--color-bg-app)]">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-20 overflow-hidden">
        {/* Background decorative elements */}
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 bg-white/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--color-primary)]" />
              <span className="text-[var(--color-primary)] text-[10px] tracking-[0.4em] uppercase font-body font-light">
                For Organizations
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--color-primary)]" />
            </div>

            <h1 className="font-title text-6xl md:text-7xl lg:text-8xl text-[var(--color-text-body)] mb-6 leading-[1.1]">
              Corporate{' '}
              <span className="text-[var(--color-primary)] italic font-light">Wellness</span>
            </h1>

            <p className="font-body text-xl md:text-2xl text-[var(--color-text-body)]/70 max-w-3xl mx-auto leading-relaxed mb-12">
              Empowering organizations to prioritize mental health through transformative workshops, group sessions, and strategic collaborations
            </p>

            <MagneticButton text="Get Started" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })} />
          </motion.div>
        </div>
      </section>

      <WaveDividerSolid topColor="var(--color-bg-app)" bottomColor="var(--color-bg-card)" />

      {/* Services Section */}
      <section className="py-24 px-6 bg-[var(--color-bg-card)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--color-primary)]" />
              <span className="text-[var(--color-primary)] text-[10px] tracking-[0.4em] uppercase font-body font-light">
                Our Services
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--color-primary)]" />
            </div>
            <h2 className="font-title text-5xl md:text-6xl lg:text-7xl text-[var(--color-text-body)] mb-4">
              What We <span className="text-[var(--color-primary)] italic">Offer</span>
            </h2>
            <p className="font-body text-lg text-[var(--color-text-body)]/60 max-w-2xl mx-auto">
              Comprehensive mental wellness solutions tailored for modern workplaces
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-[var(--color-bg-subtle)] p-8 rounded-2xl border border-white/10 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-bg-app)] flex items-center justify-center mb-6 text-[var(--color-primary)]">
                    {service.icon}
                  </div>
                  <h3 className="font-title text-2xl text-[var(--color-text-body)] mb-4">
                    {service.title}
                  </h3>
                  <p className="font-body text-[var(--color-text-body)]/70 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveDividerSolid topColor="var(--color-bg-card)" bottomColor="var(--color-bg-subtle)" />

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-[var(--color-bg-subtle)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--color-primary)]" />
              <span className="text-[var(--color-primary)] text-[10px] tracking-[0.4em] uppercase font-body font-light">
                Impact
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--color-primary)]" />
            </div>
            <h2 className="font-title text-5xl md:text-6xl text-[var(--color-text-body)] mb-4">
              Proven <span className="text-[var(--color-primary)] italic">Results</span>
            </h2>
            <p className="font-body text-lg text-[var(--color-text-body)]/60 max-w-2xl mx-auto">
              Our corporate wellness programs deliver measurable improvements
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-2xl text-center shadow-lg border border-[var(--color-primary)]/10"
              >
                <div className="font-title text-6xl text-[var(--color-primary)] mb-4">
                  {benefit.stat}
                </div>
                <p className="font-body text-[var(--color-text-body)]/80">
                  {benefit.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveDividerSolid topColor="var(--color-bg-subtle)" bottomColor="var(--color-bg-card)" />

      {/* Contact Form Section */}
      <section id="contact-form" className="py-24 px-6 bg-[var(--color-bg-card)]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--color-primary)]" />
              <span className="text-[var(--color-primary)] text-[10px] tracking-[0.4em] uppercase font-body font-light">
                Get in Touch
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--color-primary)]" />
            </div>
            <h2 className="font-title text-5xl md:text-6xl text-[var(--color-text-body)] mb-4">
              Request <span className="text-[var(--color-primary)] italic">Services</span>
            </h2>
            <p className="font-body text-lg text-[var(--color-text-body)]/60">
              Let's discuss how we can support your organization's mental wellness goals
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="bg-[var(--color-bg-subtle)] p-8 md:p-12 rounded-3xl border border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="companyName" className="block font-body text-[var(--color-text-body)] mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all font-body"
                />
              </div>

              <div>
                <label htmlFor="contactPerson" className="block font-body text-[var(--color-text-body)] mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all font-body"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-body text-[var(--color-text-body)] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all font-body"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block font-body text-[var(--color-text-body)] mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all font-body"
                />
              </div>

              <div>
                <label htmlFor="employeeCount" className="block font-body text-[var(--color-text-body)] mb-2">
                  Number of Employees
                </label>
                <select
                  id="employeeCount"
                  name="employeeCount"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all font-body"
                >
                  <option value="">Select range</option>
                  <option value="1-50">1-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="501-1000">501-1000</option>
                  <option value="1000+">1000+</option>
                </select>
              </div>

              <div>
                <label htmlFor="serviceType" className="block font-body text-[var(--color-text-body)] mb-2">
                  Service Interest *
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all font-body"
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
              <label htmlFor="message" className="block font-body text-[var(--color-text-body)] mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all font-body resize-none"
                placeholder="Tell us about your organization's wellness needs..."
              />
            </div>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
              >
                <p className="font-body text-green-800 text-center">
                  Thank you! We'll get back to you within 24 hours.
                </p>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <p className="font-body text-red-800 text-center">
                  Something went wrong. Please try again or contact us directly.
                </p>
              </motion.div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex items-center gap-6 rounded-full py-4 px-12 overflow-hidden transition-all duration-500 bg-[var(--color-primary)] hover:bg-[var(--color-text-body)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 font-body text-xl tracking-tight transition-colors duration-500 text-white">
                  {isSubmitting ? 'Sending...' : 'Submit Request'}
                </span>
              </button>
            </div>
          </motion.form>
        </div>
      </section>
    </main>
  );
}
