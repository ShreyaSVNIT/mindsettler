"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { bookingAPI, statusHelpers } from "@/lib/api";
import type { BookingStatusResponse, BookingStatus } from "@/types";
import { trackPaymentInitiated, trackCancellationRequested } from "@/lib/analytics";

type ViewState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "success"; data: BookingStatusResponse };

function StatusPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idFromUrl = searchParams.get("id");
  
  const [state, setState] = useState<ViewState>({ kind: "idle" });
  const [acknowledgementId, setAcknowledgementId] = useState<string>("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Get acknowledgement ID from URL or localStorage
  useEffect(() => {
    const id = idFromUrl || (typeof window !== "undefined" ? localStorage.getItem("acknowledgement_id") : null);
    if (id) {
      setAcknowledgementId(id);
    }
  }, [idFromUrl]);

  // Fetch booking status
  const fetchStatus = () => {
    if (!acknowledgementId) return;

    setState({ kind: "loading" });

    bookingAPI
      .getStatus(acknowledgementId)
      .then((data) => {
        setState({ kind: "success", data });
      })
      .catch((err: any) => {
        setState({ kind: "error", message: err.message || "Failed to fetch booking status" });
      });
  };

  useEffect(() => {
    if (acknowledgementId) {
      fetchStatus();
      
      // Auto-refresh every 30 seconds if not terminal
      const interval = setInterval(() => {
        if (state.kind === "success" && !statusHelpers.isTerminal(state.data.status)) {
          fetchStatus();
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [acknowledgementId]);

  const handleInitiatePayment = async () => {
    if (state.kind !== "success") return;

    // Track payment initiation (privacy: no reference, just has_amount)
    trackPaymentInitiated({ has_amount: true });
    
    // Navigate to payment page - payment page will handle initiation
    router.push(`/payment?id=${acknowledgementId}`);
  };

  const handleRequestCancellation = async () => {
    if (state.kind !== "success") return;
    if (!confirm("Are you sure you want to cancel this booking? You'll need to verify via email.")) return;

    setIsCancelling(true);
    try {
      await bookingAPI.requestCancellation({
        acknowledgement_id: acknowledgementId,
      });
      
      // Track cancellation request (privacy: no ID)
      trackCancellationRequested();
      
      alert("Cancellation email sent! Please check your inbox to confirm.");
      fetchStatus();
    } catch (err: any) {
      alert(err.message || "Failed to request cancellation");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-200 text-gray-800",
      PENDING: "bg-yellow-200 text-yellow-800",
      APPROVED: "bg-blue-200 text-blue-800",
      PAYMENT_PENDING: "bg-purple-200 text-purple-800",
      CONFIRMED: "bg-green-200 text-green-800",
      CANCELLED: "bg-red-200 text-red-800",
      REJECTED: "bg-red-200 text-red-800",
    };
    return colors[status] || "bg-gray-200 text-gray-800";
  };

  const getStatusEmoji = (status: string) => {
    const emojis: Record<string, string> = {
      DRAFT: "📝",
      PENDING: "⏳",
      APPROVED: "✅",
      PAYMENT_PENDING: "💳",
      CONFIRMED: "🎉",
      CANCELLED: "❌",
      REJECTED: "⛔",
    };
    return emojis[status] || "📋";
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg-subtle)] py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-title text-5xl md:text-6xl text-[var(--color-text-body)] mb-8 text-center"
        >
          Booking Status
        </motion.h1>

        {/* Manual ID Entry */}
        {!acknowledgementId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/95 rounded-3xl shadow-xl p-8 mb-6"
          >
            <h2 className="font-title text-2xl text-[var(--color-text-body)] mb-4">
              Enter Your Acknowledgement ID
            </h2>
            <input
              type="text"
              placeholder="MS-XXXXXX"
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all font-body mb-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setAcknowledgementId((e.target as HTMLInputElement).value);
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector("input");
                if (input) setAcknowledgementId(input.value);
              }}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-body font-semibold px-6 py-3 rounded-full transition-all"
            >
              Check Status
            </button>
          </motion.div>
        )}

        {/* Loading */}
        {state.kind === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/95 rounded-3xl shadow-xl p-12 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="text-7xl mb-4 inline-block"
            >
              🔄
            </motion.div>
            <p className="font-body text-lg text-[var(--color-text-body)]/70">
              Loading booking status...
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
            <div className="text-7xl mb-6">⚠️</div>
            <h2 className="font-title text-4xl text-red-800 mb-4">Error</h2>
            <p className="font-body text-lg text-red-700 mb-6">{state.message}</p>
            <button
              onClick={() => setAcknowledgementId("")}
              className="bg-red-600 hover:bg-red-700 text-white font-body font-semibold px-8 py-3 rounded-full transition-all"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Success - Booking Details */}
        {state.kind === "success" && (
          <div className="space-y-6">
            {/* Current Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/95 rounded-3xl shadow-xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-title text-3xl text-[var(--color-text-body)]">Current Status</h2>
                <button
                  onClick={fetchStatus}
                  className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 font-body text-sm flex items-center gap-2"
                >
                  🔄 Refresh
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-6xl">{getStatusEmoji(state.data.status)}</span>
                <div className="flex-1">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold font-body uppercase ${getStatusColor(state.data.status)}`}>
                    {state.data.status}
                  </span>
                  <p className="font-body text-sm text-[var(--color-text-body)]/60 mt-2">
                    Acknowledgement ID: <span className="font-mono font-bold">{state.data.acknowledgement_id}</span>
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary)]/10 rounded-2xl p-6">
                <h3 className="font-body font-semibold text-[var(--color-text-body)] mb-4">Booking Timeline</h3>
                <div className="space-y-3">
                  {state.data.timeline.map((status, index) => {
                    const isActive = status === state.data.status;
                    const isPast = state.data.timeline.indexOf(state.data.status) > index;
                    return (
                      <div key={status} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isActive ? "bg-[var(--color-primary)] text-white" :
                          isPast ? "bg-green-500 text-white" :
                          "bg-gray-300 text-gray-600"
                        }`}>
                          {isPast ? "✓" : index + 1}
                        </div>
                        <span className={`font-body text-sm ${isActive ? "font-bold text-[var(--color-primary)]" : "text-[var(--color-text-body)]/60"}`}>
                          {status.replace(/_/g, " ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Booking Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/95 rounded-3xl shadow-xl p-8"
            >
              <h2 className="font-title text-2xl text-[var(--color-text-body)] mb-6">Booking Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[var(--color-primary)]/5 rounded-xl p-4">
                  <p className="font-body text-sm text-[var(--color-text-body)]/60 mb-1">Preferred Date</p>
                  <p className="font-body font-bold text-[var(--color-text-body)]">{state.data.preferred_date}</p>
                </div>
                <div className="bg-[var(--color-primary)]/5 rounded-xl p-4">
                  <p className="font-body text-sm text-[var(--color-text-body)]/60 mb-1">Period</p>
                  <p className="font-body font-bold text-[var(--color-text-body)]">{state.data.preferred_period}</p>
                </div>
                <div className="bg-[var(--color-primary)]/5 rounded-xl p-4">
                  <p className="font-body text-sm text-[var(--color-text-body)]/60 mb-1">Mode</p>
                  <p className="font-body font-bold text-[var(--color-text-body)]">{state.data.mode}</p>
                </div>
                {state.data.amount && (
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                    <p className="font-body text-sm text-green-700 mb-1">Amount</p>
                    <p className="font-body font-bold text-green-800 text-xl">₹{state.data.amount}</p>
                  </div>
                )}
                {state.data.approved_slot_start && (
                  <>
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                      <p className="font-body text-sm text-blue-700 mb-1">Approved Start</p>
                      <p className="font-body font-bold text-blue-800">{new Date(state.data.approved_slot_start).toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                      <p className="font-body text-sm text-blue-700 mb-1">Approved End</p>
                      <p className="font-body font-bold text-blue-800">{new Date(state.data.approved_slot_end!).toLocaleString()}</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/95 rounded-3xl shadow-xl p-8"
            >
              <h2 className="font-title text-2xl text-[var(--color-text-body)] mb-6">Actions</h2>
              
              <div className="space-y-3">
                {statusHelpers.canInitiatePayment(state.data.status) && (
                  <button
                    onClick={handleInitiatePayment}
                    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-body font-semibold px-6 py-4 rounded-full transition-all shadow-lg"
                  >
                    💳 Proceed to Payment
                  </button>
                )}

                {statusHelpers.awaitingAdmin(state.data.status) && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
                    <p className="font-body text-yellow-800">
                      ⏳ Your booking is awaiting admin approval. You'll receive an email once it's processed.
                    </p>
                  </div>
                )}

                {state.data.status !== "CANCELLED" && state.data.status !== "REJECTED" && (
                  <button
                    onClick={handleRequestCancellation}
                    disabled={isCancelling}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-body font-semibold px-6 py-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCancelling ? "Processing..." : "❌ Request Cancellation"}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <StatusPageContent />
    </Suspense>
  );
}
