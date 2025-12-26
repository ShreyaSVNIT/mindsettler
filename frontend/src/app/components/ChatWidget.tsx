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

    try {
      const res = await fetch('http://127.0.0.1:8000/api/chat/', {
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
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="w-80 sm:w-96 h-[550px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border border-blue-50"
          >
            {/* Header: Reassuring & Human  */}
            <div className="bg-[#5DA7DB] p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-xl tracking-tight">MindSettler Guide</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                    <p className="text-xs text-blue-50 font-light">Online & Confidential</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all text-white">
                  ✕
                </button>
              </div>
            </div>

            {/* Chat Flow [cite: 69] */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gradient-to-b from-blue-50/30 to-white">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: m.sender === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                    m.sender === 'user' 
                      ? 'bg-[#5DA7DB] text-white rounded-tr-none' 
                      : 'bg-white text-[#334155] border border-gray-100 rounded-tl-none'
                  }`}>
                    {m.text}

                    {/* CTA: Booking & Lead Gen [cite: 10, 11] */}
                    {m.link && (
                      <a href={m.link} className="block mt-3 text-xs font-bold uppercase tracking-widest text-[#5DA7DB] hover:text-[#4A90E2] transition-colors">
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
                            className="bg-blue-50 text-[#5DA7DB] border border-[#5DA7DB]/20 px-4 py-2 rounded-xl text-xs font-medium hover:bg-[#5DA7DB] hover:text-white transition-all shadow-sm"
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
            <div className="p-5 bg-white border-t border-gray-50 flex gap-3 items-center">
              <input 
                className="flex-1 bg-gray-50 p-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#5DA7DB]/20 text-gray-600 transition-all placeholder:text-gray-400"
                placeholder="How are you feeling?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend} 
                className="bg-[#5DA7DB] text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle: Calm & Interactive [cite: 66] */}
      {!isOpen && (
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-[#5DA7DB] text-white px-6 py-4 rounded-full shadow-[0_10px_30px_rgba(93,167,219,0.4)] flex items-center gap-3 group"
        >
          <span className="font-semibold tracking-wide">Guidance</span>
          <span className="text-xl group-hover:rotate-12 transition-transform">💬</span>
        </motion.button>
      )}
    </div>
  );
}