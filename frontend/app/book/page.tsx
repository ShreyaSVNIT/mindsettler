"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import MagneticButton from "@/components/Button";
import TitleHeader from "@/components/TitleHeader";
import { bookingAPI } from "@/lib/api";
import type { BookingDraftRequest } from "@/types";
import { trackBookingFormOpened, trackBookingSubmitted } from "@/lib/analytics";
import GlowCard from "@/components/GlowCard";
import AnimatedBadge from "@/components/AnimatedBadge";

/* ---------------- Zod Schema Following Backend Contract ---------------- */

const bookingSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  full_name: z.string().min(2, "Please enter your full name"),
  phone_number: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number"),
  city: z.string().min(1, "Please enter your city"),
  state: z.string().optional(),
  country: z.string().optional(),
  age: z.coerce.number().min(13, "You must be at least 13 years old to book a session"),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], {
    errorMap: () => ({ message: "Please select your gender" }),
  }),
  consent_given: z.boolean().refine((val) => val === true, {
    message: "Please accept all policies to continue",
  }),
  privacy_policy: z.boolean().refine((val) => val === true, {
    message: "Please accept the privacy policy",
  }),
  non_refund_policy: z.boolean().refine((val) => val === true, {
    message: "Please accept the non-refund policy",
  }),
  confidentiality_policy: z.boolean().refine((val) => val === true, {
    message: "Please accept the confidentiality policy",
  }),
  preferred_date: z.string().min(1, "Please select your preferred date"),
  preferred_period: z.enum(["MORNING", "EVENING", "CUSTOM"], {
    errorMap: () => ({ message: "Please select a time period" }),
  }),
  preferred_time_start: z.string().optional(),
  preferred_time_end: z.string().optional(),
  mode: z.enum(["ONLINE", "OFFLINE"], {
    errorMap: () => ({ message: "Please select a session mode" }),
  }),
  payment_mode: z.enum(["ONLINE", "OFFLINE"], {
    errorMap: () => ({ message: "Please select a payment mode" }),
  }),
  user_message: z.string().optional(),
}).refine(
  (data) => {
    if (data.preferred_period === "CUSTOM") {
      return data.preferred_time_start && data.preferred_time_end;
    }
    return true;
  },
  {
    message: "Please enter both start and end times for custom period",
    path: ["preferred_time_start"],
  }
);

type BookingFormData = z.infer<typeof bookingSchema>;

type BookingStatus = "idle" | "submitting" | "email_sent" | "existing_booking" | "error";

interface ExistingBooking {
  acknowledgement_id: string;
  status: string;
  preferred_date: string;
  preferred_period: string;
  mode: string;
}

/* ---------------- Page Component ---------------- */

