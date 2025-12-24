"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle, Users, MessageSquare, Star } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Book Your Session",
    description: "Choose your preferred date, time, and session type. Our easy booking system allows you to select from online or offline options that fit your schedule.",
    icon: Calendar
  },
  {
    step: "02",
    title: "Receive Confirmation",
    description: "Get instant confirmation with all session details, preparation materials, and a unique session link or location information.",
    icon: CheckCircle
  },
  {
    step: "03",
    title: "Prepare & Connect",
    description: "Review the provided resources and join your session at the scheduled time. Our psychologists ensure a comfortable, judgment-free environment.",
    icon: Users
  },
  {
    step: "04",
    title: "Engage in Your Session",
    description: "Participate in structured psycho-education and support sessions designed to help you understand yourself better and develop coping strategies.",
    icon: MessageSquare
  },
  {
    step: "05",
    title: "Post-Session Support",
    description: "Receive follow-up materials, resources, and the option to schedule additional sessions. Your journey continues with ongoing support.",
    icon: Star
  }
];

interface StepProps {
  step: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  reverse?: boolean;
}

const StepSection: React.FC<StepProps> = ({
  step,
  title,
  description,
  icon: Icon,
  reverse
}) => {
  return (
    <motion.div
      className={`flex items-center ${
        reverse ? "justify-end" : "justify-start"
      } mb-16`}
      initial={{ opacity: 0, x: reverse ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div
        className={`max-w-lg ${
          reverse ? "text-right" : "text-left"
        }`}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="font-body text-sm tracking-[0.45em] opacity-60">
            STEP {step}
          </span>
        </div>
        <h3 className="font-title text-3xl text-[var(--color-primary)] mb-4">
          {title}
        </h3>
        <p className="font-body text-[var(--color-text-body)] opacity-80 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default function HowItWorksJourney() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-primary)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--color-primary)] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[var(--color-primary)] rounded-full blur-3xl"></div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="journey-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="var(--color-primary)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#journey-pattern)" />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl relative z-10">
        <motion.h2
          className="font-title text-4xl text-center text-[var(--color-primary)] mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Your Complete Journey
        </motion.h2>

        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)] to-transparent opacity-30 h-full hidden md:block"></div>

        <div className="space-y-8 relative">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[var(--color-primary)] rounded-full hidden md:block" style={{ top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="absolute inset-0 bg-[var(--color-primary)] rounded-full animate-ping opacity-20"></div>
              </div>

              <StepSection
                step={step.step}
                title={step.title}
                description={step.description}
                icon={step.icon}
                reverse={index % 2 !== 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}