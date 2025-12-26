// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import { useState } from "react";
// import * as React from "react";
// import {
//   Calendar,
//   CheckCircle,
//   Users,
//   MessageSquare,
//   Star,
//   ArrowRight,
//   Route,
// } from "lucide-react";

// const steps = [
//   {
//     step: "01",
//     title: "Book Your Session",
//     description:
//       "Choose your preferred date, time, and session type. Our easy booking system allows you to select from online or offline options that fit your schedule.",
//     icon: Calendar,
//   },
//   {
//     step: "02",
//     title: "Receive Confirmation",
//     description:
//       "Get instant confirmation with all session details, preparation materials, and a unique session link or location information.",
//     icon: CheckCircle,
//   },
//   {
//     step: "03",
//     title: "Prepare & Connect",
//     description:
//       "Review the provided resources and join your session at the scheduled time. Our psychologists ensure a comfortable, judgment-free environment.",
//     icon: Users,
//   },
//   {
//     step: "04",
//     title: "Engage in Your Session",
//     description:
//       "Participate in structured psycho-education and support sessions designed to help you understand yourself better and develop coping strategies.",
//     icon: MessageSquare,
//   },
//   {
//     step: "05",
//     title: "Post-Session Support",
//     description:
//       "Receive follow-up materials, resources, and the option to schedule additional sessions. Your journey continues with ongoing support.",
//     icon: Star,
//   },
// ];

// export default function HowItWorksJourney() {
//   const [active, setActive] = useState(0);

//   return (
//     <section className="relative py-24 overflow-hidden bg-rose-50">
//       {/* Subtle background pattern */}
//       <div className="absolute inset-0 opacity-5">
//         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//           <defs>
//             <pattern id="journey-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
//               <circle cx="30" cy="30" r="2" fill="var(--color-primary)" />
//             </pattern>
//           </defs>
//           <rect width="100%" height="100%" fill="url(#journey-pattern)" />
//         </svg>
//       </div>

//       <div className="relative max-w-7xl mx-auto px-6">
//         {/* Journey Header */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center gap-3 mb-4">
//             <Route className="w-8 h-8 text-[var(--color-primary)]" />
//             <h2 className="font-title text-3xl md:text-4xl text-[var(--color-primary)]">
//               Your Mental Health Journey
//             </h2>
//           </div>
//           <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
//             A seamless path from booking to ongoing support
//           </p>
//         </div>

//         {/* TIMELINE */}
//         <div className="relative">
//           {/* Desktop Horizontal Timeline */}
//           <div className="hidden md:flex items-center justify-between">
//             {steps.map((step, i) => (
//               <div key={step.step} className="flex items-center">
//                 <motion.div
//                   className="flex flex-col items-center text-center max-w-xs group cursor-pointer"
//                   onMouseEnter={() => setActive(i)}
//                   whileHover={{ y: -10 }}
//                   transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                 >
//                   {/* Step Card */}
//                   <motion.div
//                     className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-300 shadow-lg border-2
//                       ${active === i
//                         ? "bg-[var(--color-primary)] text-white shadow-xl border-[var(--color-primary)]"
//                         : "bg-white text-[var(--color-primary)] border-gray-200 group-hover:border-[var(--color-primary)]/50"
//                       }`}
//                     whileHover={{ scale: 1.1, rotate: 5 }}
//                     transition={{ type: "spring", stiffness: 400 }}
//                   >
//                     <step.icon className="w-8 h-8 md:w-10 md:h-10" />
//                   </motion.div>

//                   <motion.span
//                     className={`font-body text-sm tracking-wide font-semibold mb-2 transition-colors duration-300
//                       ${active === i ? 'text-[var(--color-primary)]' : 'text-gray-500 group-hover:text-[var(--color-primary)]'}`}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: i * 0.1 }}
//                   >
//                     STEP {step.step}
//                   </motion.span>