export default function BookPage() {
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [existingBooking, setExistingBooking] = useState<ExistingBooking | null>(null);
  const [selectedMode, setSelectedMode] = useState<"ONLINE" | "OFFLINE" | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: "onSubmit",
    defaultValues: {
      preferred_period: "MORNING",
      mode: "ONLINE",
      payment_mode: "ONLINE",
      country: "India",
      consent_given: false,
      privacy_policy: false,
      non_refund_policy: false,
      confidentiality_policy: false,
    },
  });

  const preferredPeriod = watch("preferred_period");

  // Track analytics when form is opened
  useEffect(() => {
    if (selectedMode) {
      trackBookingFormOpened({ mode: selectedMode });
    }
  }, [selectedMode]);

  const onSubmit = async (data: BookingFormData) => {
    setBookingStatus("submitting");
    setErrorMessage("");

    try {
      // Prepare payload following backend contract
      const payload: BookingDraftRequest = {
        email: data.email,
        full_name: data.full_name,
        phone_number: data.phone_number,
        city: data.city,
        state: data.state || "NA",
        country: data.country || "India",
        age: data.age,
        gender: data.gender,
        emergency_contact: data.phone_number, // Use phone number as emergency contact fallback
        consent_given: data.consent_given,
        preferred_date: data.preferred_date,
        preferred_period: data.preferred_period,
        mode: data.mode,
        payment_mode: data.payment_mode,
      };

      // Add optional fields only if they exist
      if (data.user_message?.trim()) {
        payload.user_message = data.user_message;
      }

      // ONLY add time fields if CUSTOM period selected
      if (data.preferred_period === "CUSTOM") {
        payload.preferred_time_start = data.preferred_time_start;
        payload.preferred_time_end = data.preferred_time_end;
      }

      const result = await bookingAPI.createDraft(payload);

      // Track successful booking submission (privacy: no email/ID)
      trackBookingSubmitted({
        mode: data.mode,
        period: data.preferred_period,
      });

      // Backend may return existing booking details
      if (result.acknowledgement_id) {
        setExistingBooking(result as any);
        setBookingStatus("existing_booking");
      } else {
        // Verification email sent
        setBookingStatus("email_sent");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong. Please try again.");
      setBookingStatus("error");
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-purple-400/10 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>
      
      {/* Hero Section - Mode Selection */}
      {!selectedMode && bookingStatus === "idle" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-36 pb-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <TitleHeader
              subheader="BOOK A SESSION"
              title={
                <>
                  Let's begin your{" "}
                  <span className="text-[var(--color-primary)] italic">healing journey.</span>
                </>
              }
              description="Choose your session type to get started. It only takes a few minutes to share your details and move things forward."
              alignment="center"
            />

            {/* Session Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-2xl md:max-w-3xl mx-auto mb-12 mt-10">
              <GlowCard className="p-4 md:p-6 w-full flex flex-col min-h-[140px]" enableParticles={false} enableTilt={false} enableMagnetism={false}>
                <div className="font-body text-sm md:text-base text-[var(--color-text-body)] h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <AnimatedBadge className="flex-shrink-0 w-8 h-8 text-sm">1</AnimatedBadge>
                    <span className="font-title text-xl md:text-2xl font-bold text-[var(--color-primary)]">Session Duration</span>
                  </div>
                  <div className="text-sm md:text-base">60 minutes per session, includes a brief check-in.</div>
                </div>
              </GlowCard>
              <GlowCard className="p-4 md:p-6 w-full flex flex-col min-h-[140px] border-2 border-[var(--color-primary)]/20" enableParticles={false} enableTilt={false} enableMagnetism={false}>
                <div className="font-body text-sm md:text-base text-[var(--color-text-body)] h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <AnimatedBadge className="flex-shrink-0 w-8 h-8 text-sm">2</AnimatedBadge>
                    <span className="font-title text-xl md:text-2xl font-bold text-[var(--color-primary)]">First Session</span>
                  </div>
                  <div className="text-sm md:text-base">Introductory assessment & goal setting for new clients.</div>
                </div>
              </GlowCard>
              <GlowCard className="p-4 md:p-6 w-full flex flex-col min-h-[140px]" enableParticles={false} enableTilt={false} enableMagnetism={false}>
                <div className="font-body text-sm md:text-base text-[var(--color-text-body)] h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <AnimatedBadge className="flex-shrink-0 w-8 h-8 text-sm">3</AnimatedBadge>
                    <span className="font-title text-xl md:text-2xl font-bold text-[var(--color-primary)]">Location</span>
                  </div>
                  <div className="text-sm md:text-base">Online or in-studio; details shared after booking.</div>
                </div>
              </GlowCard>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div onClick={() => {
                setSelectedMode("ONLINE");
                setValue("mode", "ONLINE");
              }}>
                <MagneticButton text="Book a Session" />
              </div>
              <a href="/check-status" className="mt-4 sm:mt-0">
                <MagneticButton text="Check Status" />
              </a>
            </div>
          </motion.div>
        </div>
      )}

      {/* Email Verification Sent State */}
      {bookingStatus === "email_sent" && (
        <div className="min-h-screen flex items-center justify-center px-6 py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--color-bg-lavender)] border-2 border-[var(--color-primary)]/20 rounded-3xl p-10 text-center shadow-xl max-w-2xl"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-7xl mb-6"
            >
              📧
            </motion.div>
            <h2 className="font-title text-4xl text-[var(--color-primary)] mb-4">Check Your Email</h2>
            <p className="font-body text-lg text-[var(--color-text-body)] mb-4 max-w-md mx-auto">
              We've sent a verification link to your email address. Please click the link to verify your booking.
            </p>
            <div className="bg-[var(--color-primary)]/10 rounded-xl p-4 max-w-md mx-auto">
              <p className="font-body text-sm text-[var(--color-text-body)]">
                💡 Didn't receive it? Check your spam folder or wait a few minutes before trying again.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Existing Booking Found State */}
      {bookingStatus === "existing_booking" && existingBooking && (
        <div className="min-h-screen flex items-center justify-center px-6 py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-3xl p-10 shadow-xl max-w-2xl"
          >
            <div className="text-7xl mb-6 text-center">📋</div>
            <h2 className="font-title text-4xl text-blue-800 mb-6 text-center">Existing Booking Found</h2>
            <div className="bg-white/60 rounded-2xl p-6 space-y-3 font-body text-blue-700">
              <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                <span className="font-semibold">Acknowledgement ID:</span>
                <span className="font-mono">{existingBooking.acknowledgement_id}</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                <span className="font-semibold">Status:</span>
                <span className="uppercase bg-blue-200 px-3 py-1 rounded-full text-xs font-semibold">{existingBooking.status}</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                <span className="font-semibold">Date:</span>
                <span>{existingBooking.preferred_date}</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                <span className="font-semibold">Period:</span>
                <span>{existingBooking.preferred_period}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Mode:</span>
                <span>{existingBooking.mode}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Booking Form - Shows after mode selection */}
      {selectedMode && (bookingStatus === "idle" || bookingStatus === "submitting" || bookingStatus === "error") && (
        <div className="min-h-screen py-24 px-6">
          <div className="max-w-3xl mx-auto">
            {/* Back button and mode indicator */}
            <div className="mb-8 flex items-center justify-between">
              <button
                onClick={() => setSelectedMode(null)}
                className="text-[var(--color-text-body)]/60 hover:text-[var(--color-text-body)] font-body flex items-center gap-2 transition-colors"
              >
                ← Back to selection
              </button>
              <span className="font-body text-sm text-[var(--color-text-body)]/60">
                {selectedMode} Session
              </span>
            </div>

            {/* Error State */}
            {bookingStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 mb-6 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⚠️</span>
                  <p className="font-body text-red-700">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            {/* Booking Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--color-bg-lavender)] rounded-3xl shadow-2xl p-8 md:p-12 border border-[var(--color-primary)]/20"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Personal Information Section */}
                <div className="space-y-5">
                  <h3 className="font-body text-base font-bold text-[var(--color-text-body)] mb-3">
                    Personal Information
                  </h3>

                  {/* Full Name */}
                  <div>
                    <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                      Full Name <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("full_name")}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                      placeholder="Enter your full name"
                      disabled={bookingStatus === "submitting"}
                    />
                    {errors.full_name && (
                      <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.full_name.message}</p>
                    )}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                        Email Address <span className="text-[var(--color-primary)]">*</span>
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                        placeholder="mindsettler.dev@gmail.com"
                        disabled={bookingStatus === "submitting"}
                      />
                      {errors.email && (
                        <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                        Phone Number <span className="text-[var(--color-primary)]">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register("phone_number")}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                        placeholder="9876543210"
                        maxLength={10}
                        disabled={bookingStatus === "submitting"}
                      />
                      {errors.phone_number && (
                        <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.phone_number.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Age & Gender */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                        Age <span className="text-[var(--color-primary)]">*</span>
                      </label>
                      <input
                        type="number"
                        {...register("age")}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                        placeholder="Your age"
                        min={13}
                        max={120}
                        disabled={bookingStatus === "submitting"}
                      />
                      {errors.age && (
                        <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.age.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                        Gender <span className="text-[var(--color-primary)]">*</span>
                      </label>
                      <select
                        {...register("gender")}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                        disabled={bookingStatus === "submitting"}
                      >
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                      </select>
                      {errors.gender && (
                        <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.gender.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Location Fields */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                        City <span className="text-[var(--color-primary)]">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("city")}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                        placeholder="Your city"
                        disabled={bookingStatus === "submitting"}
                      />
                      {errors.city && (
                        <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        {...register("state")}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                        placeholder="Your state"
                        disabled={bookingStatus === "submitting"}
                      />
                      {errors.state && (
                        <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.state.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        {...register("country")}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                        placeholder="Your country"
                        disabled={bookingStatus === "submitting"}
                      />
                      {errors.country && (
                        <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.country.message}</p>
                      )}
                    </div>
                  </div>
                </div>

              {/* Preferred Date */}
              <div className="relative">
                <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                  Preferred Date <span className="text-[var(--color-primary)]">*</span>
                </label>
                
                <div className="relative group">
                  <input
                    type="date"
                    {...register("preferred_date")}
                    min={minDate}
                    placeholder="MM/DD/YYYY"
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    disabled={bookingStatus === "submitting"}
                    style={{
                      colorScheme: 'light',
                    }}
                  />

                  {/* Custom Calendar Icon */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-body)]/60">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>

                {errors.preferred_date && (
                  <p className="text-[var(--color-primary)] text-sm mt-1 font-body">
                    {errors.preferred_date.message}
                  </p>
                )}
              </div>

              {/* Preferred Period */}
              <div>
                <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                  Preferred Time Period <span className="text-[var(--color-primary)]">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["MORNING", "EVENING", "CUSTOM"] as const).map((period) => (
                    <label
                      key={period}
                      className={`flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all font-body text-sm font-semibold ${
                        watch("preferred_period") === period
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        {...register("preferred_period")}
                        value={period}
                        className="sr-only"
                        disabled={bookingStatus === "submitting"}
                      />
                      {period}
                    </label>
                  ))}
                </div>
                {errors.preferred_period && (
                  <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.preferred_period.message}</p>
                )}
              </div>

              {/* Custom Time Range - ONLY show if CUSTOM selected */}
              {preferredPeriod === "CUSTOM" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid md:grid-cols-2 gap-4 bg-[var(--color-primary)]/5 p-5 rounded-2xl border border-[var(--color-primary)]/10"
                >
                  <div>
                    <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                      Start Time <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <input
                      type="time"
                      {...register("preferred_time_start")}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                      disabled={bookingStatus === "submitting"}
                    />
                    {errors.preferred_time_start && (
                      <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.preferred_time_start.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                      End Time <span className="text-[var(--color-primary)]">*</span>
                    </label>
                    <input
                      type="time"
                      {...register("preferred_time_end")}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal bg-white"
                      disabled={bookingStatus === "submitting"}
                    />
                    {errors.preferred_time_end && (
                      <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.preferred_time_end.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Session Mode */}
              <div>
                <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                  Session Mode <span className="text-[var(--color-primary)]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["ONLINE", "OFFLINE"] as const).map((mode) => (
                    <label
                      key={mode}
                      className={`flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all font-body text-sm font-semibold ${
                        watch("mode") === mode
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        {...register("mode")}
                        value={mode}
                        className="sr-only"
                        disabled={bookingStatus === "submitting"}
                      />
                      {mode}
                    </label>
                  ))}
                </div>
                {errors.mode && (
                  <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.mode.message}</p>
                )}
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                  Payment Mode <span className="text-[var(--color-primary)]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["ONLINE", "OFFLINE"] as const).map((mode) => (
                    <label
                      key={mode}
                      className={`flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all font-body text-sm font-semibold ${
                        watch("payment_mode") === mode
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        {...register("payment_mode")}
                        value={mode}
                        className="sr-only"
                        disabled={bookingStatus === "submitting"}
                      />
                      {mode}
                    </label>
                  ))}
                </div>
                {errors.payment_mode && (
                  <p className="text-[var(--color-primary)] text-sm mt-1 font-body">
                    {errors.payment_mode.message}
                  </p>
                )}
              </div>

              {/* Optional Message */}
              <div>
                <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                  Message (Optional)
                </label>
                <textarea
                  {...register("user_message")}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body font-normal resize-none bg-white"
                  placeholder="Any additional information or questions..."
                  disabled={bookingStatus === "submitting"}
                />
              </div>

              {/* Policy Consent Checkboxes */}
              <div className="bg-[var(--color-primary)]/5 p-5 rounded-2xl border border-[var(--color-primary)]/10 space-y-4">
                <p className="font-body text-sm font-semibold text-[var(--color-text-body)] mb-3">
                  Please review and accept all policies <span className="text-[var(--color-primary)]">*</span>
                </p>
                
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("privacy_policy")}
                    className="mt-1 w-5 h-5 rounded border-2 border-[var(--color-primary)]/40 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    disabled={bookingStatus === "submitting"}
                  />
                  <span className="font-body text-sm text-[var(--color-text-body)]/90">
                    I have read and agree to the{" "}
                    <a href="/privacy-policy" target="_blank" className="text-[var(--color-primary)] underline font-semibold hover:text-[var(--color-primary)]/80">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.privacy_policy && (
                  <p className="text-[var(--color-primary)] text-xs mt-1 font-body ml-8">{errors.privacy_policy.message}</p>
                )}

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("non_refund_policy")}
                    className="mt-1 w-5 h-5 rounded border-2 border-[var(--color-primary)]/40 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    disabled={bookingStatus === "submitting"}
                  />
                  <span className="font-body text-sm text-[var(--color-text-body)]/90">
                    I have read and agree to the{" "}
                    <a href="/non-refund-policy" target="_blank" className="text-[var(--color-primary)] underline font-semibold hover:text-[var(--color-primary)]/80">
                      Non-Refund Policy
                    </a>
                  </span>
                </label>
                {errors.non_refund_policy && (
                  <p className="text-[var(--color-primary)] text-xs mt-1 font-body ml-8">{errors.non_refund_policy.message}</p>
                )}

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("confidentiality_policy")}
                    className="mt-1 w-5 h-5 rounded border-2 border-[var(--color-primary)]/40 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    disabled={bookingStatus === "submitting"}
                  />
                  <span className="font-body text-sm text-[var(--color-text-body)]/90">
                    I have read and agree to the{" "}
                    <a href="/confidentiality-policy" target="_blank" className="text-[var(--color-primary)] underline font-semibold hover:text-[var(--color-primary)]/80">
                      Confidentiality Policy
                    </a>
                  </span>
                </label>
                {errors.confidentiality_policy && (
                  <p className="text-[var(--color-primary)] text-xs mt-1 font-body ml-8">{errors.confidentiality_policy.message}</p>
                )}

                <label className="flex items-start gap-3 cursor-pointer group pt-3 border-t border-[var(--color-primary)]/20">
                  <input
                    type="checkbox"
                    {...register("consent_given")}
                    onChange={(e) => {
                      setValue("consent_given", e.target.checked);
                      if (e.target.checked) {
                        setValue("privacy_policy", true);
                        setValue("non_refund_policy", true);
                        setValue("confidentiality_policy", true);
                      }
                    }}
                    className="mt-1 w-5 h-5 rounded border-2 border-[var(--color-primary)]/40 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    disabled={bookingStatus === "submitting"}
                  />
                  <span className="font-body text-sm text-[var(--color-text-body)]/90">
                    I confirm that I have read and accepted all the above policies and consent to booking a session
                  </span>
                </label>
                {errors.consent_given && (
                  <p className="text-[var(--color-primary)] text-xs mt-1 font-body ml-8">{errors.consent_given.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-center">
                {bookingStatus === "submitting" ? (
                  <button
                    disabled
                    className="bg-[var(--color-primary)]/50 text-white font-body font-semibold px-12 py-4 rounded-full transition-all cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </button>
                ) : (
                  <MagneticButton text="Book Session" type="submit" />
                )}
              </div>
            </form>
          </motion.div>

          {/* Info Box - What Happens Next */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary)]/10 rounded-2xl p-8 border border-[var(--color-primary)]/20"
          >
            <h3 className="font-title text-2xl text-[var(--color-text-body)] mb-4 flex items-center gap-3">
              <span className="text-3xl">📋</span>
              What happens next?
            </h3>
            <ol className="font-body text-sm text-[var(--color-text-body)]/80 space-y-3 list-none">
              <li className="flex items-start gap-3">
                <AnimatedBadge className="flex-shrink-0 w-6 h-6 text-xs">1</AnimatedBadge>
                <span>You'll receive a <strong>verification email</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <AnimatedBadge className="flex-shrink-0 w-6 h-6 text-xs">2</AnimatedBadge>
                <span>Click the link to <strong>verify your booking</strong> (moves to PENDING)</span>
              </li>
              <li className="flex items-start gap-3">
                <AnimatedBadge className="flex-shrink-0 w-6 h-6 text-xs">3</AnimatedBadge>
                <span>Our admin will <strong>review and approve</strong> your booking (moves to APPROVED)</span>
              </li>
              <li className="flex items-start gap-3">
                <AnimatedBadge className="flex-shrink-0 w-6 h-6 text-xs">4</AnimatedBadge>
                <span>You'll be notified and need to <strong>complete payment</strong> (moves to PAYMENT_PENDING → CONFIRMED)</span>
              </li>
              <li className="flex items-start gap-3">
                <AnimatedBadge className="flex-shrink-0 w-6 h-6 text-xs">5</AnimatedBadge>
                <span>Session confirmed! <strong className="text-[var(--color-primary)]">🎉</strong></span>
              </li>
            </ol>
          </motion.div>
          </div>
        </div>
      )}
    </main>
  );
}