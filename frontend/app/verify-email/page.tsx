"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import BookingCard from "@/components/BookingCard";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { bookingAPI } from "@/lib/api";
import type { VerifyEmailResponse } from "@/types";
import { trackBookingVerified, trackBookingApproved } from "@/lib/analytics";

type ViewState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "success"; data: VerifyEmailResponse };

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [state, setState] = useState<ViewState>({ kind: "idle" });

  useEffect(() => {
    if (!token) return;

    setState({ kind: "loading" });

    bookingAPI
      .verifyEmail(token)
      .then((data) => {
        console.log("Verification API Response:", data);
        console.log("Acknowledgement ID:", data.booking.acknowledgement_id);
        console.log("Status:", data.booking.status);
        
        setState({ kind: "success", data });
        
        // Track verification (privacy: only status, no ID)
        trackBookingVerified({ status: data.booking.status });
        
        // Track if booking was already approved
        if (data.booking.status === "APPROVED") {
          trackBookingApproved();
        }
        
        // Store acknowledgement ID for status tracking
        if (typeof window !== "undefined" && data.booking.acknowledgement_id) {
          localStorage.setItem("acknowledgement_id", data.booking.acknowledgement_id);
        }
      })
      .catch((err: any) => {
        console.error("Verification Error:", err);
        const message = err.message || "Email verification failed.";
        setState({ kind: "error", message });
      });
  }, [token]);

  const refetchVerification = async () => {
    if (!token) return;
    setState({ kind: "loading" });
    try {
      const data = await bookingAPI.verifyEmail(token);
      setState({ kind: "success", data });
    } catch (err: any) {
      setState({
        kind: "error",
        message: err?.message || "Failed to refresh booking status",
      });
    }
  };

  // Safe calendar link generation (only when both start and end exist)
  let calendarHref: string | null = null;
  if (state.kind === 'success') {
    const startRaw = state.data.booking.approved_slot_start;
    const endRaw = state.data.booking.approved_slot_end;
    if (startRaw && endRaw) {
      const s = new Date(startRaw).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const e = new Date(endRaw).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      calendarHref = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=MindSettler%20Session&dates=${s}/${e}&details=Your%20MindSettler%20session%20has%20been%20confirmed.`;
    }
  }

  const handleCancelBooking = async () => {
    if (state.kind !== "success") return;

    try {
      setState({ kind: "loading" });

      const response = await bookingAPI.requestCancellation({
        acknowledgement_id: state.data.booking.acknowledgement_id,
      });

      if (response?.message?.toLowerCase().includes("email")) {
        alert(
          "A cancellation verification email has been sent. Please check your inbox to complete the cancellation."
        );
      } else {
        alert("Your booking has been cancelled successfully.");
      }

      // IMPORTANT: refetch verification instead of redirecting
      const refreshed = await bookingAPI.verifyEmail(token!);
      setState({ kind: "success", data: refreshed });

    } catch (err: any) {
      setState({
        kind: "error",
        message: err?.message || "Failed to cancel booking. Please try again.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg-subtle)] flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full relative">
        {/* Decorative glowing circles (from 404 style) */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute w-72 h-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            style={{ top: '-96px', left: '50%', transform: 'translateX(-50%)' }}
          />
          <motion.div
            className="absolute w-72 h-72 rounded-full bg-purple-400/10 blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            style={{ bottom: '-96px', left: '50%', transform: 'translateX(-50%)' }}
          />
        </div>
        
        {/* Missing Token */}
        {!token && (
          <BookingCard>
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-body)] mb-4">Invalid Link</h2>
            <p className="font-body text-lg text-[var(--color-text-body)]">
              The verification link is invalid or missing. Please check your email and try again.
            </p>
          </BookingCard>
        )}

        {/* Loading */}
        {token && state.kind === "loading" && (
          <BookingCard>
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-body)] mb-4">Verifying…</h2>
            <p className="font-body text-lg text-[var(--color-text-body)]">
              Please wait while we verify your email address.
            </p>
          </BookingCard>
        )}

        {/* Error */}
        {state.kind === "error" && (
          <BookingCard>
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-body)] mb-4">Verification Failed</h2>
            <p className="font-body text-lg text-[var(--color-text-body)] mb-6">
              {state.message}
            </p>
            <div className="bg-white/50 rounded-xl p-4">
              <p className="font-body text-sm text-[var(--color-text-body)]">
                The link may have expired or been used already. Please request a new verification email from the booking page.
              </p>
            </div>
            <button
              onClick={() => router.push("/book")}
              className="mt-6 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-body font-semibold px-8 py-3 rounded-full transition-all"
            >
              Go to Booking Page
            </button>
          </BookingCard>
        )}

        {/* Success */}
        {state.kind === "success" && (
          <BookingCard className="text-left" variant="white">
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-body)] mb-6 text-center">Email Verified</h2>

            <div className="bg-white/60 rounded-2xl p-6 space-y-4 mb-6">
              <div className="flex justify-between items-center border-b border-[var(--color-text-body)]/20 pb-3">
                <span className="font-body font-semibold text-[var(--color-text-body)]">Acknowledgement ID:</span>
                <span className="font-mono font-bold text-[var(--color-text-body)]">{state.data.booking.acknowledgement_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body font-semibold text-[var(--color-text-body)]">Status:</span>
                <span className="font-body uppercase bg-[var(--color-text-body)]/10 px-3 py-1 rounded-full text-xs font-bold text-[var(--color-text-body)]">
                  {state.data.booking.status}
                </span>
              </div>
            </div>

            {(["APPROVED", "PAYMENT_PENDING", "CONFIRMED"].includes(state.data.booking.status)) && (
              <div className="bg-white/60 rounded-2xl p-6 space-y-3 mb-6">
                <h3 className="font-body font-semibold text-[var(--color-text-body)] mb-2">
                  Session Details
                </h3>

                {state.data.booking.approved_slot_start && (
                  <div className="flex justify-between">
                    <span className="font-body text-[var(--color-text-body)]">Start Time</span>
                    <span className="font-body font-semibold text-[var(--color-text-body)]">
                      {new Date(state.data.booking.approved_slot_start).toLocaleString()}
                    </span>
                  </div>
                )}

                {state.data.booking.approved_slot_end && (
                  <div className="flex justify-between">
                    <span className="font-body text-[var(--color-text-body)]">End Time</span>
                    <span className="font-body font-semibold text-[var(--color-text-body)]">
                      {new Date(state.data.booking.approved_slot_end).toLocaleString()}
                    </span>
                  </div>
                )}

              </div>
            )}

            <div className="bg-[var(--color-text-body)]/10 rounded-xl p-5 mb-6">
              <p className="font-body text-sm text-[var(--color-text-body)] text-center">
                {state.data.booking.status === "PENDING" && (
                  <>
                    <span className="font-bold">Your booking is awaiting admin review.</span>
                    <br />
                    You'll receive an email once it's been approved.
                  </>
                )}
                {state.data.booking.status === "APPROVED" && (
                  <>
                    <span className="font-bold">Your booking has been approved.</span>
                    <br />
                    Please proceed to payment to confirm your session.
                  </>
                )}
                {state.data.booking.status === "CONFIRMED" && (
                  <>
                    <span className="font-bold">Your booking is confirmed and payment received.</span>
                    <br />
                    You can cancel your booking if needed.
                  </>
                )}
                {state.data.booking.status !== "PENDING" && state.data.booking.status !== "APPROVED" && state.data.booking.status !== "CONFIRMED" && (
                  <>
                    Your booking status is <span className="font-bold">{state.data.booking.status}</span>.
                    <br />
                    Check the status page for more details.
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">

              {/* Proceed to payment (only when approved & online) */}
              {state.data.booking.status === "APPROVED" &&
               !(state.data.booking.mode === "OFFLINE" && (state.data.booking as any).payment_mode === "OFFLINE") && (
                <button
                  onClick={() =>
                    router.push(`/payment?id=${state.data.booking.acknowledgement_id}`)
                  }
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-body font-semibold px-8 py-3 rounded-full transition-all shadow-lg"
                >
                  Proceed to Payment
                </button>
              )}

              {/* Cancel booking — ALWAYS visible for non-terminal states */}
              {!["CANCELLED", "REJECTED", "COMPLETED"].includes(
                state.data.booking.status
              ) && (
                <button
                  onClick={handleCancelBooking}
                  className="bg-white hover:bg-[var(--color-bg-lavender)] text-[var(--color-primary)] font-body font-semibold px-8 py-3 rounded-full transition-all shadow-sm border border-[var(--color-primary)]/10"
                >
                  Cancel Booking
                </button>
              )}

              {/* Google Calendar (confirmed only) */}
              {state.data.booking.status === "CONFIRMED" && calendarHref && (
                <a
                  href={calendarHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-body font-semibold px-8 py-3 rounded-full transition-all shadow-lg inline-flex items-center justify-center"
                >
                  Add to Google Calendar
                </a>
              )}

              {/* Home */}
              <button
                onClick={() => {
                  window.location.href = "https://mindsettler.vercel.app/";
                }}
                className="bg-white hover:bg-[var(--color-bg-lavender)] text-[var(--color-primary)] font-body font-semibold px-8 py-3 rounded-full transition-all border-2 border-[var(--color-primary)]/10"
              >
                Go to Home
              </button>

            </div>
          </BookingCard>
        )}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-bg-subtle)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="font-body text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
