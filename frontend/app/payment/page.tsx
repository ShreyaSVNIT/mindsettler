"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { bookingAPI } from "@/lib/api";
import { trackPaymentCompleted } from "@/lib/analytics";

type ViewState =
  | { kind: "idle" }
  | { kind: "initiating" }
  | { kind: "ready"; paymentReference: string; amount: string; acknowledgementId: string }
  | { kind: "processing" }
  | { kind: "error"; message: string }
  | { kind: "success"; acknowledgementId: string };

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const acknowledgementId = searchParams.get("id");
  
  const [state, setState] = useState<ViewState>({ kind: "idle" });

  // Step 1: Initiate payment when component mounts
  useEffect(() => {
    if (!acknowledgementId) return;
    if (state.kind !== "idle") return;

    Promise.resolve().then(() => setState({ kind: "initiating" }));

    bookingAPI
      .initiatePayment({ acknowledgement_id: acknowledgementId })
      .then((response) => {
        setState({
          kind: "ready",
          paymentReference: response.payment_reference,
          amount: response.amount,
          acknowledgementId,
        });
      })
      .catch((err: any) => {
        setState({
          kind: "error",
          message: err.message || "Failed to initiate payment. Please try again.",
        });
      });
  }, [acknowledgementId, state.kind]);

  // Step 2: Complete payment when user confirms
  const handleCompletePayment = async () => {
    if (state.kind !== "ready") return;

    setState({ kind: "processing" });

    try {
      await bookingAPI.completePayment({
        payment_reference: state.paymentReference,
      });
      
      // Track payment completion (privacy: no reference)
      trackPaymentCompleted();
      
      setState({ kind: "success", acknowledgementId: state.acknowledgementId });
    } catch (err: any) {
      setState({ kind: "error", message: err.message || "Payment failed" });
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg-subtle)] flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full">
        
        {/* Invalid Acknowledgement ID */}
        {!acknowledgementId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-3xl p-10 text-center shadow-xl"
          >
            <div className="text-7xl mb-6">⚠️</div>
            <h2 className="font-title text-4xl text-red-800 mb-4">Invalid Payment Link</h2>
            <p className="font-body text-lg text-red-700 mb-6">
              Acknowledgement ID is missing. Please initiate payment from your email or booking status page.
            </p>
            <button
              onClick={() => router.push("/book")}
              className="bg-red-600 hover:bg-red-700 text-white font-body font-semibold px-8 py-3 rounded-full transition-all"
            >
              Go to Booking Page
            </button>
          </motion.div>
        )}

        {/* Initiating Payment */}
        {acknowledgementId && state.kind === "initiating" && (
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
            <h2 className="font-title text-4xl text-blue-800 mb-4">Initiating Payment...</h2>
            <p className="font-body text-lg text-blue-700">
              Please wait while we prepare your payment details.
            </p>
          </motion.div>
        )}

        {/* Payment UI - Ready */}
        {state.kind === "ready" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/95 rounded-3xl shadow-xl p-10"
          >
            <div className="text-center mb-8">
              <div className="text-7xl mb-6">💳</div>
              <h2 className="font-title text-4xl text-[var(--color-text-body)] mb-4">
                Complete Payment
              </h2>
              <p className="font-body text-lg text-[var(--color-text-body)]/70">
                You're almost there! Complete the payment to confirm your booking.
              </p>
            </div>

            {/* Payment Details */}
            <div className="bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary)]/10 rounded-2xl p-8 mb-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[var(--color-primary)]/20">
                <span className="font-body font-semibold text-[var(--color-text-body)]">Amount to Pay:</span>
                <span className="font-title text-3xl text-[var(--color-primary)]">₹{state.amount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-body text-[var(--color-text-body)]/60">Payment Reference:</span>
                <span className="font-mono font-bold text-[var(--color-text-body)]">{state.paymentReference}</span>
              </div>
            </div>

            {/* Dummy QR Code Placeholder */}
            <div className="bg-gray-100 rounded-2xl p-8 mb-6 text-center">
              <div className="text-8xl mb-4">📱</div>
              <p className="font-body text-sm text-gray-600 mb-2">
                Scan this QR code to pay
              </p>
              <div className="bg-white rounded-xl p-8 inline-block border-4 border-gray-300">
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                  <span className="font-body text-gray-400 text-center text-sm">
                    [Dummy QR Code]<br />
                    Payment Gateway Integration Pending
                  </span>
                </div>
              </div>
            </div>

            {/* Simulate Payment Button */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-6">
              <p className="font-body text-sm text-yellow-800 text-center mb-4">
                ⚠️ <strong>Demo Mode:</strong> This is a dummy payment gateway. Click below to simulate successful payment.
              </p>
            </div>

            <button
              onClick={handleCompletePayment}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white font-body font-semibold px-6 py-4 rounded-full transition-all shadow-lg"
            >
              ✅ Complete Payment (Demo)
            </button>

            <button
              onClick={() => router.push(`/status?id=${state.acknowledgementId}`)}
              className="w-full mt-3 bg-white hover:bg-gray-50 text-[var(--color-text-body)] font-body font-semibold px-6 py-3 rounded-full transition-all border-2 border-gray-200"
            >
              ← Go Back
            </button>
          </motion.div>
        )}

        {/* Processing */}
        {state.kind === "processing" && (
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
            <h2 className="font-title text-4xl text-blue-800 mb-4">Processing Payment...</h2>
            <p className="font-body text-lg text-blue-700">
              Please wait while we confirm your payment.
            </p>
          </motion.div>
        )}

        {/* Success */}
        {state.kind === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-3xl p-10 text-center shadow-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-7xl mb-6"
            >
              🎉
            </motion.div>
            <h2 className="font-title text-4xl text-green-800 mb-4">
              Payment Successful!
            </h2>
            <p className="font-body text-lg text-green-700 mb-6">
              Your booking is now <strong>CONFIRMED</strong>. You'll receive a confirmation email shortly with your session details.
            </p>
            <div className="bg-white/80 rounded-2xl p-6 mb-6">
              <p className="font-body text-sm text-green-700 mb-3">
                📧 Check your email for:
              </p>
              <ul className="text-left space-y-2 font-body text-sm text-green-800">
                <li>✓ Session date and time</li>
                <li>✓ Meeting link (for online sessions)</li>
                <li>✓ Calendar invite</li>
                <li>✓ Psychologist details</li>
              </ul>
            </div>
            <button
              onClick={() => {
                alert(
                  "Your booking has been confirmed. Please check your email and open the verification link to view your booking details."
                );
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-body font-semibold px-8 py-4 rounded-full transition-all shadow-lg"
            >
              Check Email for Booking Details →
            </button>
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
            <h2 className="font-title text-4xl text-red-800 mb-4">Payment Failed</h2>
            <p className="font-body text-lg text-red-700 mb-6">
              {state.message}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setState({ kind: "idle" })}
                className="bg-red-600 hover:bg-red-700 text-white font-body font-semibold px-8 py-3 rounded-full transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/book")}
                className="bg-white hover:bg-gray-50 text-red-700 border-2 border-red-200 font-body font-semibold px-8 py-3 rounded-full transition-all"
              >
                Go to Booking
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
