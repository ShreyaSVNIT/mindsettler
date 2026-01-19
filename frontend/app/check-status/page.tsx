"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import BookingCard, { BookingPrimaryButton } from "@/components/BookingCard";
import TitleHeader from "@/components/TitleHeader";
import { BACKEND_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CheckStatusPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCheckStatus = async () => {
    setLoading(true);
    setError("");
    setStatus(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/bookings/check-status/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.has_booking === false) {
        setStatus("No active booking found.");
        return;
      }

      // Booking exists → backend has sent verification email
      setStatus("A verification email has been sent. Please check your inbox to continue.");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl relative">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute w-72 h-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" animate={{ x: [0, 40, 0], y: [0, -40, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} style={{ top: '-96px', left: '50%', transform: 'translateX(-50%)' }} />
          <motion.div className="absolute w-72 h-72 rounded-full bg-purple-400/10 blur-3xl" animate={{ x: [0, -40, 0], y: [0, 40, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} style={{ bottom: '-96px', left: '50%', transform: 'translateX(-50%)' }} />
        </div>
        <TitleHeader
          subheader="CHECK BOOKING STATUS"
          title={
            <>
              <span className="italic">Check your </span>
              <span className="italic text-[var(--color-primary)]">session status</span>
            </>
          }
          description="Enter your email to see if you have an active booking or to resend your verification link."
          alignment="center"
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[var(--color-bg-lavender)] rounded-3xl shadow-2xl p-8 md:p-12 border border-[var(--color-primary)]/20 max-w-2xl mx-auto mt-20"
        >
          <label className="block mb-4 font-body text-lg text-[var(--color-text-body)]">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-primary)]/20 focus:outline-none focus:border-[var(--color-primary)] transition-all font-body text-base mb-6 bg-white"
            placeholder="mindsettler.dev@gmail.com"
          />
          <div className="flex justify-center">
            <BookingPrimaryButton onClick={!(loading || !email) ? handleCheckStatus : undefined}>
              {loading ? "Checking..." : "Check Status"}
            </BookingPrimaryButton>
          </div>
          {status && (
            <p className="mt-6 text-lg font-body text-[var(--color-primary)] text-center">{status}</p>
          )}
          {error && (
            <p className="mt-6 text-lg font-body text-red-500 text-center">{error}</p>
          )}
        </motion.div>
        </div>
    </main>
  );
}
