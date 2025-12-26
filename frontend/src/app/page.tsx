"use client"; // Required for components that use Framer Motion or State

import ChatWidget from './components/ChatWidget';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#334155] font-sans selection:bg-[#5DA7DB]/30">
      
      {/* 1. Hero Section: Emotional Reassurance */}
      <section className="relative h-screen flex flex-col justify-center items-center px-6 text-center bg-gradient-to-b from-blue-50 to-white">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-[#334155]"
        >
          MindSettler
        </motion.h1>
        {/* <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl max-w-2xl font-light text-[#64748b]"
        >
          Understand your mental health and navigate life challenges through structured psycho-education and personalized support.
        </motion.p> */}
        
        {/* Requirement: Clear flow guiding users toward booking */}
        {/* <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10"
        >
          <a 
            href="/booking" 
            className="bg-[#5DA7DB] text-white px-8 py-4 rounded-full font-medium hover:shadow-lg hover:shadow-[#5DA7DB]/40 transition-all active:scale-95"
          >
            Book Your First Session
          </a>
        </motion.div> */}
      </section>

      {/* 2. Journey Section (Visual Placeholder) */}
      {/* <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">Your Path to Well-being</h2>
        <div className="h-[400px] border-2 border-dashed border-gray-100 rounded-[3rem] flex items-center justify-center bg-gray-50/50">
          <p className="text-gray-400 italic">
            Interactive Journey Design (Roadmap/Mountain/River Concept) goes here.
          </p>
        </div>
      </section> */}

      {/* 3. Core Features Section */}
      {/* <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-[#5DA7DB]">Awareness</h3>
            <p className="text-sm text-[#64748b]">Educational content explaining mental health concepts in simple, accessible language.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-[#5DA7DB]">Confidentiality</h3>
            <p className="text-sm text-[#64748b]">A safe and confidential environment for all online and offline sessions.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-[#5DA7DB]">Guidance</h3>
            <p className="text-sm text-[#64748b]">Personalized support tailored to your unique journey from booking to session completion.</p>
          </div>
        </div>
      </section> */}

      {/* 4. The Integrated Chatbot */}
      {/* This component will now stay visible as the user scrolls */}
      <ChatWidget />

      {/* Footer: Legal & Policy Pages */}
      {/* <footer className="p-12 border-t border-gray-100 text-center text-xs text-gray-400 space-x-6">
        <a href="/privacy-policy" className="hover:text-[#5DA7DB]">Privacy Policy</a>
        <a href="/non-refund-policy" className="hover:text-[#5DA7DB]">Non-Refund Policy</a>
        <a href="/confidentiality-policy" className="hover:text-[#5DA7DB]">Confidentiality Policy</a>
      </footer> */}
    </main>
  );
}