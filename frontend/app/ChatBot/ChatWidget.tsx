"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Type-safe Message structure
interface Message {
  text: string;
  sender: 'bot' | 'user';
  link?: string;
  options?: { label: string; link: string }[];
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Welcome to MindSettler. I'm here to guide you through your mental wellness journey. How can I assist you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Requirement: Scroll-based storytelling & smooth transitions [cite: 64, 66]
  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
  const CHATBOT_BACKEND =
  process.env.NEXT_PUBLIC_CHATBOT_BACKEND_URL ??
  "http://127.0.0.1:8000";
    try {
      const res = await fetch(`${CHATBOT_BACKEND}/api/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      setMessages(prev => [...prev, {
        text: data.reply,
        sender: 'bot',
        link: data.link,
        options: data.options
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { text: "I'm having trouble connecting. Please try again or visit our contact page.", sender: 'bot', link: '/contact' }]);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 font-body">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-28 left-6 w-80 sm:w-96 h-[550px] bg-[var(--color-bg-card)] rounded-[2rem] shadow-[0_20px_50px_rgba(229,93,128,0.15)] flex flex-col overflow-hidden border border-[var(--color-border)] mb-4"
          >
            {/* Header: Reassuring & Human  */}
            <div className="bg-[var(--color-primary)] p-6 text-[var(--color-bg-app)]">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-title font-semibold text-xl tracking-tight">MindSettler Guide</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-4 h-2 bg-[var(--color-bg-app)]/80 rounded-full animate-pulse"></span>
                    <p className="text-xs text-[var(--color-bg-app)]/90 font-light">Online & Confidential</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="bg-[var(--color-bg-app)]/20 hover:bg-[var(--color-bg-app)]/30 p-2 rounded-full transition-all text-[var(--color-bg-app)]">
                  ✕
                </button>
              </div>
            </div>

            {/* Chat Flow [cite: 69] */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gradient-to-b from-[var(--color-bg-app)]/20 to-[var(--color-bg-card)]">
              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, x: m.sender === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${m.sender === 'user'
                    ? 'bg-[var(--color-primary)] text-[var(--color-bg-app)] rounded-tr-none'
                    : 'bg-[var(--color-bg-card)] text-[var(--color-text-body)] border border-[var(--color-border)] rounded-tl-none'
                    }`}>
                    {m.text}

                    {/* CTA: Booking & Lead Gen [cite: 10, 11] */}
                    {m.link && (
                      <a href={m.link} className="block mt-3 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">
                        Take Action →
                      </a>
                    )}

                    {/* Interactive Options per Project Design [cite: 68] */}
                    {m.options && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {m.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => window.location.href = opt.link}
                            className="bg-[var(--color-bg-app)] text-[var(--color-primary)] border border-[var(--color-primary)]/20 px-4 py-2 rounded-xl text-xs font-medium hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-app)] transition-all shadow-sm"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input: Seamless Integration [cite: 68] */}
            <div className="p-5 bg-[var(--color-bg-card)] border-t border-[var(--color-border)] flex gap-3 items-center">
              <input
                className="flex-1 bg-[var(--color-bg-subtle)] p-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-[var(--color-text-body)] transition-all placeholder:text-[var(--color-text-body)]/60"
                placeholder="How are you feeling?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-[var(--color-primary)] text-[var(--color-bg-app)] w-12 h-12 rounded-2xl flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 hover:bg-[var(--color-primary-hover)]"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Single rounded chat button at bottom-left (refactor of existing guidance) */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 bg-[var(--color-primary)] w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-xl transition-all z-[220] p-0"
          aria-label="Open Chatbot"
        >
          <img src="/chatlogo.png" alt="Chatbot" className="w-6 h-6 md:w-8 md:h-8" />
        </motion.button>
      )}
    </div>
  );
}