"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
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

      await refetchVerification();
    } catch (err: any) {
      setState({
        kind: "error",
        message: err?.message || "Failed to cancel booking. Please try again.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg-subtle)] flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full">
        
        {/* Missing Token */}
        {!token && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-3xl p-10 text-center shadow-xl"
          >
            <div className="text-7xl mb-6">⚠️</div>
            <h2 className="font-title text-4xl text-red-800 mb-4">Invalid Link</h2>
            <p className="font-body text-lg text-red-700">
              The verification link is invalid or missing. Please check your email and try again.
            </p>
          </motion.div>
        )}

        {/* Loading */}
        {token && state.kind === "loading" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-3xl p-10 text-center shadow-xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="text-7xl mb-6 inline-block"
            >
              🔄
            </motion.div>
            <h2 className="font-title text-4xl text-blue-800 mb-4">Verifying...</h2>
            <p className="font-body text-lg text-blue-700">
              Please wait while we verify your email address.
            </p>
          </motion.div>
        )}

        {/* Error */}
        {state.kind === "error" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-3xl p-10 text-center shadow-xl"
          >
            <div className="text-7xl mb-6">❌</div>
            <h2 className="font-title text-4xl text-red-800 mb-4">Verification Failed</h2>
            <p className="font-body text-lg text-red-700 mb-6">
              {state.message}
            </p>
            <div className="bg-white/50 rounded-xl p-4">
              <p className="font-body text-sm text-red-600">
                💡 The link may have expired or been used already. Please request a new verification email from the booking page.
              </p>
            </div>
            <button
              onClick={() => router.push("/book")}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white font-body font-semibold px-8 py-3 rounded-full transition-all"
            >
              Go to Booking Page
            </button>
          </motion.div>
        )}

        {/* Success */}
        {state.kind === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-3xl p-10 shadow-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-7xl mb-6 text-center"
            >
              ✅
            </motion.div>
            <h2 className="font-title text-4xl text-green-800 mb-6 text-center">
              Email Verified Successfully!
            </h2>
            
            <div className="bg-white/60 rounded-2xl p-6 space-y-4 mb-6">
              <div className="flex justify-between items-center border-b border-green-200 pb-3">
                <span className="font-body font-semibold text-green-700">Acknowledgement ID:</span>
                <span className="font-mono font-bold text-green-800">{state.data.booking.acknowledgement_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body font-semibold text-green-700">Status:</span>
                <span className="font-body uppercase bg-green-200 px-3 py-1 rounded-full text-xs font-bold text-green-800">
                  {state.data.booking.status}
                </span>
              </div>
            </div>

            {["APPROVED", "PAYMENT_PENDING", "CONFIRMED"].includes(state.data.booking.status) && (
              <div className="bg-white/60 rounded-2xl p-6 space-y-3 mb-6">
                <h3 className="font-body font-semibold text-green-700 mb-2">
                  Session Details
                </h3>

                {state.data.booking.approved_slot_start && (
                  <div className="flex justify-between">
                    <span className="font-body text-green-700">Start Time</span>
                    <span className="font-body font-semibold text-green-800">
                      {new Date(state.data.booking.approved_slot_start).toLocaleString()}
                    </span>
                  </div>
                )}

                {state.data.booking.approved_slot_end && (
                  <div className="flex justify-between">
                    <span className="font-body text-green-700">End Time</span>
                    <span className="font-body font-semibold text-green-800">
                      {new Date(state.data.booking.approved_slot_end).toLocaleString()}
                    </span>
                  </div>
                )}

                {state.kind === "success" &&
                  typeof (state.data as any).amount === "number" && (
                    <div className="flex justify-between">
                      <span className="font-body text-green-700">Amount</span>
                      <span className="font-body font-bold text-green-800">
                        ₹{(state.data as any).amount}
                      </span>
                    </div>
                  )
                }
              </div>
            )}

            <div className="bg-gradient-to-r from-green-600/10 to-green-500/10 rounded-xl p-5 mb-6">
              <p className="font-body text-sm text-green-700 text-center">
                {state.data.booking.status === "PENDING" && (
                  <>
                    <span className="font-bold">📋 Your booking is now awaiting admin review.</span>
                    <br />
                    You'll receive an email once it's been approved.
                  </>
                )}
                {state.data.booking.status === "APPROVED" && (
                  <>
                    <span className="font-bold">💳 Your booking has been approved!</span>
                    <br />
                    Please proceed to payment to confirm your session.
                  </>
                )}
                {state.data.booking.status === "CONFIRMED" && (
                  <>
                    <span className="font-bold">✓ Your booking has been verified and payment received!</span>
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
              {state.data.booking.status === "APPROVED" && (
                <>
                  <button
                    onClick={() => router.push(`/payment?id=${state.data.booking.acknowledgement_id}`)}
                    className="bg-green-600 hover:bg-green-700 text-white font-body font-semibold px-8 py-3 rounded-full transition-all shadow-lg"
                  >
                    Proceed to Payment
                  </button>
                  <button
                    onClick={handleCancelBooking}
                    className="bg-red-600 hover:bg-red-700 text-white font-body font-semibold px-8 py-3 rounded-full transition-all shadow-lg"
                  >
                    Cancel Booking
                  </button>
                </>
              )}
              
              {state.data.booking.status === "CONFIRMED" && (
                <>
                  {calendarHref ? (
                    <a
                      href={calendarHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-body font-semibold px-8 py-3 rounded-full transition-all shadow-lg inline-flex items-center justify-center"
                    >
                      Add to Google Calendar
                    </a>
                  ) : null}
                  <button
                    onClick={handleCancelBooking}
                    className="bg-red-600 hover:bg-red-700 text-white font-body font-semibold px-8 py-3 rounded-full transition-all shadow-lg"
                  >
                    Cancel Booking
                  </button>
                </>
              )}
              
              <button
                onClick={() => {
                  window.location.href = "https://mindsettler.vercel.app/";
                }}
                className="bg-white hover:bg-green-50 text-green-700 font-body font-semibold px-8 py-3 rounded-full transition-all border-2 border-green-200"
              >
                Go to Home
              </button>
            </div>
          </motion.div>
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