//                   <motion.h3
//                     className="font-title text-lg md:text-xl text-[var(--color-primary)] mb-2 transition-all duration-300 group-hover:text-[var(--color-primary)]"
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: i * 0.1 + 0.1 }}
//                   >
//                     {step.title}
//                   </motion.h3>

//                   {/* Description on hover */}
//                   <AnimatePresence>
//                     {active === i && (
//                       <motion.p
//                         className="font-body text-sm text-gray-600 leading-relaxed"
//                         initial={{ opacity: 0, height: 0, y: -10 }}
//                         animate={{ opacity: 1, height: "auto", y: 0 }}
//                         exit={{ opacity: 0, height: 0, y: -10 }}
//                         transition={{ duration: 0.3, ease: "easeInOut" }}
//                       >
//                         {step.description}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </motion.div>

//                 {/* Arrow between steps */}
//                 {i < steps.length - 1 && (
//                   <motion.div
//                     className="mx-4 md:mx-8 text-[var(--color-primary)] opacity-60"
//                     whileHover={{ scale: 1.2, x: 5 }}
//                     transition={{ type: "spring", stiffness: 400 }}
//                   >
//                     <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
//                   </motion.div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Mobile Vertical Timeline */}
//           <div className="md:hidden space-y-8">
//             {steps.map((step, i) => (
//               <motion.div
//                 key={step.step}
//                 className="flex items-start space-x-4 group cursor-pointer"
//                 onClick={() => setActive(i)}
//                 whileTap={{ scale: 0.95 }}
//                 initial={{ opacity: 0, x: -50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: i * 0.2 }}
//               >
//                 {/* Step Number/Icon */}
//                 <motion.div
//                   className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border-2
//                     ${active === i
//                       ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
//                       : "bg-white text-[var(--color-primary)] border-gray-200 group-hover:border-[var(--color-primary)]/50"
//                     }`}
//                   whileHover={{ scale: 1.1, rotate: 5 }}
//                   transition={{ type: "spring", stiffness: 400 }}
//                 >
//                   <step.icon className="w-5 h-5" />
//                 </motion.div>

//                 {/* Content */}
//                 <div className="flex-1">
//                   <motion.span
//                     className={`font-body text-xs tracking-wide font-semibold mb-1 block transition-colors duration-300
//                       ${active === i ? 'text-[var(--color-primary)]' : 'text-gray-500 group-hover:text-[var(--color-primary)]'}`}
//                   >
//                     STEP {step.step}
//                   </motion.span>
//                   <motion.h3
//                     className="font-title text-lg text-[var(--color-primary)] mb-2 transition-all duration-300 group-hover:text-[var(--color-primary)]"
//                   >
//                     {step.title}
//                   </motion.h3>
//                   {/* Description on active */}
//                   <AnimatePresence>
//                     {active === i && (
//                       <motion.p
//                         className="font-body text-sm text-gray-600 leading-relaxed"
//                         initial={{ opacity: 0, height: 0, y: -10 }}
//                         animate={{ opacity: 1, height: "auto", y: 0 }}
//                         exit={{ opacity: 0, height: 0, y: -10 }}
//                         transition={{ duration: 0.3, ease: "easeInOut" }}
//                       >
//                         {step.description}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Users,
  MessageSquare,
  Star,
  Route,
} from "lucide-react";

/* -------------------- DATA -------------------- */

const steps = [
  {
    step: "01",
    title: "Book Your Session",
    description:
      "Choose your preferred date, time, and session type. Our easy booking system allows you to select from online or offline options that fit your schedule.",
    icon: Calendar,
  },
  {
    step: "02",
    title: "Receive Confirmation",
    description:
      "Get instant confirmation with all session details, preparation materials, and a unique session link or location information.",
    icon: CheckCircle,
  },
  {
    step: "03",
    title: "Prepare & Connect",
    description:
      "Review the provided resources and join your session at the scheduled time. Our psychologists ensure a comfortable, judgment-free environment.",
    icon: Users,
  },
  {
    step: "04",
    title: "Engage in Your Session",
    description:
      "Participate in structured psycho-education and support sessions designed to help you understand yourself better and develop coping strategies.",
    icon: MessageSquare,
  },
  {
    step: "05",
    title: "Post-Session Support",
    description:
      "Receive follow-up materials, resources, and the option to schedule additional sessions. Your journey continues with ongoing support.",
    icon: Star,
  },
];

