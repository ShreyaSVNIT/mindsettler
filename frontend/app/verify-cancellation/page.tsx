"use client";

import { useEffect, useState, Suspense } from "react";
import BookingCard from "@/components/BookingCard";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { bookingAPI } from "@/lib/api";
import type { VerifyCancellationResponse } from "@/types";
import { trackCancellationConfirmed } from "@/lib/analytics";

type ViewState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "success"; data: VerifyCancellationResponse };

function VerifyCancellationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [state, setState] = useState<ViewState>({ kind: "idle" });

  useEffect(() => {
    if (!token) return;

    Promise.resolve().then(() => setState({ kind: "loading" }));

    bookingAPI
      .verifyCancellation(token)
      .then((data) => {
        // Track cancellation confirmation (privacy: no token)
        trackCancellationConfirmed();
        
        setState({ kind: "success", data });
      })
      .catch((err: any) => {
        const message = err.message || "Cancellation verification failed.";
        setState({ kind: "error", message });
      });
  }, [token]);

  return (
    <main className="min-h-screen bg-[var(--color-bg-subtle)] flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full relative">
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
              The cancellation link is invalid or missing. Please check your email and try again.
            </p>
          </BookingCard>
        )}

        {/* Loading */}
        {token && state.kind === "loading" && (
          <BookingCard>
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-body)] mb-4">Verifying Cancellation...</h2>
            <p className="font-body text-lg text-[var(--color-text-body)]">
              Please wait while we process your cancellation request.
            </p>
          </BookingCard>
        )}

        {/* Error */}
        {state.kind === "error" && (
          <BookingCard>
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-body)] mb-4">Cancellation Failed</h2>
            <p className="font-body text-lg text-[var(--color-text-body)] mb-6">{state.message}</p>
            <div className="bg-white/50 rounded-xl p-4">
              <p className="font-body text-sm text-[var(--color-text-body)]">
                The link may have expired or the booking cannot be cancelled at this time. Cancellations are only allowed up to 24 hours before the session.
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="mt-6 bg-[var(--color-text-body)] hover:bg-[var(--color-text-body)]/90 text-white font-body font-semibold px-8 py-3 rounded-full transition-all"
            >
              Go to Status Page
            </button>
          </BookingCard>
        )}

        {/* Success */}
        {state.kind === "success" && (
          <BookingCard>
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-body)] mb-6 text-center">Booking Cancelled Successfully</h2>

            <div className="bg-white/60 rounded-2xl p-6 mb-6">
              <p className="font-body text-center text-[var(--color-text-body)]">
                {"message" in state.data && state.data.message
                  ? state.data.message
                  : "Your booking has been cancelled and you'll receive a confirmation email shortly."}
              </p>
            </div>

            <div className="bg-white/50 rounded-xl p-4 mb-6">
              <p className="font-body text-xs text-[var(--color-text-body)] text-center">
                If you change your mind, you'll need to create a new booking from the booking page.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push("/book")}
                className="bg-[var(--color-text-body)] hover:bg-[var(--color-text-body)]/90 text-white font-body font-semibold px-8 py-3 rounded-full transition-all shadow-lg"
              >
                Book New Session
              </button>
              <button
                onClick={() => router.push("/")}
                className="bg-white hover:bg-[var(--color-bg-lavender)] text-[var(--color-text-body)] font-body font-semibold px-8 py-3 rounded-full transition-all border-2 border-[var(--color-text-body)]/20"
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

export default function VerifyCancellationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-bg-subtle)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="font-body text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyCancellationContent />
    </Suspense>
  );
}
