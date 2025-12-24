"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is the duration of a typical session?",
    answer: "Each session lasts approximately 60 minutes, providing ample time for meaningful discussion and structured guidance."
  },
  {
    question: "How much does a session cost?",
    answer: "Session pricing varies based on the type and location. Online sessions start at $50, while offline sessions range from $75-$100. Contact us for detailed pricing."
  },
  {
    question: "Is my information kept confidential?",
    answer: "Absolutely. All sessions are conducted under strict confidentiality agreements. Your personal information and session details are protected and never shared without your explicit consent."
  },
  {
    question: "How do I book a session?",
    answer: "You can book a session through our website by clicking 'Book a Session' or contacting our team directly. We'll guide you through the process and help you choose the best option for your needs."
  },
  {
    question: "What should I expect during my first session?",
    answer: "Your first session includes an initial assessment, goal setting, and building rapport with your psychologist. We'll discuss your concerns and create a personalized plan for your mental wellness journey."
  },
  {
    question: "Can I cancel or reschedule my session?",
    answer: "Yes, you can cancel or reschedule up to 24 hours before your session without penalty. Please contact us as soon as possible if you need to make changes."
  },
  {
    question: "Do you offer both online and offline sessions?",
    answer: "Yes, we provide both online video sessions for convenience and in-person sessions at our designated locations for those who prefer face-to-face interaction."
  },
  {
    question: "What qualifications do your psychologists have?",
    answer: "Our psychologists are licensed professionals with extensive experience in mental health support and psycho-education. They undergo regular training and follow ethical guidelines."
  }
];

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-[var(--color-border)]/50 last:border-b-0 group"
      initial={false}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 text-left flex justify-between items-center hover:bg-gradient-to-r hover:from-[var(--color-primary)]/5 hover:to-transparent transition-all duration-300 px-4 rounded-xl group-hover:shadow-sm"
      >
        <h3 className="font-title text-lg text-[var(--color-text-body)] pr-4 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <div className="w-8 h-8 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
            <ChevronDown className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
        </motion.div>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-6">
          <div className="w-1 h-full bg-gradient-to-b from-[var(--color-primary)] to-transparent absolute left-8 opacity-20"></div>
          <p className="font-body text-[var(--color-text-body)] opacity-80 leading-relaxed pl-6">
            {answer}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function HowItWorksFAQs() {
  return (
    <section className="py-20 px-6 bg-[var(--color-bg-card)] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-20 w-24 h-24 bg-[var(--color-primary)] rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-[var(--color-primary)] rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-[var(--color-primary)] rounded-full blur-xl"></div>
      </div>

      {/* Subtle geometric pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="faq-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="var(--color-primary)" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#faq-pattern)" />
        </svg>
      </div>

      <div className="mx-auto max-w-4xl relative z-10">
        <motion.h2
          className="font-title text-4xl text-center text-[var(--color-primary)] mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 md:p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Inner decorative elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-[var(--color-primary)]/15 to-transparent rounded-full"></div>

          <div className="space-y-0 relative z-10">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}