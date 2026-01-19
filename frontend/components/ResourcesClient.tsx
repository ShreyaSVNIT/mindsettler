"use client";

import React from 'react';
import { motion } from 'framer-motion';
import CouchHero from '@/components/CouchHero';
import SectionHeader from '@/components/SectionHeader';
import ContentGrid from '@/components/ContentGrid';
import HealingJourneySection from '@/components/HealingJourneySection';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Play } from 'lucide-react';

export default function ResourcesClient({ featured, combined }: { featured: any[]; combined: any[] }) {
  const imagesPool = ['/img8.jpg', '/img9.jpg', '/img10.jpg', '/img11.jpg'];
  const shuffled = [...imagesPool].sort(() => Math.random() - 0.5);
  const chosenImages = shuffled.slice(0, Math.min(featured.length, shuffled.length));

  return (
    <main className="min-h-screen bg-white">
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
        backgroundColor="white"
        className="h-screen"
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

          <div className="py-2 px-6">
            <div className="hidden lg:grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((item: any, idx: number) => {
                const isLink = item.type === 'link';
                const href = isLink && item.externalUrl ? item.externalUrl : `/resources/${item.id}`;
                const external = isLink;
                const imgSrc = item.imageUrl || chosenImages[idx % chosenImages.length];

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: idx * 0.08 }}
                  >
                    <Link
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="group block relative overflow-hidden rounded-2xl shadow-sm transition-transform duration-300 hover:shadow-md"
                    >
                      <div className="relative w-full overflow-hidden aspect-[16/9] lg:max-h-[240px]">
                        <Image src={imgSrc} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>

                      <div className="absolute left-4 bottom-4 right-4">
                        <h3 className="mt-3 text-lg md:text-2xl lg:text-3xl font-title font-semibold text-white drop-shadow-md">{item.title}</h3>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="lg:hidden -mx-6 px-6">
              <div className="flex gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory pb-4 custom-scrollbar">
                {featured.map((item: any, idx: number) => {
                  const isLink = item.type === 'link';
                  const href = isLink && item.externalUrl ? item.externalUrl : `/resources/${item.id}`;
                  const external = isLink;
                  const imgSrc = item.imageUrl || chosenImages[idx % chosenImages.length];

                  return (
                    <div key={item.id} className="snap-start min-w-[80%] sm:min-w-[65%] md:min-w-[50%]">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: idx * 0.06 }}
                      >
                        <Link
                          href={href}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noopener noreferrer' : undefined}
                          className="group block relative overflow-hidden rounded-2xl shadow-sm transition-transform duration-300 hover:shadow-md"
                        >
                          <div className="relative w-full overflow-hidden aspect-[16/9] lg:max-h-[240px]">
                            <Image src={imgSrc} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>

                          <div className="absolute left-4 bottom-4 right-4">
                            <h3 className="mt-3 text-lg md:text-2xl font-title font-semibold text-white drop-shadow-md">{item.title}</h3>
                          </div>
                        </Link>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContentGrid data={combined} backgroundColor="white" />

      <HealingJourneySection />
    </main>
  );
}