/* -------------------- MOTION -------------------- */

const smoothSpring = {
  type: "spring",
  stiffness: 120,
  damping: 20,
};

/* -------------------- COMPONENT -------------------- */

export default function HowItWorksJourney() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Close expanded step on outside click */
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveStep(null);
      }
    };

    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  return (
    <section
      className="relative py-28"
      style={{ backgroundColor: "var(--color-bg-app)" }}
    >
      <div ref={containerRef} className="max-w-7xl mx-auto px-6">
        {/* ---------------- HEADER ---------------- */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 mb-4">
            <Route className="w-8 h-8 text-[var(--color-primary)]" />
            <h2 className="font-title text-3xl md:text-4xl text-[var(--color-primary)]">
              Your Mental Health Journey
            </h2>
          </div>
          <p className="font-body text-lg text-[var(--color-text-body)] opacity-80 max-w-2xl mx-auto">
            A seamless path from booking to ongoing support
          </p>
        </div>

        {/* ---------------- DESKTOP & TABLET (STABLE HEIGHT) ---------------- */}
        <div className="hidden md:grid grid-cols-5 gap-x-4 lg:gap-x-8 items-start">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              className="flex flex-col items-center text-center cursor-pointer"
              onMouseEnter={() => setActiveStep(index)}
              transition={smoothSpring}
            >
              {/* Icon */}
              <motion.div
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mb-3 border"
                style={{
                  backgroundColor:
                    activeStep === index
                      ? "var(--color-primary)"
                      : "var(--color-bg-card)",
                  color:
                    activeStep === index
                      ? "var(--color-bg-card)"
                      : "var(--color-primary)",
                  borderColor: "var(--color-border)",
                }}
                whileHover={{ scale: 1.05 }}
                transition={smoothSpring}
              >
                <step.icon className="w-8 h-8 lg:w-10 lg:h-10" />
              </motion.div>

              <span className="font-body text-xs tracking-wide text-[var(--color-text-body)] opacity-60 mb-1">
                STEP {step.step}
              </span>

              <h3 className="font-title text-base lg:text-lg text-[var(--color-primary)] mb-2">
                {step.title}
              </h3>

              {/* RESERVED SPACE — prevents layout shift */}
              <div className="relative w-full h-[140px]">
                <AnimatePresence>
                  {activeStep === index && (
                    <motion.p
                      className="absolute inset-0 font-body text-xs lg:text-sm leading-relaxed text-[var(--color-text-body)] opacity-80"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {step.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ---------------- MOBILE ---------------- */}
        <div className="md:hidden space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              className="flex items-start gap-4 cursor-pointer"
              onClick={() =>
                setActiveStep(activeStep === index ? null : index)
              }
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center border"
                style={{
                  backgroundColor:
                    activeStep === index
                      ? "var(--color-primary)"
                      : "var(--color-bg-card)",
                  color:
                    activeStep === index
                      ? "var(--color-bg-card)"
                      : "var(--color-primary)",
                  borderColor: "var(--color-border)",
                }}
              >
                <step.icon className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <h3 className="font-title text-lg text-[var(--color-primary)]">
                  {step.title}
                </h3>

                <AnimatePresence>
                  {activeStep === index && (
                    <motion.p
                      className="font-body text-sm mt-1 text-[var(--color-text-body)] opacity-80"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.25 }}
                    >
                      {step.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
