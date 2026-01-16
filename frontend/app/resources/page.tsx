"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import CouchHero from '@/components/CouchHero';
import SectionHeader from '@/components/SectionHeader';
import { resources } from '@/src/data/resources';
import ContentGrid from '@/components/ContentGrid';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Play } from 'lucide-react';

export default function ResourcesPage() {
    const [view, setView] = useState<'grid' | 'list'>('grid');

    const blogs = resources.filter((r) => r.type === 'blog');
    const articles = resources.filter((r) => r.type === 'article');
    const videos = resources.filter((r) => r.type === 'video');
    const links = resources.filter((r) => r.type === 'link');

    const featured = [blogs[0], articles[0], videos[0], blogs[1], links[0], articles[1]].filter(Boolean);

    const spans = [
        'lg:col-span-7',
        'lg:col-span-5',
        'lg:col-span-5',
        'lg:col-span-4',
        'lg:col-span-4',
        'lg:col-span-4',
    ];

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section using CouchHero */}
            <CouchHero
                subheader="Resources"
                title={
                    <>
                        <span className="block">Resources</span>
                        <span className="block text-[var(--color-primary)] italic mt-2">for your Mind</span>
                    </>
                }
                description="Curated content to support your mental wellness journey. Explore articles, videos, and tools designed to help you thrive."
                alignment="center"
                layout="static"
                className="h-screen"
                backgroundColor="white"
            />

            <section className="py-24 px-6 bg-white">
                <div className="mx-auto max-w-7xl">
                    <SectionHeader
                        subheader="Featured"
                        title={
                            <>
                                Handpicked for <span className="italic">you</span>
                            </>
                        }
                        bodyText="Start here — a quick selection of our most popular reads, videos, and trusted links."
                        alignment="center"
                        decoration="whiskers"
                        layout="single"
                    />

                    {/* View toggle */}
                    <div className="flex items-center justify-end mb-6 px-6 lg:px-0">
                        <div className="inline-flex rounded-full bg-[var(--color-bg-subtle)] p-1">
                            <button
                                type="button"
                                aria-pressed={view === 'grid'}
                                onClick={() => setView('grid')}
                                className={`px-3 py-1 text-sm font-medium ${
                                    view === 'grid' ? 'bg-[var(--color-primary)] text-white rounded-lg' : 'text-[var(--color-primary)]'
                                }`}
                            >
                                Grid
                            </button>
                            <button
                                type="button"
                                aria-pressed={view === 'list'}
                                onClick={() => setView('list')}
                                className={`px-3 py-1 text-sm font-medium ${
                                    view === 'list' ? 'bg-[var(--color-primary)] text-white rounded-lg' : 'text-[var(--color-primary)]'
                                }`}
                            >
                                List
                            </button>
                        </div>
                    </div>

                    {/* Featured list */}
                    <div className={`py-2 px-6 lg:px-0 ${view === 'list' ? 'grid grid-cols-1 gap-6' : 'grid gap-8 lg:grid-cols-12 lg:auto-rows-[minmax(120px,auto)]'}`}>
                        {featured.map((item: any, idx: number) => {
                            const isVideo = item.type === 'video';
                            const isLink = item.type === 'link';
                            const href = isLink && item.externalUrl ? item.externalUrl : `/resources/${item.id}`;
                            const external = isLink;

                            const textColor = 'text-white';
                            const mutedText = 'text-white/75';
                            const chipBg = 'bg-[var(--color-bg-subtle)] text-[var(--color-primary)]';

                            return (
                                <Link
                                    key={item.id}
                                    href={href}
                                    target={external ? '_blank' : undefined}
                                    rel={external ? 'noopener noreferrer' : undefined}
                                    className={`group relative overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-[var(--color-bg-card)] ${
                                        view === 'list' ? 'col-span-1' : spans[idx] ?? ''
                                    }`}
                                >
                                    <div className="relative w-full h-64 lg:h-auto">
                                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                                    </div>

                                    <div className="relative z-10 p-6 flex flex-col gap-4">
                                        <div className="flex items-start justify-between">
                                            <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${chipBg}`}>{item.type.toUpperCase()}</div>
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
                                            <div className={`font-title text-2xl md:text-3xl leading-tight ${textColor}`}>{item.title}</div>
                                            <div className={`mt-3 text-sm md:text-base line-clamp-3 ${mutedText}`}>{item.description}</div>
                                            <div className="mt-5 inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] border transition-colors border-white/20 text-white/90 group-hover:bg-white/10">
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

            <ContentGrid data={resources} backgroundColor="white" />
        </main>
    );
}

