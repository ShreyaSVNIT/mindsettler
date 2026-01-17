"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import BookingCard from "@/components/BookingCard";
import TitleHeader from "@/components/TitleHeader";
import MagneticButton from "@/components/Button";
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
        title={<span className="italic">Check your session status</span>}
        description="Enter your email to see if you have an active booking or to resend your verification link."
        alignment="center"
      />
      <BookingCard className="mx-auto mt-8" variant="white">
        <label className="block mb-4 font-body text-lg text-[var(--color-text-body)]">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-body text-base mb-6"
          placeholder="mindsettler.dev@gmail.com"
        />
        <MagneticButton
          text={loading ? "Checking..." : "Check Status"}
          onClick={!(loading || !email) ? handleCheckStatus : undefined}
        />
        {status && (
          <p className="mt-6 text-lg font-body text-[var(--color-primary)] text-center">{status}</p>
        )}
        {error && (
          <p className="mt-6 text-lg font-body text-red-500 text-center">{error}</p>
        )}
      </BookingCard>
        </div>
    </main>
  );
}
