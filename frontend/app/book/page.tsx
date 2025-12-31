"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import MagneticButton from "@/components/Button";
import { BACKEND_URL } from "@/lib/api";

/* ---------------- Zod Schema Following API Guidelines ---------------- */

const bookingSchema = z.object({
  email: z.string().email("Invalid email address"),
  consent_given: z.boolean().refine((val) => val === true, {
    message: "You must accept all policies",
  }),
  privacy_policy: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policy",
  }),
  non_refund_policy: z.boolean().refine((val) => val === true, {
    message: "You must accept the non-refund policy",
  }),
  confidentiality_policy: z.boolean().refine((val) => val === true, {
    message: "You must accept the confidentiality policy",
  }),
  preferred_date: z.string().min(1, "Preferred date is required"),
  preferred_period: z.enum(["MORNING", "EVENING", "CUSTOM"], {
    required_error: "Select a time period",
  }),
  preferred_time_start: z.string().optional(),
  preferred_time_end: z.string().optional(),
  mode: z.enum(["ONLINE", "OFFLINE"], {
    required_error: "Select session mode",
  }),
  payment_mode: z.enum(["ONLINE", "OFFLINE"], {
    required_error: "Select payment mode",
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
    message: "Start and end times are required for custom period",
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
      consent_given: false,
      privacy_policy: false,
      non_refund_policy: false,
      confidentiality_policy: false,
    },
  });

  const preferredPeriod = watch("preferred_period");

  const onSubmit = async (data: BookingFormData) => {
    setBookingStatus("submitting");
    setErrorMessage("");

    try {
      // Prepare payload - ONLY send required fields per API guidelines
      const payload: any = {
        email: data.email,
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

      const response = await fetch(`${BACKEND_URL}/api/bookings/draft/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create booking");
      }

      // Backend may return existing booking details
      if (result.acknowledgement_id) {
        setExistingBooking(result);
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
    <main className="min-h-screen bg-[var(--color-bg-subtle)]">
      
      {/* Hero Section - Mode Selection */}
      {!selectedMode && bookingStatus === "idle" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-title text-6xl md:text-7xl lg:text-8xl text-[var(--color-text-body)] mb-6 leading-tight">
              Let's begin your{" "}
              <span className="text-[var(--color-primary)] italic">healing journey.</span>
            </h1>
            
            <p className="font-body text-lg md:text-xl text-[var(--color-text-body)]/70 mb-8 max-w-2xl mx-auto">
              Choose your session type to get started. It only takes a few minutes to share your details and move things forward.
            </p>

            {/* Session Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-[var(--color-primary)]/20">
                <div className="text-2xl mb-2">⏱️</div>
                <div className="font-body text-sm text-[var(--color-text-body)]/90">
                  <span className="font-bold block mb-1">Session Duration</span>
                  60 minutes per session
                </div>
              </div>
              <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 backdrop-blur-sm rounded-2xl p-4 border-2 border-[var(--color-primary)]/40">
                <div className="text-2xl mb-2">✨</div>
                <div className="font-body text-sm text-[var(--color-text-body)]/90">
                  <span className="font-bold block mb-1 text-[var(--color-primary)]">First Session</span>
                  Introductory assessment & goal setting
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-[var(--color-primary)]/20">
                <div className="text-2xl mb-2">🏢</div>
                <div className="font-body text-sm text-[var(--color-text-body)]/90">
                  <span className="font-bold block mb-1">Location</span>
                  Online platform or offline studio
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div onClick={() => {
                setSelectedMode("ONLINE");
                setValue("mode", "ONLINE");
              }}>
                <MagneticButton text="Online Session" />
              </div>
              
              <div onClick={() => {
                setSelectedMode("OFFLINE");
                setValue("mode", "OFFLINE");
              }}>
                <MagneticButton text="Offline Session" className="bg-transparent border-2 border-[var(--color-text-body)]" />
              </div>
            </div>

            <div className="mt-16 flex items-start gap-2 text-sm text-[var(--color-text-body)]/60 font-body max-w-lg mx-auto">
              <span className="flex-shrink-0 mt-0.5">ℹ️</span>
              <p className="text-left">
                Not booking a session? For collaborations, podcasts, or other opportunities,{" "}
                <a href="/about#contact" className="underline hover:text-[var(--color-primary)] transition-colors">
                  get in touch with us
                </a>
                .
              </p>
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
            className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-3xl p-10 text-center shadow-xl max-w-2xl"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-7xl mb-6"
            >
              📧
            </motion.div>
            <h2 className="font-title text-4xl text-green-800 mb-4">Check Your Email</h2>
            <p className="font-body text-lg text-green-700 mb-4 max-w-md mx-auto">
              We've sent a verification link to your email address. Please click the link to verify your booking.
            </p>
            <div className="bg-white/50 rounded-xl p-4 max-w-md mx-auto">
              <p className="font-body text-sm text-green-600">
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
              className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-[var(--color-primary)]/20"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Email Field */}
                <div>
                <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                  Email Address <span className="text-[var(--color-primary)]">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body bg-white"
                  placeholder="your.email@example.com"
                  disabled={bookingStatus === "submitting"}
                />
                {errors.email && (
                  <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.email.message}</p>
                )}
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block font-body text-sm font-semibold text-[var(--color-text-body)] mb-2">
                  Preferred Date <span className="text-[var(--color-primary)]">*</span>
                </label>
                <input
                  type="date"
                  {...register("preferred_date")}
                  min={minDate}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body bg-white"
                  disabled={bookingStatus === "submitting"}
                />
                {errors.preferred_date && (
                  <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.preferred_date.message}</p>
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
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body bg-white"
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
                      className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body bg-white"
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
                  {(["ONLINE", "OFFLINE"] as const).map((paymentMode) => (
                    <label
                      key={paymentMode}
                      className={`flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all font-body text-sm font-semibold ${
                        watch("payment_mode") === paymentMode
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        {...register("payment_mode")}
                        value={paymentMode}
                        className="sr-only"
                        disabled={bookingStatus === "submitting"}
                      />
                      {paymentMode}
                    </label>
                  ))}
                </div>
                {errors.payment_mode && (
                  <p className="text-[var(--color-primary)] text-sm mt-1 font-body">{errors.payment_mode.message}</p>
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
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body resize-none bg-white"
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
                  <div onClick={handleSubmit(onSubmit)}>
                    <MagneticButton text="Book Session" />
                  </div>
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
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-xs font-semibold text-[var(--color-primary)]">1</span>
                <span>You'll receive a <strong>verification email</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-xs font-semibold text-[var(--color-primary)]">2</span>
                <span>Click the link to <strong>verify your booking request</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-xs font-semibold text-[var(--color-primary)]">3</span>
                <span>Our admin will <strong>review and approve</strong> your booking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-xs font-semibold text-[var(--color-primary)]">4</span>
                <span>You'll receive a <strong>confirmation email</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-xs font-semibold text-[var(--color-primary)]">5</span>
                <span>You'll need to <strong>confirm within 24 hours</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-xs font-semibold text-white">6</span>
                <span>Session begins! <strong className="text-[var(--color-primary)]">🎉</strong></span>
              </li>
            </ol>
          </motion.div>
          </div>
        </div>
      )}
    </main>
  );
}