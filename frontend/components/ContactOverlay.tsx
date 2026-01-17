'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Instagram, Linkedin, Twitter } from 'lucide-react';
import MagneticButton from './Button';

export default function ContactOverlay({ initialOpen = false }: { initialOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [hideDueToChat, setHideDueToChat] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    hearAbout: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // You can add your form submission logic here
  };

  useEffect(() => {
    const onOpen = () => setHideDueToChat(true);
    const onClose = () => setHideDueToChat(false);
    if (typeof window !== 'undefined') {
      window.addEventListener('chat-opened', onOpen as EventListener);
      window.addEventListener('chat-closed', onClose as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('chat-opened', onOpen as EventListener);
        window.removeEventListener('chat-closed', onClose as EventListener);
      }
    };
  }, []);

  return (
    <>
      {/* Floating CTA Corner */}
      <AnimatePresence>
        {!isOpen && !hideDueToChat && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed bottom-0 right-0 z-[100] cursor-pointer"
            onClick={() => {
              // push a lightweight URL marker so opening the overlay is reflected in the URL
              try {
                if (typeof window !== 'undefined') {
                  const next = window.location.pathname + (window.location.search ? window.location.search + '&' : '?') + 'contact=1';
                  window.history.pushState({}, '', next);
                }
              } catch (e) { }
              setIsOpen(true);
            }}
          >
            <div className="relative bg-[var(--color-primary)] text-white px-4 py-2 md:px-8 md:py-4 rounded-tl-[1rem] md:rounded-tl-[1.75rem] shadow-2xl hover:shadow-[var(--color-primary)]/50 transition-all">
              <div className="flex flex-col items-start">
                <span className="font-title text-lg md:text-2xl font-bold uppercase tracking-wider leading-none">
                  LET&apos;S
                </span>
                <span className="font-title text-lg md:text-2xl font-bold uppercase tracking-wider leading-none">
                  TALK
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Contact Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 95% 95%)' }}
            animate={{ clipPath: 'circle(150% at 95% 95%)' }}
            exit={{ clipPath: 'circle(0% at 95% 95%)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[200] bg-[var(--color-bg-app)] overflow-y-auto"
          >
            <div className="min-h-screen w-full relative">

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setIsOpen(false)}
                className="fixed top-8 right-8 w-14 h-14 rounded-full bg-[var(--color-text-body)] text-white flex items-center justify-center hover:scale-110 transition-transform z-10"
              >
                <X size={24} />
              </motion.button>

              <div className="container mx-auto px-6 py-20 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                  {/* Left Side - Heading & Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="space-y-12 lg:sticky lg:top-20"
                  >
                    <div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="inline-block bg-white px-4 py-2 rounded-full mb-6"
                      >
                        <span className="font-body text-sm font-bold text-[var(--color-text-body)] uppercase tracking-wider">
                          Contact
                        </span>
                      </motion.div>

                      <h1 className="font-title text-6xl md:text-7xl lg:text-8xl font-bold text-[var(--color-text-body)] mb-6 leading-none">
                        LET&apos;S WORK<br />
                        <span className="text-[var(--color-primary)] italic">TOGETHER</span>
                      </h1>

                      <p className="font-body text-lg text-[var(--color-text-body)]/70 max-w-lg">
                        Ready to start your healing journey? Reach out and let&apos;s create a personalized plan for your mental wellness.
                      </p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                      <div>
                        <h3 className="font-body text-sm font-bold uppercase tracking-wider text-[var(--color-text-body)]/60 mb-3">
                          Give us a call
                        </h3>
                        <a href="tel:+919876543210" className="font-body text-2xl text-[var(--color-text-body)] hover:text-[var(--color-primary)] transition-colors underline">
                          +91 98765 43210
                        </a>
                      </div>

                      <div>
                        <h3 className="font-body text-sm font-bold uppercase tracking-wider text-[var(--color-text-body)]/60 mb-3">
                          Send us an email
                        </h3>
                        <a href="mailto:mindsettler.dev@gmail.com" className="font-body text-2xl text-[var(--color-text-body)] hover:text-[var(--color-primary)] transition-colors underline">
                          mindsettler.dev@gmail.com
                        </a>
                      </div>

                      <div>
                        <h3 className="font-body text-sm font-bold uppercase tracking-wider text-[var(--color-text-body)]/60 mb-3">
                          Join us
                        </h3>
                        <a href="/about#contact" className="font-body text-2xl text-[var(--color-text-body)] hover:text-[var(--color-primary)] transition-colors underline">
                          See Opportunities
                        </a>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4">
                      {[
                        { icon: Instagram, href: '#' },
                        { icon: Linkedin, href: '#' },
                        { icon: Twitter, href: '#' }
                      ].map((social, i) => (
                        <motion.a
                          key={i}
                          href={social.href}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                          className="w-12 h-12 rounded-full border-2 border-[var(--color-text-body)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-white transition-all"
                        >
                          <social.icon size={20} />
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>

                  {/* Right Side - Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-[var(--color-primary)]/20"
                  >
                    <h2 className="font-title text-3xl font-bold text-[var(--color-text-body)] mb-8">
                      Get in Touch
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Full Name */}
                      <div>
                        <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body bg-[var(--color-bg-lavender)]"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body bg-[var(--color-bg-lavender)]"
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body bg-[var(--color-bg-lavender)]"
                          placeholder="9876543210"
                        />
                      </div>

                      {/* How did you hear about us */}
                      <div>
                        <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                          How did you hear about us?
                        </label>
                        <select
                          value={formData.hearAbout}
                          onChange={(e) => setFormData({ ...formData, hearAbout: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body bg-[var(--color-bg-lavender)]"
                        >
                          <option value="">Please Select</option>
                          <option value="search">Search Engine</option>
                          <option value="social">Social Media</option>
                          <option value="referral">Friend/Family Referral</option>
                          <option value="advertisement">Advertisement</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                          How can we help?
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body resize-none bg-[var(--color-bg-lavender)]"
                          required
                        />
                      </div>

                      {/* Newsletter Checkbox */}
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="mt-1 w-5 h-5 rounded border-2 border-[var(--color-primary)]/40 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <span className="font-body text-sm text-[var(--color-text-body)]/90">
                          Subscribe for the latest news and insights delivered to your inbox
                        </span>
                      </label>

                      {/* Submit Button */}
                      <div className="pt-4 flex justify-center">
                        <div onClick={handleSubmit as any}>
                          <MagneticButton text="Send Message" />
                        </div>
                      </div>

                      <p className="text-xs text-center text-[var(--color-text-body)]/60 font-body">
                        By submitting this form I accept the{' '}
                        <a href="/privacy-policy" className="text-[var(--color-primary)] underline">
                          Privacy Policy
                        </a>
                        {' '}of this site.
                      </p>
                    </form>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
