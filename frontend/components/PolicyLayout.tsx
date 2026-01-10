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
    <main className="min-h-screen" style={{ background: '#FCEBED' }}>
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
            <Link href="/" aria-label="Back to Home" className="group flex items-center gap-2 px-2 py-1 rounded-full bg-transparent hover:bg-white/40 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L10 14L18 22" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all group-hover:fill-[var(--color-primary)]" />
              </svg>
              <span className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-body)] group-hover:text-[var(--color-primary)] transition-colors">Back to Home</span>
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
        .policy-content > * + * {
          margin-top: 2.5rem;
        }
        .policy-content p {
          color: var(--color-text-body);
          font-family: var(--font-body);
          line-height: 1.8;
          margin-bottom: 1.5rem;
          font-size: 1.0625rem;
        }
        
        .policy-content h2 {
          color: var(--color-text-secondary);
          font-family: var(--font-title);
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          line-height: 1.2;
          position: relative;
        }
        .policy-content h2:not(:first-child)::before {
          content: "";
          display: block;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--color-border) 50%, transparent 100%);
          margin-bottom: 2rem;
          margin-top: 2rem;
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
