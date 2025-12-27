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

const FAQItem = ({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-[var(--color-border)]/30 last:border-b-0"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full py-6 px-3
          flex items-center justify-between
          text-left rounded-xl
          transition-colors duration-200
          hover:bg-[var(--color-primary)]/5
          group
        "
        aria-expanded={isOpen}
      >
        <h3
          className="
            font-title text-xl md:text-[21px]
            text-[var(--color-text-body)]
            leading-snug pr-6
            group-hover:text-[var(--color-primary)]
            transition-colors
          "
        >
          {question}
        </h3>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex-shrink-0"
        >
          <div
            className="
              w-9 h-9 rounded-full
              bg-[var(--color-primary)]/10
              flex items-center justify-center
              group-hover:bg-[var(--color-primary)]/20
              transition-colors
            "
          >
            <ChevronDown className="w-4.5 h-4.5 text-[var(--color-primary)]" />
          </div>
        </motion.div>
      </button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="relative px-3 pb-6">
          <div className="absolute left-4 top-0 w-[2px] h-full bg-gradient-to-b from-[var(--color-primary)] to-transparent opacity-30" />

          <p
            className="
              font-body
              text-[16px] md:text-[17px]
              leading-relaxed
              text-[var(--color-text-body)]/85
              pl-6
            "
          >
            {answer}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function HowItWorksFAQs() {
  return (
    <section className="py-20 px-6 bg-[var(--color-bg-card)]">
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
        >
          <h2 className="font-title text-4xl text-[var(--color-primary)] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-lg text-[var(--color-text-body)]/70 max-w-xl mx-auto">
            Everything you need to know before starting your journey with us
          </p>
        </motion.div>

        {/* FAQ Card */}
        <motion.div
          className="
            bg-white/90 backdrop-blur-sm
            rounded-3xl
            shadow-sm
            border border-[var(--color-border)]/20
            px-4 md:px-8 py-2
          "
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
