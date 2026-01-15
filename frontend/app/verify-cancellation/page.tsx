"use client";

import { useEffect, useState, Suspense } from "react";
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
              The cancellation link is invalid or missing. Please check your email and try again.
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
            <h2 className="font-title text-4xl text-blue-800 mb-4">Verifying Cancellation...</h2>
            <p className="font-body text-lg text-blue-700">
              Please wait while we process your cancellation request.
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
            <h2 className="font-title text-4xl text-red-800 mb-4">Cancellation Failed</h2>
            <p className="font-body text-lg text-red-700 mb-6">
              {state.message}
            </p>
            <div className="bg-white/50 rounded-xl p-4">
              <p className="font-body text-sm text-red-600">
                💡 The link may have expired or the booking cannot be cancelled at this time. 
                Cancellations are only allowed up to 24 hours before the session.
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white font-body font-semibold px-8 py-3 rounded-full transition-all"
            >
              Go to Status Page
            </button>
          </motion.div>
        )}

        {/* Success */}
        {state.kind === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-3xl p-10 shadow-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-7xl mb-6 text-center"
            >
              ✅
            </motion.div>
            <h2 className="font-title text-4xl text-orange-800 mb-6 text-center">
              Booking Cancelled Successfully
            </h2>
            
            <div className="bg-white/60 rounded-2xl p-6 mb-6">
              <p className="font-body text-center text-orange-700">
                {"message" in state.data && state.data.message
                  ? state.data.message
                  : "Your booking has been cancelled and you'll receive a confirmation email shortly."}
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-600/10 to-orange-500/10 rounded-xl p-5 mb-6">
              <p className="font-body text-sm text-orange-700 text-center">
                <span className="font-bold">Status:</span>{" "}
                {"status" in state.data ? state.data.status : "CANCELLED"}
              </p>
            </div>

            <div className="bg-white/50 rounded-xl p-4 mb-6">
              <p className="font-body text-xs text-orange-600 text-center">
                ℹ️ If you change your mind, you'll need to create a new booking from the booking page.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push("/book")}
                className="bg-orange-600 hover:bg-orange-700 text-white font-body font-semibold px-8 py-3 rounded-full transition-all shadow-lg"
              >
                Book New Session
              </button>
              <button
                onClick={() => router.push("/")}
                className="bg-white hover:bg-orange-50 text-orange-700 font-body font-semibold px-8 py-3 rounded-full transition-all border-2 border-orange-200"
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
