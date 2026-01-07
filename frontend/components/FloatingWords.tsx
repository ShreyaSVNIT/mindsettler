"use client";

import { motion } from "framer-motion";

const words = [
    { text: "Journey", top: "5%", left: "5%", delay: 0 },
    { text: "Time", top: "10%", left: "85%", delay: 1 },
    { text: "Growth", top: "85%", left: "10%", delay: 2 },
    { text: "Patience", top: "90%", left: "80%", delay: 3 },
    { text: "Process", top: "40%", left: "2%", delay: 1.5 },
    { text: "Change", top: "50%", left: "88%", delay: 2.5 },
    { text: "Path", top: "5%", left: "45%", delay: 0.5 },
    { text: "Cycles", top: "92%", left: "40%", delay: 3.5 },
    { text: "Reflect", top: "25%", left: "20%", delay: 0.8 },
    { text: "Evolve", top: "65%", left: "75%", delay: 2.2 },
    { text: "Breathe", top: "75%", left: "25%", delay: 1.2 },
    { text: "Stillness", top: "20%", left: "70%", delay: 2.8 },
];

export default function FloatingWords() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {words.map((word, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.3 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, delay: word.delay }}
                    className="absolute font-title text-4xl md:text-6xl text-[var(--color-text-body)] blur-[3px]"
                    style={{ top: word.top, left: word.left }}
                >
                    {word.text}
                </motion.div>
            ))}
        </div>
    );
}
