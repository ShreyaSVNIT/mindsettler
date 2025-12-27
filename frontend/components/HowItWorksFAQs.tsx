"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is the duration of a typical session?",
    answer:
      "Each session lasts approximately 60 minutes, providing ample time for meaningful discussion and structured guidance.",
  },
  {
    question: "How much does a session cost?",
    answer:
      "Session pricing varies based on the type and location. Online sessions start at $50, while offline sessions range from $75–$100. Contact us for detailed pricing.",
  },
  {
    question: "Is my information kept confidential?",
    answer:
      "Absolutely. All sessions are conducted under strict confidentiality agreements. Your personal information and session details are protected and never shared without your explicit consent.",
  },
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
    question: "Can I cancel or reschedule my session?",
    answer:
      "Yes, you can cancel or reschedule up to 24 hours before your session without penalty. Please contact us as soon as possible if you need to make changes.",
  },
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
];

const FAQItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="mb-4 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <motion.div
        className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
          isOpen 
            ? 'bg-gradient-to-br from-[var(--color-primary)]/10 via-white to-[var(--color-primary)]/5 shadow-lg' 
            : 'bg-white/60 shadow-md hover:shadow-lg'
        }`}
        whileHover={{ scale: 1.01 }}
      >
        {isOpen && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 via-transparent to-[var(--color-primary)]/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-5 px-6 text-left flex justify-between items-center relative z-10"
        >
          <div className="flex items-start gap-4 flex-1">
            <motion.div
              className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                isOpen 
                  ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] shadow-lg' 
                  : 'bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20'
              }`}
              whileHover={{ rotate: 5 }}
            >
              <span className={`text-sm font-bold transition-colors ${
                isOpen ? 'text-white' : 'text-[var(--color-primary)]'
              }`}>
                {index + 1}
              </span>
            </motion.div>
            
            <h3 className={`font-body text-base md:text-lg font-semibold pr-4 transition-colors leading-snug ${
              isOpen ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-body)] group-hover:text-[var(--color-primary)]'
            }`}>
              {question}
            </h3>
          </div>
          
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="flex-shrink-0"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isOpen 
                ? 'bg-white shadow-md' 
                : 'bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20'
            }`}>
              <ChevronDown className={`w-5 h-5 transition-colors ${
                isOpen ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-body)]'
              }`} />
            </div>
          </motion.div>
        </button>
        
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden relative z-10"
        >
          <div className="px-6 pb-6 pl-20">
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[var(--color-primary)] to-transparent rounded-full opacity-30"></div>
              <p className="font-body text-[var(--color-text-body)]/90 leading-relaxed pl-4 text-[15px]">
                {answer}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default function HowItWorksFAQs() {
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

      <div className="mx-auto max-w-4xl relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <span className="inline-block px-5 py-2 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-primary)]/10 rounded-full text-[var(--color-primary)] text-sm font-semibold tracking-wide border border-[var(--color-primary)]/20">
              Got Questions?
            </span>
          </motion.div>
          <h2 className="font-title text-4xl md:text-5xl bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-text-body)] to-[var(--color-primary)] bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-[var(--color-text-body)]/70 mt-4 text-lg">
            Find answers to common questions about our services
          </p>
        </motion.div>

        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
