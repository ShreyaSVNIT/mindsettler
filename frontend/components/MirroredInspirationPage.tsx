'use client';

import React from 'react';
import { ArrowRight, ArrowUp, Play, ExternalLink } from 'lucide-react';
import { Imbue, Playfair_Display } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
}

export default function MirroredInspirationPage({
    data,
    title,
    description,
    heroImage,
    overlayColor = 'rgba(69, 56, 89, 0.4)'
}: InspirationPageProps) {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
            <div className="flex flex-col lg:grid lg:grid-cols-2 relative">

                {/* --- Scrollable Content Feed (LEFT) --- 
                    lg:order-1 ensures it is on the LEFT
                */}
                <div className="w-full bg-[var(--color-bg-lavender)] px-6 py-12 lg:px-16 lg:py-20 text-[var(--color-text-body)] lg:order-1">

                    {/* Mobile Header */}
                    <div className="lg:hidden mb-12 border-b border-[var(--color-border)] pb-8">
                        <h2 className="font-title text-5xl mb-4 font-normal">{title}</h2>
                        <p className="opacity-80 text-lg">{description}</p>
                    </div>

                    {/* Resources Feed */}
                    <div className="space-y-20">
                        {data.map((resource) => (
                            <motion.article
                                key={resource.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-10%" }}
                                className="group cursor-pointer"
                            >
                                <Link href={resource.type === 'link' && resource.externalUrl ? resource.externalUrl : `/resources/${resource.id}`} target={resource.type === 'link' ? '_blank' : undefined}>

                                    {/* Image Container */}
                                    <div className="overflow-hidden mb-6 aspect-[16/9] relative bg-[var(--color-bg-subtle)] shadow-md rounded-sm">
                                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 text-xs font-bold tracking-wider uppercase z-10 text-[var(--color-text-body)] shadow-sm border border-[var(--color-border)]">
                                            {resource.type}
                                        </div>
                                        <Image
                                            src={resource.imageUrl}
                                            alt={resource.title}
                                            fill
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        {resource.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
                                                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center pl-1 group-hover:scale-110 transition-transform duration-300">
                                                    <Play className="w-6 h-6 text-[var(--color-primary)] fill-current" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 mb-2">
                                            <span className="text-xs text-[var(--color-primary)] uppercase tracking-wide font-bold">
                                                {resource.date}
                                            </span>
                                            {resource.author && (
                                                <span className="text-xs text-gray-400 font-serif italic">
                                                    by {resource.author}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-title text-4xl lg:text-5xl leading-[0.95] group-hover:text-[var(--color-primary)] transition-colors font-medium">
                                            {resource.title}
                                        </h3>

                                        <p className="text-[var(--color-text-body)] opacity-70 font-body text-lg leading-relaxed line-clamp-3">
                                            {resource.description}
                                        </p>

                                        <div className="pt-4">
                                            <span className="inline-flex items-center text-xs font-bold tracking-widest uppercase border-b-2 border-transparent group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)] transition-all pb-1">
                                                {resource.type === 'video' ? 'Watch Now' : resource.type === 'link' ? 'Visit Link' : 'Read Article'}
                                                {resource.type === 'link' ? <ExternalLink className="ml-2 w-3 h-3" /> : <ArrowRight className="ml-2 w-3 h-3" />}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </div>

                    <div className="flex justify-center lg:justify-end mt-24">
                        <button
                            onClick={scrollToTop}
                            className="flex items-center gap-2 bg-[var(--color-bg-card)] text-[var(--color-text-body)] text-xs font-bold uppercase tracking-widest px-6 py-4 shadow-lg hover:bg-[var(--color-primary)] hover:text-white transition-all border border-[var(--color-border)] rounded-full lg:rounded-none"
                        >
                            Back to Top <ArrowUp className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* --- Sticky Hero Section (RIGHT) --- 
                    lg:order-2 ensures it is on the RIGHT
                */}
                <div className="relative w-full h-[60vh] lg:h-screen lg:sticky lg:top-0 bg-[var(--color-bg-app)] overflow-hidden lg:order-2">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={heroImage}
                            alt={title}
                            className="w-full h-full object-cover brightness-[0.9] saturate-[0.8]"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0" style={{ backgroundColor: overlayColor }}></div>
                    </div>

                    {/* Centered Typography Overlay */}
                    <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 lg:px-12">
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
                    </div>
                </div>

            </div>
        </div>
    );
}
