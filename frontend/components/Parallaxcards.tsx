"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const DATA = [
  {
    id: 1,
    title: "Food Service",
    description: "Deliver meals that look good, travel well and impress customers with attention to detail. We help you customise packaging to match your food's quality.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2000",
  },
  {
    id: 2,
    title: "Food Processing",
    description: "Optimize efficiency and maintain hygiene standards in our bulk custom and polyquality control systems designed for scale.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000",
  },
  {
    id: 3,
    title: "Agriculture",
    description: "Innovative packaging for fresh produce, reducing waste and enhancing quality control from the farm to the table.",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2000",
  },
];

export default function ParallaxCards() {
  const [activeId, setActiveId] = useState(1);
  const containerRef = useRef(null);

  // Parallax Logic: Background moves at a ratio of 0.2 to the scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[140vh] flex items-center justify-center overflow-hidden bg-[#1a1a1a]"
    >
      {/* BACKGROUND IMAGE LAYER */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{ y: backgroundY }}
            className="absolute inset-0 w-full h-[120%]"
          >
            <img
              src={DATA.find((item) => item.id === activeId)?.image}
              className="w-full h-full object-cover brightness-[0.7]"
              alt="background"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CARDS LAYER */}
      <div className="relative z-10 flex items-center justify-center gap-8 w-full max-w-7xl px-6">
        {DATA.map((card) => {
          const isActive = activeId === card.id;
          
          return (
            <motion.div
              key={card.id}
              onMouseEnter={() => setActiveId(card.id)}
              layout // This makes the size change fluid
              initial={false}
              animate={{
                width: isActive ? 520 : 320,
                height: isActive ? 520 : 320,
              }}
              transition={{
                type: "spring",
                stiffness: 150, // Reduced stiffness for "heavier" feel
                damping: 25,
                mass: 1.2
              }}
              className={`relative rounded-[40px] overflow-hidden flex flex-col p-10 cursor-pointer shadow-2xl
                ${isActive ? "bg-[#fcf9f1] text-gray-900" : "bg-white/10 backdrop-blur-xl text-white border border-white/20"}`}
            >
              {/* Card Content */}
              <motion.div layout className="flex flex-col h-full">
                <motion.h2 
                  layout="position"
                  className={`font-medium tracking-tight ${isActive ? "text-4xl mb-6" : "text-2xl mt-auto text-center"}`}
                >
                  {card.title}
                </motion.h2>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="flex flex-col h-full"
                    >
                      <p className="text-lg leading-relaxed opacity-70">
                        {card.description}
                      </p>
                      
                      <div className="mt-auto pt-8 border-t border-black/10 flex justify-between items-center">
                        <span className="text-lg font-semibold uppercase tracking-wider">Tell me more</span>
                        <div className="p-3 bg-black text-white rounded-full">
                           <ArrowRight size={24} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}