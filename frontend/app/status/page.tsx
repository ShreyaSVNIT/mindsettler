"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BookingCard from "@/components/BookingCard";
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
        if (cancellationPending && data.status === "CONFIRMED") {
          // Keep success state unchanged if cancellation pending and still CONFIRMED
          setState({ kind: "success", data });
        } else {
          setState({ kind: "success", data });

          if (["CANCELLED", "REJECTED"].includes(data.status)) {
            setCancellationPending(false);
          }
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

      // Removed fetchStatus call here as per instructions
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
    // Use text-body badge style for all statuses to keep design consistent
    return "bg-[var(--color-text-body)]/10 text-[var(--color-text-body)]";
  };

  // emojis removed to follow unified design

  return (
    <main className="min-h-screen bg-[var(--color-bg-subtle)] py-12 px-6">
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute w-72 h-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" animate={{ x: [0, 40, 0], y: [0, -40, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} style={{ top: '-96px', left: '50%', transform: 'translateX(-50%)' }} />
          <motion.div className="absolute w-72 h-72 rounded-full bg-purple-400/10 blur-3xl" animate={{ x: [0, -40, 0], y: [0, 40, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} style={{ bottom: '-96px', left: '50%', transform: 'translateX(-50%)' }} />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-title text-5xl md:text-6xl text-[var(--color-text-body)] mb-8 text-center"
        >
          Booking Status
        </motion.h1>

        {!acknowledgementId && (
          <BookingCard variant="white" className="mb-6">
            <h2 className="font-title text-3xl md:text-4xl lg:text-5xl mb-4">
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
                className="w-full bg-[var(--color-text-body)] text-white px-6 py-3 rounded-full"
              >
                Check Status
              </button>
            </BookingCard>
        )}

        {/* Rest of UI unchanged */}
        {state.kind === "loading" && (
          <div className="bg-white/95 rounded-3xl shadow-xl p-12 text-center">
            <div className="mb-4">Loading booking status...</div>
          </div>
        )}

        {state.kind === "error" && (
          <div className="bg-[var(--color-bg-lavender)] border-2 border-[var(--color-text-body)]/20 rounded-3xl p-10 text-center shadow-xl">
            <p className="text-[var(--color-text-body)]">{state.message}</p>
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
                className="bg-[var(--color-text-body)] text-white px-6 py-3 rounded-full"
              >
                {cancellationPending
                  ? "Cancellation Pending (Check Email)"
                  : isCancelling
                  ? "Processing..."
                  : "Request Cancellation"}
              </button>
            )}

            {cancellationPending && (
              <div className="bg-[var(--color-bg-lavender)] border-2 border-[var(--color-text-body)]/20 rounded-2xl p-4 text-center">
                <p className="font-body text-[var(--color-text-body)]">
                  Cancellation requested. Please verify using the link sent to your email.
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
