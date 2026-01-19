"use client";

import { useEffect, useState, Suspense } from "react";
import BookingCard, { BookingPrimaryButton, BookingSecondaryButton } from "@/components/BookingCard";
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
    <main className="min-h-screen bg-[var(--color-bg-subtle)] flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full relative">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute w-80 h-80 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            style={{ top: '-120px', left: '50%', transform: 'translateX(-50%)' }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full bg-purple-400/10 blur-3xl"
            animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
            style={{ bottom: '-120px', left: '50%', transform: 'translateX(-50%)' }}
          />
        </div>
        
        {/* Invalid Acknowledgement ID */}
        {!acknowledgementId && (
          <BookingCard>
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-body)] mb-4">Invalid Payment Link</h2>
            <p className="font-body text-lg text-[var(--color-text-body)] mb-6">
              Acknowledgement ID is missing. Please initiate payment from your email or booking status page.
            </p>
            <BookingSecondaryButton onClick={() => router.push("/book")}>
              Go to Booking Page
            </BookingSecondaryButton>
          </BookingCard>
        )}

        {/* Initiating Payment */}
        {acknowledgementId && state.kind === "initiating" && (
          <BookingCard>
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-body)] mb-4">Initiating Payment...</h2>
            <p className="font-body text-lg text-[var(--color-text-body)]">
              Please wait while we prepare your payment details.
            </p>
          </BookingCard>
        )}

        {/* Payment UI - Ready */}
        {state.kind === "ready" && (
          <BookingCard className="text-center" variant="white">
            <div className="text-center mb-8">
              <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-body)] mb-4">Complete Payment</h2>
              <p className="font-body text-lg text-[var(--color-text-body)]/70">
                You're almost there! Complete the payment to confirm your booking.
              </p>
            </div>
            
            {/* Payment Details */}
            <div className="bg-gradient-to-br from-[var(--color-text-body)]/5 to-[var(--color-text-body)]/10 rounded-2xl p-8 mb-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[var(--color-text-body)]/20">
                <span className="font-body font-semibold text-[var(--color-text-body)]">Amount to Pay:</span>
                <span className="font-title text-3xl text-[var(--color-text-body)]">₹{state.amount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-body text-[var(--color-text-body)]/60">Payment Reference:</span>
                <span className="font-mono font-bold text-[var(--color-text-body)]">{state.paymentReference}</span>
              </div>
            </div>

            {/* Dummy QR Code Placeholder */}
            <div className="bg-gray-100 rounded-2xl p-8 mb-6 text-center">
              <p className="font-body text-sm text-gray-600 mb-2">Scan this QR code to pay</p>
              <div className="bg-white rounded-xl p-8 inline-block border-4 border-gray-300">
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                  <span className="font-body text-gray-400 text-center text-sm">
                    [Dummy QR Code]\nPayment Gateway Integration Pending
                  </span>
                </div>
              </div>
            </div>

            {/* Simulate Payment Button */}
            <div className="bg-[var(--color-bg-lavender)] border-2 border-[var(--color-text-body)]/20 rounded-2xl p-6 mb-6">
              <p className="font-body text-sm text-[var(--color-text-body)] text-center mb-4">
                <strong>Demo Mode:</strong> This is a dummy payment gateway. Click below to simulate successful payment.
              </p>
            </div>

            <BookingPrimaryButton onClick={handleCompletePayment}>
              Complete Payment (Demo)
            </BookingPrimaryButton>

            <BookingSecondaryButton onClick={() => router.push(`/status?id=${state.acknowledgementId}`)}>
              ← Go Back
            </BookingSecondaryButton>
          </BookingCard>
        )}

        {/* Processing */}
        {state.kind === "processing" && (
          <BookingCard>
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-body)] mb-4">Processing Payment...</h2>
            <p className="font-body text-lg text-[var(--color-text-body)]">Please wait while we confirm your payment.</p>
          </BookingCard>
        )}

        {/* Success */}
        {state.kind === "success" && (
          <BookingCard className="text-center">
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-body)] mb-4">Payment Successful!</h2>
            <p className="font-body text-lg text-[var(--color-text-body)] mb-6">
              Your booking is now <strong>CONFIRMED</strong>. You'll receive a confirmation email shortly with your session details.
            </p>
            <div className="bg-white/80 rounded-2xl p-6 mb-6">
              <p className="font-body text-sm text-[var(--color-text-body)] mb-3">Check your email for:</p>
              <ul className="text-left space-y-2 font-body text-sm text-[var(--color-text-body)]">
                <li>Session date and time</li>
                <li>Meeting link (for online sessions)</li>
                <li>Calendar invite</li>
                <li>Psychologist details</li>
              </ul>
            </div>
            <BookingPrimaryButton
              onClick={() => {
                alert(
                  "Your booking has been confirmed. Please check your email and open the verification link to view your booking details."
                );
              }}
            >
              Check Email for Booking Details
            </BookingPrimaryButton>
          </BookingCard>
        )}

        {/* Error */}
        {state.kind === "error" && (
          <BookingCard>
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-body)] mb-4">Payment Failed</h2>
            <p className="font-body text-lg text-[var(--color-text-body)] mb-6">{state.message}</p>
            <div className="flex gap-3 justify-center">
              <div className="flex flex-col gap-3 w-full">
                <BookingPrimaryButton onClick={() => setState({ kind: "idle" })}>
                  Try Again
                </BookingPrimaryButton>
                <BookingSecondaryButton onClick={() => router.push("/book")}>Go to Booking</BookingSecondaryButton>
              </div>
            </div>
          </BookingCard>
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
