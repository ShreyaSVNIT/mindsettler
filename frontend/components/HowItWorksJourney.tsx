
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle,
  Users,
  MessageSquare,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ---------------- DATA ---------------- */

const steps = [
  {
    title: "Book Your Session",
    description: "Choose a time that feels right for you. This first step is about choosing yourself.",
    icon: Calendar,
  },
  {
    title: "Receive Confirmation",
    description: "Clear details help you feel prepared and reduce uncertainty. We'll send you everything you need.",
    icon: CheckCircle,
  },
  {
    title: "Prepare & Connect",
    description: "Review the shared resources and get ready to open up in a comfortable space of your choice.",
    icon: Users,
  },
  {
    title: "Engage in Your Session",
    description: "Work with your therapist in a safe, confidential, and supportive environment designed for healing.",
    icon: MessageSquare,
  },
  {
    title: "Post-Session Support",
    description: "Continue your journey with personalized follow-ups, resources, and ongoing guidance.",
    icon: Star,
  },
];

/* ---------------- COMPONENT ---------------- */

export default function HowItWorksJourney() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const totalSteps = steps.length;

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigate = (direction: number) => {
    if (direction === 1 && currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else if (direction === -1 && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <section
      className="py-20 lg:py-32 relative"
      style={{ backgroundColor: "var(--color-bg-app)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ---------- HEADER ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-block mb-4">
            <div 
              className="w-16 h-1 mx-auto rounded-full"
              style={{ backgroundColor: "var(--color-primary)" }}
            />
          </div>
          <h2 
            className="font-title text-3xl sm:text-4xl lg:text-5xl mb-4 lg:mb-6"
            style={{ color: "var(--color-primary)" }}
          >
            How It Works
          </h2>
          <p 
            className="font-body text-lg lg:text-xl max-w-2xl mx-auto px-4"
            style={{ color: "var(--color-text-body)", opacity: 0.8 }}
          >
            A clear, step-by-step process designed with care and understanding.
          </p>
        </motion.div>

        {/* ---------- PROGRESS INDICATOR (Mobile) ---------- */}
        {isMobile && (
          <div className="mb-12 px-4">
            <div className="flex justify-between items-center mb-6">
              <span 
                className="font-body text-sm"
                style={{ color: "var(--color-text-body)", opacity: 0.7 }}
              >
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span 
                className="font-title text-lg"
                style={{ color: "var(--color-primary)" }}
              >
                {steps[currentStep].title}
              </span>
            </div>
            <div className="relative h-1 w-full rounded-full overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{ backgroundColor: "var(--color-border)" }}
              />
              <motion.div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{ backgroundColor: "var(--color-primary)" }}
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}

        {/* ---------- MAIN CONTENT ---------- */}
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          {/* ---------- DESKTOP STEP INDICATORS ---------- */}
          {!isMobile && (
            <div className="lg:w-2/5">
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`flex items-start gap-4 w-full p-5 rounded-xl transition-all duration-300 ${
                      index === currentStep ? "border-l-4" : "opacity-70 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: index === currentStep 
                        ? "var(--color-bg-card)" 
                        : "transparent",
                      borderLeftColor: index === currentStep ? "var(--color-primary)" : "transparent",
                      border: "1px solid var(--color-border)",
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        index === currentStep ? "scale-110 shadow-sm" : ""
                      }`}
                      style={{
                        backgroundColor: index <= currentStep 
                          ? "var(--color-primary)" 
                          : "var(--color-bg-card)",
                        color: index <= currentStep 
                          ? "white" 
                          : "var(--color-text-body)",
                      }}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span 
                          className="font-body text-sm font-medium"
                          style={{ 
                            color: index === currentStep 
                              ? "var(--color-primary)" 
                              : "var(--color-text-body)",
                            opacity: index === currentStep ? 1 : 0.8 
                          }}
                        >
                          Step {String(index + 1).padStart(2, "0")}
                        </span>
                        {index === currentStep && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: "var(--color-primary)" }}
                          />
                        )}
                      </div>
                      <h3 
                        className="font-title text-lg lg:text-xl"
                        style={{ 
                          color: index === currentStep 
                            ? "var(--color-text-body)" 
                            : "var(--color-text-body)",
                          opacity: index === currentStep ? 1 : 0.9 
                        }}
                      >
                        {step.title}
                      </h3>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* ---------- MAIN CARD ---------- */}
          <div className={`${isMobile ? 'w-full' : 'lg:w-3/5'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <div 
                  className="rounded-2xl p-6 sm:p-8 lg:p-12 shadow-sm"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                    minHeight: isMobile ? "auto" : "500px",
                  }}
                >
                  {/* Step Number and Title */}
                  <div className="mb-8 lg:mb-12">
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: "var(--color-primary)",
                          color: "white",
                        }}
                      >
                        <span className="font-title text-lg">
                          {String(currentStep + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div>
                        <span 
                          className="font-body text-sm font-medium tracking-wide block"
                          style={{ color: "var(--color-text-body)", opacity: 0.7 }}
                        >
                          STEP {String(currentStep + 1).padStart(2, "0")} OF {String(totalSteps).padStart(2, "0")}
                        </span>
                        <h3 
                          className="font-title text-2xl lg:text-3xl mt-1"
                          style={{ color: "var(--color-text-body)" }}
                        >
                          {steps[currentStep].title}
                        </h3>
                      </div>
                    </div>

                    {/* Icon Display */}
                    <motion.div
                      className="flex justify-center my-8 lg:my-12"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div 
                        className="w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: "var(--color-bg-app)",
                          color: "var(--color-primary)",
                        }}
                      >
                        <CurrentIcon className="w-10 h-10 lg:w-12 lg:h-12" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Description */}
                  <div className="mb-10 lg:mb-12">
                    <p 
                      className="font-body text-lg lg:text-xl leading-relaxed text-center lg:text-left"
                      style={{ color: "var(--color-text-body)", opacity: 0.9 }}
                    >
                      {steps[currentStep].description}
                    </p>
                  </div>

                  {/* Progress Dots */}
                  <div className="flex justify-center gap-3 mb-10">
                    {steps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className="focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
                        style={{ 
                          outlineColor: "var(--color-primary)",
                          outlineOffset: "2px"
                        }}
                        aria-label={`Go to step ${index + 1}`}
                      >
                        <motion.div
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            index === currentStep ? "" : "hover:scale-125"
                          }`}
                          style={{
                            backgroundColor: index === currentStep
                              ? "var(--color-primary)"
                              : index < currentStep
                              ? "var(--color-primary)"
                              : "var(--color-border)",
                            opacity: index === currentStep ? 1 : index < currentStep ? 0.6 : 0.4
                          }}
                          whileHover={{ scale: 1.3 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between">
                    <motion.button
                      onClick={() => navigate(-1)}
                      disabled={currentStep === 0}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        currentStep === 0
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:scale-105 active:scale-95"
                      }`}
                      style={{
                        backgroundColor: "var(--color-bg-subtle)",
                        color: "var(--color-text-body)",
                        border: "1px solid var(--color-border)",
                      }}
                      whileHover={currentStep > 0 ? { x: -2 } : {}}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="text-sm lg:text-base">Previous</span>
                    </motion.button>

                    {/* Mobile Step Indicator */}
                    {isMobile && (
                      <div className="text-center">
                        <span 
                          className="font-body text-sm font-medium"
                          style={{ color: "var(--color-text-body)", opacity: 0.7 }}
                        >
                          {currentStep + 1}/{totalSteps}
                        </span>
                      </div>
                    )}

                    <motion.button
                      onClick={() => navigate(1)}
                      disabled={currentStep === totalSteps - 1}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        currentStep === totalSteps - 1
                          ? "opacity-70 cursor-default"
                          : "hover:scale-105 active:scale-95"
                      }`}
                      style={{
                        backgroundColor: currentStep === totalSteps - 1 
                          ? "var(--color-bg-subtle)" 
                          : "var(--color-primary)",
                        color: currentStep === totalSteps - 1 
                          ? "var(--color-text-body)" 
                          : "white",
                        border: currentStep === totalSteps - 1 
                          ? "1px solid var(--color-border)" 
                          : "none",
                      }}
                      whileHover={currentStep < totalSteps - 1 ? { x: 2 } : {}}
                    >
                      <span className="text-sm lg:text-base">
                        {currentStep === totalSteps - 1 ? "Complete" : "Next"}
                      </span>
                      {currentStep < totalSteps - 1 && <ChevronRight className="w-4 h-4" />}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ---------- FOOTER NOTE ---------- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 lg:mt-24 pt-8"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p 
            className="font-body text-base lg:text-lg max-w-2xl mx-auto px-4"
            style={{ color: "var(--color-text-body)", opacity: 0.7 }}
          >
            Take it one step at a time. We're here to support you throughout your journey.
          </p>
        </motion.div>
      </div>
    </section>
  );
}