"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SectionHeader from './SectionHeader';
import MagicBento from './MagicBento'; // Keeping imports consistent if needed, but we are replacing the usage

interface Service {
    title: string;
    description: string;
    image: string;
}

const servicesData = [
    // CORPORATES
    {
        category: 'Corporates',
        items: [
            {
                title: 'Corporate Workshops',
                description: "Interactive sessions designed to enhance team well-being, stress management, and emotional intelligence in the workplace. Our workshops foster open dialogue, build resilience, and create lasting positive change in your organizational culture. Each session is tailored to address your team's specific challenges and goals.",
                image: '/img1.jpeg'
            },
            {
                title: 'Group Therapy Sessions',
                description: "Confidential group support programs tailored for organizational teams to foster connection, resilience, and collective healing. These sessions create a safe space for employees to share experiences, develop coping strategies, and build meaningful connections with their colleagues. Professional guidance ensures productive and transformative outcomes.",
                image: '/img2.jpeg'
            }
        ]
    },
    // GROUP
    {
        category: 'Group',
        items: [
            {
                title: 'Organizational Consultations',
                description: "Strategic mental health planning and consultation services to create a culture of well-being within your organization. We work closely with leadership to develop comprehensive mental health policies, implement effective support systems, and create sustainable wellness initiatives that prioritize employee mental health at every level.",
                image: '/img3.jpeg'
            },
            {
                title: 'Custom Programs',
                description: "Bespoke mental wellness programs designed to meet the unique needs and goals of your organization and industry. Whether you need stress management training, burnout prevention, or leadership development, we craft solutions that align with your company culture and deliver measurable results for long-term success.",
                image: '/img4.jpeg'
            }
        ]
    },
    // ONE-ON-ONE
    {
        category: 'One-on-one',
        items: [
            {
                title: 'Leadership Wellness Programs',
                description: "Develop leadership resilience and emotional intelligence through targeted programs that support managers and executives. Our leadership wellness tracks focus on stress reduction, effective communication, and mindful decision-making, empowering your leaders to foster a mentally healthy workplace from the top down.",
                image: '/img5.jpeg'
            },
            {
                title: 'Peer Support Circles',
                description: "Facilitated peer groups where employees can connect, share experiences, and support each other's mental health journeys. These circles nurture trust and empathy, reduce stigma, and create a sense of belonging, making mental wellness a shared responsibility across your organization.",
                image: '/img6.jpeg'
            }
        ]
    },
    // CUSTOM
    {
        category: 'Custom',
        items: [
            {
                title: 'HR Mental Health Audits',
                description: "Comprehensive assessments of existing HR policies, benefits, and workplace practices to identify mental health gaps and opportunities. Our audits provide actionable recommendations to create a supportive environment and ensure compliance with best practices in employee mental wellness.",
                image: '/img7.jpeg'
            },
            {
                title: 'Industry-Specific Wellness Tracks',
                description: "Tailored wellness programs designed for the unique demands and stressors of your industry. Whether in tech, healthcare, education, or manufacturing, our industry tracks address sector-specific challenges, boost engagement, and deliver measurable improvements in well-being and performance.",
                image: '/img8.jpeg'
            }
        ]
    }
];

export default function CorporateServices() {
    const [activeTab, setActiveTab] = useState(0);
    const [expandedCategory, setExpandedCategory] = useState<number | null>(0); // Default open first one on mobile
    const categories = servicesData.map(d => d.category);

    const toggleAccordion = (index: number) => {
        setExpandedCategory(expandedCategory === index ? null : index);
    };

    return (
        <section id="services" className="relative py-24 px-6 bg-[var(--color-bg-app)] overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <SectionHeader
                        subheader="Our Services"
                        title={<>What We <span className="text-[var(--color-primary)] italic">Offer</span></>}
                        bodyText="Comprehensive mental wellness solutions tailored for modern workplaces"
                        alignment="center"
                        decoration="whiskers"
                        layout="single"
                    />
                </motion.div>

                {/* ================= DESKTOP VIEW (Tabs) ================= */}
                <div className="hidden md:block">
                    {/* --- TABS --- */}
                    <div className="flex justify-center mb-12">
                        <nav className="inline-flex rounded-2xl bg-white/40 p-1 backdrop-blur-sm border border-white/50">
                            {categories.map((cat, idx) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveTab(idx)}
                                    className={`px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${idx === activeTab
                                        ? 'bg-white text-[var(--color-primary)] shadow-sm'
                                        : 'text-[var(--color-text-body)] hover:bg-white/40'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* --- CONTENT GRID --- */}
                    <div className="min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="grid grid-cols-1 gap-8"
                            >
                                {servicesData[activeTab].items.map((item, index) => (
                                    <div
                                        key={item.title}
                                        className={`bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-white/50 flex flex-col md:gap-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                            }`}
                                    >
                                        {/* TEXT SIDE */}
                                        <div className="flex-1 flex flex-col justify-center gap-6">
                                            <h3 className="font-title text-3xl md:text-4xl text-[var(--color-text-body)]">
                                                {item.title}
                                            </h3>
                                            <p className="font-body text-lg leading-relaxed text-[var(--color-text-body)]/80">
                                                {item.description}
                                            </p>
                                        </div>

                                        {/* IMAGE SIDE */}
                                        <div className="flex-1">
                                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* ================= MOBILE VIEW (Accordion) ================= */}
                <div className="md:hidden space-y-4">
                    {servicesData.map((categoryData, idx) => {
                        const isOpen = expandedCategory === idx;

                        return (
                            <div key={categoryData.category} className="overflow-hidden rounded-2xl border border-white/50 shadow-sm bg-white/60 backdrop-blur-sm">
                                {/* Accordion Header */}
                                <button
                                    onClick={() => toggleAccordion(idx)}
                                    className={`w-full flex items-center justify-between p-5 text-left transition-colors duration-300 ${isOpen ? 'bg-white text-[var(--color-primary)]' : 'hover:bg-white/40 text-[var(--color-text-body)]'
                                        }`}
                                >
                                    <span className="font-title text-xl font-bold">{categoryData.category}</span>
                                    {isOpen ? (
                                        <ChevronUp className="w-5 h-5 text-[var(--color-primary)]" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 opacity-50" />
                                    )}
                                </button>

                                {/* Accordion Content */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="p-5 pt-0 space-y-6 bg-white">
                                                <div className="h-px w-full bg-gray-100 mb-6" /> {/* Divider */}
                                                {categoryData.items.map((item, itemIdx) => (
                                                    <div key={item.title} className="flex flex-col gap-4 mb-8 last:mb-0">
                                                        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-md">
                                                            <Image
                                                                src={item.image}
                                                                alt={item.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-title text-xl font-bold text-[var(--color-text-body)] mb-2">
                                                                {item.title}
                                                            </h4>
                                                            <p className="font-body text-base text-[var(--color-text-body)]/80 leading-relaxed">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
