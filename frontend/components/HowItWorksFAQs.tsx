"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqSections = [
  {
    title: "Getting Started",
    faqs: [
      {
        question: "How do I book a session?",
        answer:
          "You can book a session through our website by clicking 'Book a Session' or contacting our team directly. We'll guide you through the process and help you choose the best option for your needs.",
      },
      {
        question: "What should I expect during my first session?",
        answer:
          "Your first session includes an initial assessment, goal setting, and building rapport with your psychologist. We'll discuss your concerns and create a personalized plan for your mental wellness journey.",
      },
      {
        question: "What is the duration of a typical session?",
        answer:
          "Each session lasts approximately 60 minutes, providing ample time for meaningful discussion and structured guidance.",
      },
    ],
  },
  {
    title: "Pricing & Booking",
    faqs: [
      {
        question: "How much does a session cost?",
        answer:
          "Session pricing varies based on the type and location. Online sessions start at $50, while offline sessions range from $75–$100. Contact us for detailed pricing.",
      },
      {
        question: "Can I cancel or reschedule my session?",
        answer:
          "Yes, you can cancel or reschedule up to 24 hours before your session without penalty. Please contact us as soon as possible if you need to make changes.",
      },
    ],
  },
  {
    title: "Privacy & Security",
    faqs: [
      {
        question: "Is my information kept confidential?",
        answer:
          "Absolutely. All sessions are conducted under strict confidentiality agreements. Your personal information and session details are protected and never shared without your explicit consent.",
      },
    ],
  },
  {
    title: "Session Types",
    faqs: [
      {
        question: "Do you offer both online and offline sessions?",
        answer:
          "Yes, we provide both online video sessions for convenience and in-person sessions at our designated locations for those who prefer face-to-face interaction.",
      },
      {
        question: "What qualifications do your psychologists have?",
        answer:
          "Our psychologists are licensed professionals with extensive experience in mental health support and psycho-education. They undergo regular training and follow strict ethical guidelines.",
      },
    ],
  },
];

const FAQItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-[var(--color-border)] py-6 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center gap-6"
        whileHover={{ x: 8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <h3 className={`font-body text-xl md:text-2xl font-bold transition-colors leading-snug ${
          isOpen ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-body)] group-hover:text-[var(--color-primary)]'
        }`}>
          {question}
        </h3>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          className="flex-shrink-0"
        >
          <ChevronDown className={`w-6 h-6 transition-colors ${
            isOpen ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-body)]'
          }`} />
        </motion.div>
      </motion.button>
      
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="pt-4 pl-4">
          <p className="font-body text-[var(--color-text-body)]/80 leading-relaxed text-base md:text-lg">
            {answer}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function HowItWorksFAQs() {
  const [activeSection, setActiveSection] = useState("Getting Started");

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[var(--color-bg-card)] via-[var(--color-bg-subtle)] to-[var(--color-bg-card)] relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          repeatType: 'reverse',
          ease: 'linear' 
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, var(--color-primary) 0%, transparent 50%), 
                           radial-gradient(circle at 80% 80%, var(--color-primary) 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, var(--color-primary) 0%, transparent 50%)`,
          backgroundSize: '100% 100%'
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-primary)]/20 rounded-full blur-3xl"
        animate={{ 
          y: [0, 30, 0],
          x: [0, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--color-primary)]/15 rounded-full blur-3xl"
        animate={{ 
          y: [0, -40, 0],
          x: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="mb-4"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="inline-block px-5 py-2 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-primary)]/10 rounded-full text-[var(--color-primary)] text-sm font-semibold tracking-wide border border-[var(--color-primary)]/20">
              FAQs
            </span>
          </motion.div>
          <h2 className="font-title text-5xl md:text-6xl text-[var(--color-text-body)] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-[var(--color-text-body)]/70 text-lg leading-relaxed">
            Find answers to common questions about our services
          </p>
        </motion.div>

        <div className="flex gap-12">
          {/* Left Sidebar Menu */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-2">
              {faqSections.map((section, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setActiveSection(section.title);
                    document.getElementById(section.title)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeSection === section.title
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
                      : 'text-[var(--color-text-body)]/70 hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-body)]'
                  }`}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {section.title}
                </motion.button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="flex-1 space-y-12">
            {faqSections.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                id={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                onViewportEnter={() => setActiveSection(section.title)}
              >
                <motion.h3 
                  className="font-title text-3xl md:text-4xl text-[var(--color-text-body)] mb-6 pb-3 border-b-2 border-[var(--color-primary)]/30"
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {section.title}
                </motion.h3>
                <div className="space-y-0">
                  {section.faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
