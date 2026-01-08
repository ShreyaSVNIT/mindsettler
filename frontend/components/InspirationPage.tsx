'use client';

import React, { useMemo, useRef } from 'react';
import { ArrowRight, ArrowUp, Play, ExternalLink } from 'lucide-react';
import { Imbue, Playfair_Display } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Resource } from '@/src/data/resources';

// --- Fonts Configuration ---
const imbue = Imbue({
    subsets: ['latin'],
    variable: '--font-title',
    weight: ['100', '400', '700', '900'],
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-body',
    weight: ['400', '600', '700'],
});

interface InspirationPageProps {
    data: Resource[];
    title: string;
    description: string;
    heroImage: string;
    overlayColor?: string;
    isActive?: boolean;
}

export default function InspirationPage({
    data,
    title,
    description,
    heroImage,
    overlayColor = 'transparent',
    isActive = true,
}: InspirationPageProps) {


    const sectionRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end end'],
    });

    // Stronger parallax for the sticky hero: track when this section enters/leaves the viewport.
    const { scrollYProgress: parallaxProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.2 });
    const heroImageY = useTransform(parallaxProgress, [0, 1], ['6%', '-18%']);
    // Start slightly above center, end at center (never goes below the middle).
    const heroTextY = useTransform(parallaxProgress, [0, 1], ['-18%', '0%']);

    const feedContainer = useMemo(
        () => ({
            hidden: {},
            show: {
                transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.05,
                },
            },
        }),
        []
    );

    const feedItem = useMemo(
        () => ({
            hidden: { opacity: 0, y: 28 },
            show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
        }),
        []
    );

    return (
        <div
            className={`${imbue.variable} ${playfair.variable} font-body selection:bg-[var(--color-primary)] selection:text-white`}
            style={{
                '--color-primary': '#E37383',
                '--color-primary-hover': '#eb81a5',
                '--color-bg-app': '#F9D1D5',
                '--color-bg-lavender': '#F2ECF2',
                '--color-bg-card': '#ffffff',
                '--color-bg-subtle': '#faf9fb',
                '--color-text-body': '#453859',
                '--color-border': '#e8e6eb',
            } as React.CSSProperties}
        >
            {/* Main Grid Container */}
            <div ref={sectionRef} className="flex flex-col lg:grid lg:grid-cols-2 relative">

                {/* --- Sticky Hero Section (LEFT) --- 
                    lg:order-1 ensures it is on the left
                */}
                <div className="relative w-full h-[60vh] lg:h-screen lg:sticky lg:top-0 bg-[var(--color-bg-app)] overflow-hidden lg:order-1">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <motion.img
                            src={heroImage}
                            alt={title}
                            className="absolute inset-0 w-full h-[130%] object-cover"
                            style={{ y: heroImageY }}
                        />
                        {/* Optional overlay (default: transparent) */}
                        <div className="absolute inset-0" style={{ backgroundColor: overlayColor }}></div>
                    </div>

                    {/* Centered Typography Overlay */}
                    <motion.div
                        className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 lg:px-12"
                        style={{ y: heroTextY }}
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="font-title text-[var(--color-bg-subtle)] font-medium leading-[0.85] tracking-tight drop-shadow-xl select-none"
                        >
                            <span className="block text-6xl lg:text-9xl mb-4 font-bold mix-blend-overlay opacity-90">{title}</span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="mt-4 text-white text-xl lg:text-2xl max-w-md font-body italic drop-shadow-md hidden lg:block opacity-90"
                        >
                            {description}
                        </motion.p>
                    </motion.div>
                </div>

                {/* --- Scrollable Content Feed (RIGHT) --- 
                    lg:order-2 ensures it is on the right
                */}
                <div className="relative w-full bg-[var(--color-bg-app)] px-6 py-12 lg:px-16 lg:py-20 text-[var(--color-text-body)] lg:order-2">

                    {/* Mobile Header */}
                    <div className="lg:hidden mb-12 border-b border-[var(--color-border)] pb-8">
                        <h2 className="font-title text-5xl mb-4 font-normal">{title}</h2>
                        <p className="opacity-80 text-lg">{description}</p>
                    </div>

                    {/* Resources Feed */}
                    <motion.div
                        className="space-y-16"
                        variants={feedContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-10%" }}
                    >
                        {data.map((resource) => (
                            <motion.article
                                key={resource.id}
                                variants={feedItem}
                                className="group cursor-pointer"
                            >
                                <div className="max-w-lg mx-auto">
                                    <Link href={resource.type === 'link' && resource.externalUrl ? resource.externalUrl : `/resources/${resource.id}`} target={resource.type === 'link' ? '_blank' : undefined} className="block relative h-[300px] lg:h-[400px] overflow-hidden rounded-sm">

                                        {/* Background Image */}
                                        <div className="absolute inset-0">
                                            <Image
                                                src={resource.imageUrl}
                                                alt={resource.title}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                        </div>

                                        {/* Tag Above Image */}
                                        <div className="absolute top-6 left-6 z-10">
                                            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.25em] uppercase bg-white/90 text-[var(--color-text-body)] rounded-full">
                                                {resource.type}
                                            </span>
                                        </div>

                                        {/* Content Container - slides up on hover */}
                                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8 transition-all duration-700 ease-out">
                                            {/* Title (Always Visible) */}
                                            <h2 className="font-title text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-0 transition-all duration-700">
                                                {resource.title}
                                            </h2>

                                            {/* Description + CTA (Fade in on hover) */}
                                            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-out">
                                                <div className="overflow-hidden">
                                                    <div className="max-w-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-150 pointer-events-none pt-2">
                                                        <p className="text-white/90 text-base lg:text-lg mt-6 mb-8 font-body leading-relaxed">
                                                            {resource.description}
                                                        </p>
                                                        <div className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--color-text-body)] font-bold text-sm uppercase tracking-[0.2em] rounded-full border-2 border-white transition-all pointer-events-auto">
                                                            {resource.type === 'video' ? (
                                                                <>
                                                                    <Play className="w-4 h-4" />
                                                                    Watch Now
                                                                </>
                                                            ) : resource.type === 'link' ? (
                                                                <>
                                                                    <ExternalLink className="w-4 h-4" />
                                                                    Visit Link
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ArrowRight className="w-4 h-4" />
                                                                    Read More
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Metadata Below Card */}
                                    <div className="flex items-center justify-between pt-4 text-base">
                                        <span className="text-[var(--color-text-body)] opacity-90 font-semibold">
                                            {resource.date}
                                        </span>
                                        {resource.author && (
                                            <span className="text-[var(--color-text-body)] opacity-75 italic">
                                                by {resource.author}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>


                </div>

            </div>
        </div>
    );
}
