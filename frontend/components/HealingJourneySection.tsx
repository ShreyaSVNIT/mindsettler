"use client";

import { motion } from "framer-motion";
import Orb from "@/components/Orb";
import WatercolorBackground from "@/components/WatercolorBackground";
import MagneticButton from "@/components/Button";
import { useRouter } from "next/navigation";

export default function HealingJourneySection() {
    const router = useRouter();

    return (
        <section className="relative w-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] h-[80vh] bg-[var(--color-bg-app)] overflow-hidden py-24 z-10 flex flex-col items-center justify-center">

            {/* Watercolor Background Layer */}
            <div className="absolute inset-0 z-[-1]">
                <WatercolorBackground />
            </div>

            {/* Central Glow Effect */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.7, 0.9, 0.7],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="w-[500px] h-[500px] rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 250, 240, 0.6) 25%, rgba(255, 235, 200, 0.3) 50%, transparent 70%)",
                        filter: "blur(50px)",
                        boxShadow: "0 0 100px rgba(255, 255, 255, 0.5), 0 0 150px rgba(255, 235, 200, 0.3)",
                    }}
                />
            </div>

            <div className="absolute inset-0 z-0">
                <Orb
                    hoverIntensity={1}
                    rotateOnHover={true}
                    transparent={true}
                />
            </div>

            {/* Text Overlay - Centered via Flexbox + Text Align Center */}
            <div className="relative z-20 w-[90vw] sm:w-[80vw] md:w-[600px] lg:w-[700px] max-w-[90vw] mx-auto text-center pointer-events-none px-4">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="font-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[var(--color-text-body)] leading-tight drop-shadow-sm"
                >
                    Healing happens in <br /> <span className="text-[var(--color-primary)] italic">circles,</span> not <span className="text-[var(--color-primary)] italic">lines.</span>
                    <br />
                    You&apos;ll return to <span className="text-[var(--color-primary)] italic">old </span> <br /> places with <span className="text-[var(--color-primary)] italic">new eyes.</span>
                </motion.h2>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-8 md:mt-10 lg:mt-12 pointer-events-auto flex justify-center"
                >
                        <MagneticButton
                            text="BOOK A SESSION"
                            href="/book"
                        />
                </motion.div>
            </div>
        </section>
    );
}
