'use client';

import { use, useEffect, useState } from 'react';
import { resources, Resource } from '@/src/data/resources';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';

export default function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = use(params);
    const [resource, setResource] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);

    // Find resource
    useEffect(() => {
        window.scrollTo(0, 0);
        const found = resources.find(r => r.id === id);
        setResource(found || null);
        setLoading(false);
    }, [id]);

    if (loading) return null;
    if (!resource) return notFound();

    const isVideo = resource.type === 'video';

    return (
        <article className="min-h-screen bg-[var(--color-bg-card)]">

            {/* --- Top Navigation --- */}
            <div className="absolute top-15 left-0 w-full z-50 px-6 py-6 pointer-events-none">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/resources" className="pointer-events-auto group flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all border border-[var(--color-border)]">
                        <ArrowLeft className="w-4 h-4 text-[var(--color-text-body)] group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold text-[var(--color-text-body)]">Back to Resources</span>
                    </Link>
                </div>
            </div>

            {/* --- Hero Section --- */}
            <div className="relative w-full h-[60vh] md:h-[70vh] flex items-end">
                <Image
                    src={resource.imageUrl}
                    alt={resource.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-[var(--color-bg-card)]/40 to-transparent" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 pb-12 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                            {resource.type}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-title font-bold text-[var(--color-text-body)] mb-6 leading-tight">
                            {resource.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-gray-600 font-medium">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                                <span>{resource.date}</span>
                            </div>
                            {resource.author && (
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-[var(--color-primary)]" />
                                    <span>{resource.author}</span>
                                </div>
                            )}
                            {resource.type === 'blog' && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                                    <span>5 min read</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- Content Section --- */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >

                    {/* VIDEO PLAYER */}
                    {isVideo && resource.videoUrl && (
                        <div className="mb-12 rounded-2xl overflow-hidden shadow-xl aspect-video relative bg-black">
                            <iframe
                                src={resource.videoUrl}
                                title={resource.title}
                                className="w-full h-full absolute inset-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}

                    {/* TEXT CONTENT */}
                    <div className="prose prose-lg prose-headings:font-title prose-headings:text-[var(--color-text-body)] prose-p:text-gray-600 prose-a:text-[var(--color-primary)] max-w-none">

                        {/* Description (Intro) */}
                        <p className="text-xl md:text-2xl leading-relaxed font-body text-[var(--color-text-body)] italic mb-8 border-l-4 border-[var(--color-primary)] pl-6">
                            {resource.description}
                        </p>

                        {/* Main Body */}
                        {resource.content && (
                            <div dangerouslySetInnerHTML={{ __html: resource.content }} />
                        )}

                        {isVideo && !resource.content && (
                            <p>
                                Watch the video above to learn more about {resource.title}. This session covers essential techniques and insights relevant to your mental wellness journey.
                            </p>
                        )}

                    </div>

                    {/* --- Share / Footer --- */}
                    <div className="mt-16 pt-8 border-t border-[var(--color-border)] flex items-center justify-between">
                        <div className="text-gray-500 text-sm">
                            MindSettler Resources
                        </div>
                        <button className="flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-bold transition-colors">
                            <Share2 className="w-4 h-4" />
                            Share this resource
                        </button>
                    </div>

                </motion.div>
            </div>

        </article>
    );
}
