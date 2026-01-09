'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/Button';
import WaveDividerSolid from '@/components/WaveDividerSolid';
import HealingJourneySection from '@/components/HealingJourneySection';
import SectionHeader from '@/components/SectionHeader';
import CouchHero from '@/components/CouchHero';
import MagicBento from '@/components/MagicBento';

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
      description: 'Interactive sessions designed to enhance team well-being, stress management, and emotional intelligence in the workplace. Our workshops foster open dialogue, build resilience, and create lasting positive change in your organizational culture. Each session is tailored to address your team\'s specific challenges and goals.',
      label: '',
      tags: ['', '', ''] as [string, string, string],
    },
    {
      color: '#ffffff',
      title: 'Group Therapy Sessions',
      description: 'Confidential group support programs tailored for organizational teams to foster connection, resilience, and collective healing. These sessions create a safe space for employees to share experiences, develop coping strategies, and build meaningful connections with their colleagues. Professional guidance ensures productive and transformative outcomes.',
      label: '',
      tags: ['', '', ''] as [string, string, string],
    },
    {
      color: '#ffffff',
      title: 'Organizational Consultations',
      description: 'Strategic mental health planning and consultation services to create a culture of well-being within your organization. We work closely with leadership to develop comprehensive mental health policies, implement effective support systems, and create sustainable wellness initiatives that prioritize employee mental health at every level.',
      label: '',
      tags: ['', '', ''] as [string, string, string],
    },
    {
      color: '#ffffff',
      title: 'Custom Programs',
      description: 'Bespoke mental wellness programs designed to meet the unique needs and goals of your organization and industry. Whether you need stress management training, burnout prevention, or leadership development, we craft solutions that align with your company culture and deliver measurable results for long-term success.',
      label: '',
      tags: ['', '', ''] as [string, string, string],
    },
  ];

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
            <MagicBento
              cards={services}
              enableStars={false}
              enableMagnetism={true}
              enableTilt={true}
              enableSpotlight={true}
              enableBorderGlow={true}
            />
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-24 px-6 bg-bg-card">
        <div className="max-w-4xl mx-auto">
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
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-border bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body placeholder:text-text-body/40"
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
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-border bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body placeholder:text-text-body/40"
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
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-border bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body placeholder:text-text-body/40"
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
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-border bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body appearance-none cursor-pointer"
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
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-border bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body appearance-none cursor-pointer"
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
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-border bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body resize-none placeholder:text-text-body/40"
                placeholder="Tell us about your organization's wellness needs, goals, and any specific challenges you'd like to address..."
              />
            </div>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-5 bg-emerald-50 border-2 border-emerald-200 rounded-2xl"
              >
                <p className="font-body text-emerald-800 text-center font-medium">
                  ✓ Thank you! We'll get back to you within 24 hours.
                </p>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-5 bg-red-50 border-2 border-red-200 rounded-2xl"
              >
                <p className="font-body text-red-800 text-center font-medium">
                  Something went wrong. Please try again or contact us directly.
                </p>
              </motion.div>
            )}

            <div className="flex justify-center">
              <MagneticButton
                text={isSubmitting ? 'Sending...' : 'Submit Request'}
                onClick={() => {
                  // MagneticButton doesn't have type="submit" by default, so we handle it via onClick
                  if (!isSubmitting) {
                    const form = document.querySelector('#contact-form form') as HTMLFormElement;
                    form?.requestSubmit();
                  }
                }}
              />
            </div>
          </motion.form>
        </div>
      </section>

      <HealingJourneySection />
    </main>
  );
}
