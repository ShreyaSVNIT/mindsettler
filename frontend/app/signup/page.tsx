"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{score: number; label: string; hint: string}>({ score: 0, label: 'Weak', hint: '' });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onSubmit",
  });

  const password = watch('password');

  // Calculate password strength
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Weak', hint: '' };
    
    let score = 0;
    const hints = [];
    
    if (pwd.length >= 8) score++;
    else hints.push('at least 8 characters');
    
    if (pwd.length >= 12) score++;
    
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    else hints.push('uppercase and lowercase letters');
    
    if (/\d/.test(pwd)) score++;
    else hints.push('numbers');
    
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    else hints.push('special characters');
    
    let label = 'Weak';
    if (score >= 4) label = 'Strong';
    else if (score >= 2) label = 'Medium';
    
    const hint = hints.length > 0 ? `Add ${hints.join(', ')}` : 'Excellent password!';
    
    return { score, label, hint };
  };

  // Update password strength when password changes
  useEffect(() => {
    if (password) {
      setPasswordStrength(calculatePasswordStrength(password));
    }
  }, [password]);

  const onSubmit = async () => {
    setSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[var(--color-bg-lavender)] grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Image & Text */}
      <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative hidden lg:flex flex-col justify-center px-16 overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=1600"
              alt="Wellness"
              fill
              className="object-cover opacity-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-lavender)]/40 via-[var(--color-bg-lavender)]/70 to-[var(--color-bg-lavender)]" />
          </div>

          {/* Text Content */}
          <div className="relative z-10 max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-title text-7xl leading-[0.95] text-[var(--color-text-body)] tracking-tight mb-6"
            >
              Begin your
              <span className="block text-[var(--color-primary)] italic mt-2">
                TRANSFORMATION
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-body text-lg text-[var(--color-text-body)]/80 leading-relaxed"
            >
              Join MindSettler and start your journey toward mental wellness and emotional clarity.
            </motion.p>
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center p-6 lg:p-16"
        >
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-[var(--color-border)]"
            >
              <div className="mb-8">
                <h2 className="font-title text-5xl text-[var(--color-text-body)] mb-3">
                  Sign up
                </h2>
                <p className="font-body text-sm text-[var(--color-text-body)]/60">
                  Sign up with email address
                </p>
              </div>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 px-5 py-4"
                >
                  <p className="font-body text-sm text-[var(--color-text-body)]">
                    ✓ Form submitted (UI only)
                  </p>
                </motion.div>
              )}

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                {/* Email Input */}
                <div>
                  <div className="relative">
                    <input
                      type="email"
                      autoComplete="email"
                      {...register("email")}
                      disabled={isSubmitting}
                      placeholder="yourname@gmail.com"
                      className="w-full rounded-2xl border-2 border-[var(--color-border)] bg-white/60 px-5 py-4 pl-12 font-body text-[15px] text-[var(--color-text-body)] placeholder:text-[var(--color-text-body)]/40 outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white"
                    />
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-body)]/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  {errors.email && (
                    <p className="mt-2 ml-1 font-body text-xs text-[var(--color-primary)]">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      {...register("password")}
                      disabled={isSubmitting}
                      placeholder="Create password"
                      className="w-full rounded-2xl border-2 border-[var(--color-border)] bg-white/60 px-5 py-4 pl-12 pr-12 font-body text-[15px] text-[var(--color-text-body)] placeholder:text-[var(--color-text-body)]/40 outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white"
                    />
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-body)]/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-body)]/40 hover:text-[var(--color-text-body)]/70 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 ml-1 font-body text-xs text-[var(--color-primary)]">
                      {errors.password.message}
                    </p>
                  )}
                  
                  {/* Password Strength Indicator */}
                  {password && password.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((bar) => (
                          <div
                            key={bar}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              bar <= passwordStrength.score
                                ? passwordStrength.score <= 2
                                  ? 'bg-red-500'
                                  : passwordStrength.score <= 3
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`font-body text-xs font-medium ${
                          passwordStrength.score <= 2
                            ? 'text-red-600'
                            : passwordStrength.score <= 3
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}>
                          {passwordStrength.label}
                        </span>
                        <span className="font-body text-xs text-[var(--color-text-body)]/60">
                          {passwordStrength.hint}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      {...register("confirmPassword")}
                      disabled={isSubmitting}
                      placeholder="Confirm password"
                      className="w-full rounded-2xl border-2 border-[var(--color-border)] bg-white/60 px-5 py-4 pl-12 pr-12 font-body text-[15px] text-[var(--color-text-body)] placeholder:text-[var(--color-text-body)]/40 outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white"
                    />
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-body)]/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-body)]/40 hover:text-[var(--color-text-body)]/70 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 ml-1 font-body text-xs text-[var(--color-primary)]">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Sign Up Button */}
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-gradient-to-r from-[var(--color-text-body)] to-[#5a4a6f] py-4 font-body text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign up
                </button>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--color-border)]"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 font-body text-[var(--color-text-body)]/50 tracking-wider">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 rounded-2xl border-2 border-[var(--color-border)] bg-white/60 py-3 font-body text-sm font-medium text-[var(--color-text-body)] transition-all hover:border-[var(--color-primary)]/30 hover:bg-white"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 rounded-2xl border-2 border-[var(--color-border)] bg-white/60 py-3 font-body text-sm font-medium text-[var(--color-text-body)] transition-all hover:border-[var(--color-primary)]/30 hover:bg-white"
                  >
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                </div>

                {/* Footer Links */}
                <div className="pt-4 text-center">
                  <p className="font-body text-xs text-[var(--color-text-body)]/60">
                    By registering you with our{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-[var(--color-primary)] underline decoration-1 underline-offset-2 hover:text-[var(--color-primary-hover)]"
                    >
                      Terms and Conditions
                    </Link>
                  </p>
                  <p className="mt-4 font-body text-sm text-[var(--color-text-body)]/70">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-[var(--color-primary)] underline decoration-2 underline-offset-4 hover:text-[var(--color-primary-hover)]"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
    </div>
  );
}
