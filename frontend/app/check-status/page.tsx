"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import TitleHeader from "@/components/TitleHeader";
import MagneticButton from "@/components/Button";

export default function CheckStatusPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckStatus = async () => {
    setLoading(true);
    setError("");
    setStatus(null);
    try {
      const res = await fetch("/api/bookings/check-status/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.message) {
        setStatus(data.message);
      } else if (data.has_booking === false) {
        setStatus("No active booking found.");
      } else {
        setStatus("Unknown response.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-24">
      <TitleHeader
        subheader="CHECK BOOKING STATUS"
        title={<span className="italic">Check your session status</span>}
        description="Enter your email to see if you have an active booking or to resend your verification link."
        alignment="center"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8"
      >
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
      </motion.div>
    </main>
  );
}
