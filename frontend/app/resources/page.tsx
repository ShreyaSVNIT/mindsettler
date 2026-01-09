'use client';

import { motion } from 'framer-motion';
import { resources } from '@/src/data/resources';
import InspirationPage from '@/components/InspirationPage';
import MirroredInspirationPage from '@/components/MirroredInspirationPage';
import TitleHeader from '@/components/TitleHeader';

export default function ResourcesPage() {
    const blogs = resources.filter(r => r.type === 'blog');
    const articles = resources.filter(r => r.type === 'article');
    const videos = resources.filter(r => r.type === 'video');
    const links = resources.filter(r => r.type === 'link');


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

            <div className="flex flex-col gap-16 md:gap-24">
                {/* blogs section -> InspirationPage (Left Sticky) */}
                <section id="blogs" className="scroll-mt-[calc(var(--header-h)+4rem)]">
                    <InspirationPage
                        data={blogs}
                        title="Deep Dives & Blogs"
                        description="Discover how daily mindfulness practices can transform your mental clarity and emotional resilience."
                        heroImage={blogs[0]?.imageUrl || '/step1.jpg'}
                    />
                </section>

                {/* articles section -> MirroredInspirationPage (Right Sticky) */}
                <section id="articles" className="scroll-mt-[calc(var(--header-h)+4rem)]">
                    <MirroredInspirationPage
                        data={articles}
                        title="Insightful Articles"
                        description="Short, punchy reads to boost your mood and understanding in minutes."
                        heroImage={articles[0]?.imageUrl || '/step1.jpg'}
                    />
                </section>

                {/* videos section -> InspirationPage (Left Sticky) */}
                <section id="videos" className="scroll-mt-[calc(var(--header-h)+4rem)]">
                    <InspirationPage
                        data={videos}
                        title="Watch & Listen"
                        description="Guided meditations, expert talks, and soothing visuals to help you reset."
                        heroImage={videos[0]?.imageUrl || '/step1.jpg'}
                    />
                </section>

                {/* links section -> MirroredInspirationPage (Right Sticky) */}
                <section id="links" className="scroll-mt-[calc(var(--header-h)+4rem)]">
                    <MirroredInspirationPage
                        data={links}
                        title="External Resources"
                        description="Trusted tools, helplines, and organizations for further support."
                        heroImage={links[0]?.imageUrl || '/step1.jpg'}
                    />
                </section>
            </div>

        </main>
    );
}

