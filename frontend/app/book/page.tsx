"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import MagneticButton from "@/components/Button";
import GlassFocusLayer from "@/components/GlassFocusLayer";
import { useFocusTrap } from "@/components/useFocusTrap";
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
      {selectedMode && (bookingStatus === "idle" || bookingStatus === "submitting" || bookingStatus === "error") && (
        <>
          <GlassFocusLayer show onClick={() => setSelectedMode(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-2 py-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-3xl mx-auto bg-[var(--color-bg-lavender)] rounded-3xl shadow-2xl border border-[var(--color-text-body)]/20 p-0 focus:outline-none"
              role="dialog"
              aria-modal="true"
              aria-label="Booking form modal"
              tabIndex={-1}
            >
              {/* Focus trap for accessibility */}
              {(() => {
                const ref = useFocusTrap(true, () => setSelectedMode(null));
                return (
                  <div ref={ref} className="outline-none">
                    {/* Close button (plain text, accessible) */}
                    <button
                      onClick={() => setSelectedMode(null)}
                      className="absolute top-4 right-4 z-10 text-[var(--color-text-body)]/70 hover:text-[var(--color-primary)] font-title text-lg px-4 py-2 rounded-full bg-white/60 shadow focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      aria-label="Close booking modal"
                    >
                      Close
                      <span className="sr-only"> (Esc)</span>
                    </button>
                    {/* Back button and mode indicator */}
                    <div className="mb-8 flex items-center justify-between pt-8 px-8">
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
                        className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 mb-6 shadow-lg mx-8"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">⚠️</span>
                          <p className="font-body text-red-700">{errorMessage}</p>
                        </div>
                      </motion.div>
                    )}
                    {/* Booking Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-8 pb-8">
                      {/* ...existing code... (form fields, unchanged) */}
                      {/* Personal Information Section */}
                      <div className="space-y-5">
                        {/* ...existing code... */}
                      </div>
                      {/* ...existing code... (all form fields, unchanged) */}
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
                    {/* Info Box - What Happens Next */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-8 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary)]/10 rounded-2xl p-8 border border-[var(--color-primary)]/20 mx-8"
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
                );
              })()}
            </motion.div>
          </div>
        </>
      )}
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