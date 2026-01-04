'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { resources, Resource } from '@/src/data/resources';
import { Play, ExternalLink, BookOpen, FileText } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex items-center gap-3 mb-8">
        <Icon className="text-[var(--color-primary)] w-6 h-6" />
        <h2 className="text-3xl font-title text-[var(--color-text-body)]">{title}</h2>
        <div className="h-[1px] bg-[var(--color-primary)]/20 flex-grow ml-4"></div>
    </div>
);

const ResourceCard = ({ resource }: { resource: Resource }) => {
    const isVideo = resource.type === 'video';
    const isLink = resource.type === 'link';

    // Decide where the click should go
    let href = `/resources/${resource.id}`;
    if (isLink && resource.externalUrl) {
        href = resource.externalUrl;
    }

    return (
        <motion.div variants={itemVariants} className="group cursor-pointer h-full">
            <Link href={href} target={isLink ? "_blank" : undefined}>
                <div className="relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 h-full border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 flex flex-col">
                    {/* Image Container */}
                    <div className="relative h-48 w-full overflow-hidden">
                        <Image
                            src={resource.imageUrl}
                            alt={resource.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Overlay for Video */}
                        {isVideo && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center pl-1 group-hover:scale-110 transition-transform">
                                    <Play className="w-6 h-6 text-[var(--color-primary)]" fill="currentColor" />
                                </div>
                            </div>
                        )}
                        {/* Overlay for Link */}
                        {isLink && (
                            <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full">
                                <ExternalLink className="w-4 h-4 text-[var(--color-text-body)]" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                                {resource.type}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                                {resource.date}
                            </span>
                        </div>

                        <h3 className="text-xl font-title font-bold text-[var(--color-text-body)] mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                            {resource.title}
                        </h3>

                        <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow">
                            {resource.description}
                        </p>

                        <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-body)] group-hover:text-[var(--color-primary)] transition-colors mt-auto">
                            {isVideo ? 'Watch Video' : isLink ? 'Visit Link' : 'Read More'}
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default function ResourcesPage() {
    const blogs = resources.filter(r => r.type === 'blog');
    const articles = resources.filter(r => r.type === 'article');
    const videos = resources.filter(r => r.type === 'video');
    const links = resources.filter(r => r.type === 'link');

    return (
        <main className="min-h-screen bg-[var(--color-bg-app)] pt-24 pb-20">

            {/* Hero Section */}
            <section className="relative px-6 py-16 md:py-24 text-center max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-5xl md:text-8xl font-title text-[var(--color-text-body)] mb-8 leading-tight">
                        <span className="italic text-[var(--color-primary)]">Resources</span> <br className="md:hidden" />
                        <span>for your Mind</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-body leading-relaxed">
                        Explore our collection of expert articles, guided meditations, and helpful tools designed to support your mental wellness journey.
                    </p>
                </motion.div>
            </section>

            <div className="max-w-7xl mx-auto px-6 space-y-20">

                {/* Blogs Shelf */}
                <motion.section
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <SectionHeader title="Deep Dives & Blogs" icon={BookOpen} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {blogs.map(resource => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                </motion.section>

                {/* Articles Shelf */}
                <motion.section
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <SectionHeader title="Insightful Articles" icon={FileText} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {articles.map(resource => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                </motion.section>

                {/* Videos Shelf */}
                <motion.section
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <SectionHeader title="Watch & Listen" icon={Play} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {videos.map(resource => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                </motion.section>

                {/* Links Shelf */}
                <motion.section
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <SectionHeader title="External Resources" icon={ExternalLink} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {links.map(resource => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                </motion.section>

            </div>
        </main>
    );
}
