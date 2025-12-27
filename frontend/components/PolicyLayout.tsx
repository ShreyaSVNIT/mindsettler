"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type PolicyLayoutProps = {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
};

export default function PolicyLayout({
  title,
  lastUpdated,
  children,
}: PolicyLayoutProps) {
  return (
    <main className="min-h-screen bg-[var(--color-bg-app)] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="relative z-10 px-6 py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[var(--color-primary)]/30 bg-white/50 backdrop-blur-sm hover:border-[var(--color-primary)]/50 transition-all group">
              <span className="text-[var(--color-primary)] text-xs font-bold tracking-wider uppercase">← Back to Home</span>
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-title text-5xl md:text-6xl lg:text-7xl text-[var(--color-text-body)] mb-4 leading-tight"
          >
            {title}
          </motion.h1>

          {lastUpdated && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-[var(--color-text-body)]/60 font-body text-sm tracking-wide"
            >
              Last updated: {lastUpdated}
            </motion.p>
          )}
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 lg:p-16 border border-[var(--color-border)] shadow-2xl shadow-[var(--color-primary)]/5"
        >
          <div className="prose prose-lg max-w-none policy-content">
            {children}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .policy-content p {
          color: var(--color-text-body);
          font-family: var(--font-body);
          line-height: 1.8;
          margin-bottom: 1.5rem;
          font-size: 1.0625rem;
        }
        
        .policy-content h2 {
          color: var(--color-primary);
          font-family: var(--font-title);
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          line-height: 1.2;
        }
        
        .policy-content h2:first-of-type {
          margin-top: 0;
        }
        
        .policy-content h3 {
          color: var(--color-text-body);
          font-family: var(--font-title);
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .policy-content ul {
          margin: 1.5rem 0;
          padding-left: 0;
          list-style: none;
        }
        
        .policy-content ul li {
          position: relative;
          padding-left: 2rem;
          margin-bottom: 0.75rem;
          color: var(--color-text-body);
          font-family: var(--font-body);
          line-height: 1.7;
        }
        
        .policy-content ul li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.65em;
          width: 8px;
          height: 8px;
          background: var(--color-primary);
          border-radius: 50%;
          opacity: 0.7;
        }
        
        .policy-content ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
          color: var(--color-text-body);
        }
        
        .policy-content ol li {
          margin-bottom: 0.75rem;
          font-family: var(--font-body);
          line-height: 1.7;
        }
        
        .policy-content strong {
          color: var(--color-primary);
          font-weight: 600;
        }
        
        .policy-content a {
          color: var(--color-primary);
          text-decoration: underline;
          text-decoration-color: var(--color-primary);
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
          transition: all 0.2s;
        }
        
        .policy-content a:hover {
          color: var(--color-primary-hover);
          text-decoration-color: var(--color-primary-hover);
        }
      `}</style>
    </main>
  );
}
