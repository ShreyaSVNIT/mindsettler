'use client';

import { motion } from 'framer-motion';
import { resources } from '@/src/data/resources';
import TitleHeader from '@/components/TitleHeader';
import ContentGrid from '@/components/ContentGrid';

export default function ResourcesPage() {
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

            <ContentGrid data={resources} />

        </main>
    );
}

