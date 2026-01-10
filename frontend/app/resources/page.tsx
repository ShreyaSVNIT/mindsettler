'use client';

import { motion } from 'framer-motion';
import { resources } from '@/src/data/resources';
import TitleHeader from '@/components/TitleHeader';
import ContentGrid from '@/components/ContentGrid';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Play } from 'lucide-react';

export default function ResourcesPage() {
    const blogs = resources.filter(r => r.type === 'blog');
    const articles = resources.filter(r => r.type === 'article');
    const videos = resources.filter(r => r.type === 'video');
    const links = resources.filter(r => r.type === 'link');

    const featured = [
        blogs[0],
        articles[0],
        videos[0],
        blogs[1],
        links[0],
        articles[1],
    ].filter(Boolean);

    return (
        <main className="min-h-screen bg-[var(--color-bg-app)]">

            {/* Hero Section */}
            <section className="relative px-6 py-24 md:py-32 text-center bg-[var(--color-bg-app)]">
                <TitleHeader
                    subheader="Resources"
                    title={<><span className="block">Resources</span><span className="block text-[var(--color-primary)] italic mt-2">for your Mind</span></>}
                    description="Curated content to support your mental wellness journey. Explore articles, videos, and tools designed to help you thrive."
                    alignment="center"
                />

                {/* Optional Decorative Element */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="w-24 h-1 bg-[var(--color-primary)] mx-auto mt-12 rounded-full"
                />
            </section>

            <section className="px-6 pb-10">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <div className="text-[var(--color-primary)] text-sm tracking-[0.5em] uppercase font-playfair font-bold">
                            Featured
                        </div>
                        <div className="mt-3 font-title text-4xl md:text-5xl text-[var(--color-text-body)]">
                            Handpicked for you
                        </div>
                        <div className="mt-3 text-[var(--color-text-body)]/70 font-body text-base md:text-lg max-w-2xl">
                            Start here — a quick selection of our most popular reads, videos, and trusted links.
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3 lg:auto-rows-[220px]">
                        {featured.map((item, idx) => {
                            const isVideo = item.type === 'video';
                            const isLink = item.type === 'link';
                            const href = isLink && item.externalUrl ? item.externalUrl : `/resources/${item.id}`;
                            const external = isLink;

                            const spans = [
                                'lg:row-span-2',
                                'lg:row-span-1',
                                'lg:row-span-2',
                                'lg:row-span-1',
                                'lg:row-span-2',
                                'lg:row-span-1',
                            ];

                            const themes = [
                                'bg-[var(--color-bg-card)]',
                                'bg-[var(--color-text-body)]',
                                'bg-[var(--color-primary)]/20',
                                'bg-[var(--color-text-body)]',
                                'bg-[var(--color-bg-card)]',
                                'bg-[var(--color-bg-card)]',
                            ];

                            const theme = themes[idx] ?? 'bg-[var(--color-bg-card)]';
                            const textColor = theme.includes('text-body') ? 'text-white' : 'text-[var(--color-text-body)]';
                            const mutedText = theme.includes('text-body') ? 'text-white/70' : 'text-[var(--color-text-body)]/70';
                            const chipBg = theme.includes('text-body') ? 'bg-white/15 text-white' : 'bg-[var(--color-bg-subtle)] text-[var(--color-primary)]';

                            return (
                                <Link
                                    key={item.id}
                                    href={href}
                                    target={external ? '_blank' : undefined}
                                    rel={external ? 'noopener noreferrer' : undefined}
                                    className={`group relative overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${spans[idx] ?? ''} ${theme}`}
                                >
                                    <div className="absolute inset-0">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.title}
                                            fill
                                            className={`object-cover transition-transform duration-700 ${theme.includes('bg-card') ? 'opacity-100' : 'opacity-40'} group-hover:scale-[1.03]`}
                                        />
                                        <div className={`absolute inset-0 ${theme.includes('text-body') ? 'bg-gradient-to-t from-black/70 via-black/30 to-transparent' : 'bg-gradient-to-t from-white/80 via-white/10 to-transparent'}`} />
                                    </div>

                                    <div className="relative z-10 h-full w-full p-6 flex flex-col justify-between">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${chipBg}`}>
                                                {item.type.toUpperCase()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {isVideo && (
                                                    <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center border border-white/10">
                                                        <Play className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                                {isLink && (
                                                    <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center border border-white/10">
                                                        <ExternalLink className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <div className={`font-title text-2xl md:text-3xl leading-tight ${textColor}`}>
                                                {item.title}
                                            </div>
                                            <div className={`mt-3 text-sm md:text-base line-clamp-3 ${mutedText}`}>
                                                {item.description}
                                            </div>
                                            <div className={`mt-5 inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] border transition-colors ${theme.includes('text-body') ? 'border-white/20 text-white/90 group-hover:bg-white/10' : 'border-[var(--color-border)] text-[var(--color-text-body)] group-hover:bg-[var(--color-primary)]/10'}`}>
                                                {isVideo ? 'Watch Now' : isLink ? 'Visit Link' : 'Read More'}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <ContentGrid data={resources} />

        </main>
    );
}

