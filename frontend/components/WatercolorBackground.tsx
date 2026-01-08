"use client";

import { motion } from "framer-motion";

export default function WatercolorBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base soft gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/60 via-white/50 to-pink-200/50" />
      
      {/* Watercolor blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(244, 189, 194, 0.85) 0%, rgba(252, 211, 223, 0.6) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(236, 180, 193, 0.9) 0%, rgba(251, 217, 232, 0.6) 40%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
        className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(253, 237, 236, 0.6) 0%, rgba(254, 242, 242, 0.4) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.9, ease: "easeOut" }}
        className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(251, 227, 234, 0.65) 0%, rgba(252, 241, 245, 0.4) 50%, transparent 70%)",
          filter: "blur(75px)",
        }}
      />

      {/* Subtle middle cloud */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, delay: 1.2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255, 250, 250, 0.7) 0%, rgba(254, 245, 247, 0.5) 40%, transparent 65%)",
          filter: "blur(90px)",
        }}
      />

      {/* Gold shimmer particles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0.4] }}
        transition={{ duration: 3, delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-[15%] right-[20%] w-2 h-2 rounded-full bg-amber-300/60 shadow-lg shadow-amber-200/50"
        style={{ filter: "blur(1px)" }}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0.3] }}
        transition={{ duration: 4, delay: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-[45%] right-[15%] w-1.5 h-1.5 rounded-full bg-amber-400/50 shadow-md shadow-amber-200/40"
        style={{ filter: "blur(0.5px)" }}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.5] }}
        transition={{ duration: 3.5, delay: 2.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-[35%] right-[25%] w-1 h-1 rounded-full bg-yellow-300/60 shadow-sm shadow-yellow-200/50"
        style={{ filter: "blur(0.8px)" }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0.4] }}
        transition={{ duration: 3.8, delay: 1.8, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-[30%] left-[25%] w-1.5 h-1.5 rounded-full bg-amber-300/50 shadow-md shadow-amber-200/40"
        style={{ filter: "blur(1px)" }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0.3] }}
        transition={{ duration: 4.2, delay: 2.2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-[20%] left-[18%] w-2 h-2 rounded-full bg-yellow-400/55 shadow-lg shadow-yellow-200/50"
        style={{ filter: "blur(0.5px)" }}
      />

      {/* More scattered gold specs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0.3] }}
        transition={{ duration: 3.2, delay: 2.8, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-[60%] right-[35%] w-1 h-1 rounded-full bg-amber-400/45 shadow-sm shadow-amber-200/40"
        style={{ filter: "blur(0.8px)" }}
      />

      {/* Texture overlay for paper-like quality */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
    </div>
  );
}
