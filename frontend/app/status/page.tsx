"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { bookingAPI, statusHelpers } from "@/lib/api";
import type { BookingStatusResponse } from "@/types";
import {
  trackPaymentInitiated,
  trackCancellationRequested,
} from "@/lib/analytics";

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
  const [acknowledgementId, setAcknowledgementId] = useState("");
  const [inputId, setInputId] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationPending, setCancellationPending] = useState(false);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchIdRef = useRef(0);

  // ─────────────────────────
  // Load acknowledgement ID
  // ─────────────────────────
  useEffect(() => {
    const id =
      idFromUrl ||
      (typeof window !== "undefined"
        ? localStorage.getItem("acknowledgement_id")
        : null);

    if (id) {
      setAcknowledgementId(id);
      setInputId(id);
    }
  }, [idFromUrl]);

  // ─────────────────────────
  // Fetch booking status
  // ─────────────────────────
  const fetchStatus = async (showLoader = false) => {
    if (!acknowledgementId) return;

    if (showLoader && state.kind !== "success") {
      setState({ kind: "loading" });
    }

    const fetchId = ++lastFetchIdRef.current;

    try {
      const data = await bookingAPI.getStatus(acknowledgementId);
      if (fetchId === lastFetchIdRef.current) {
        setState({ kind: "success", data });

        if (["CANCELLED", "REJECTED"].includes(data.status)) {
          setCancellationPending(false);
        }
      }
    } catch (err: any) {
      if (fetchId === lastFetchIdRef.current) {
        setState({
          kind: "error",
          message: err.message || "Failed to fetch booking status",
        });
      }
    }
  };

  // ─────────────────────────
  // Initial fetch + polling
  // ─────────────────────────
  useEffect(() => {
    if (!acknowledgementId) return;

    fetchStatus(true);

    pollingRef.current = setInterval(() => {
      fetchStatus(false);
    }, 30000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [acknowledgementId]);

  // ─────────────────────────
  // Payment
  // ─────────────────────────
  const handleInitiatePayment = () => {
    if (state.kind !== "success") return;

    trackPaymentInitiated({ has_amount: true });
    router.push(`/payment?id=${acknowledgementId}`);
  };

  // ─────────────────────────
  // Cancellation
  // ─────────────────────────
  const handleRequestCancellation = async () => {
    if (state.kind !== "success") return;

    if (statusHelpers.isTerminal(state.data.status)) {
      alert("This booking can no longer be cancelled.");
      return;
    }

    // Only CONFIRMED status requires email confirmation
    const needsEmail = state.data.status === "CONFIRMED";

    const confirmed = confirm(
      needsEmail
        ? "Are you sure you want to cancel this booking? You will need to confirm via email."
        : "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    setIsCancelling(true);

    try {
      await bookingAPI.requestCancellation({
        acknowledgement_id: acknowledgementId,
      });

      trackCancellationRequested();

      if (needsEmail) {
        setCancellationPending(true);
      }

      alert(
        needsEmail
          ? "Cancellation verification email sent. Please check your inbox to complete cancellation."
          : "Booking cancelled successfully."
      );

      // Lock UI immediately by fetching without loader
      await fetchStatus(false);
    } catch (err: any) {
      alert(err.message || "Failed to request cancellation");
    } finally {
      setIsCancelling(false);
    }
  };

  // ─────────────────────────
  // Helpers
  // ─────────────────────────
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

        {!acknowledgementId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/95 rounded-3xl shadow-xl p-8 mb-6"
          >
            <h2 className="font-title text-2xl mb-4">
              Enter Your Acknowledgement ID
            </h2>

            <input
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setAcknowledgementId(inputId.trim());
              }}
              placeholder="MS-XXXXXX"
              className="w-full px-4 py-3 rounded-xl border-2 mb-4"
            />

            <button
              onClick={() => setAcknowledgementId(inputId.trim())}
              className="w-full bg-[var(--color-primary)] text-white px-6 py-3 rounded-full"
            >
              Check Status
            </button>
          </motion.div>
        )}

        {/* Rest of UI unchanged */}
        {state.kind === "loading" && (
          <div className="bg-white/95 rounded-3xl shadow-xl p-12 text-center">
            <div className="text-7xl mb-4">🔄</div>
            Loading booking status...
          </div>
        )}

        {state.kind === "error" && (
          <div className="bg-red-100 rounded-3xl p-10 text-center">
            <p>{state.message}</p>
          </div>
        )}

        {state.kind === "success" && (
          <>
            {/* UI remains unchanged below */}

            {/* Example Actions Section */}
            {statusHelpers.canRequestCancellation(state.data.status) &&
             state.data.status !== "CANCELLED" && (
              <button
                onClick={handleRequestCancellation}
                disabled={isCancelling || cancellationPending}
                className="bg-red-600 text-white px-6 py-3 rounded-full"
              >
                {cancellationPending
                  ? "Cancellation Pending (Check Email)"
                  : isCancelling
                  ? "Processing..."
                  : "❌ Request Cancellation"}
              </button>
            )}

            {cancellationPending && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 text-center">
                <p className="font-body text-yellow-800">
                  📧 Cancellation requested. Please verify using the link sent to your email.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatusPageContent />
    </Suspense>
  );
}
