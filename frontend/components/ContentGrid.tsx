'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Resource } from '@/src/data/resources';


type GridCategory = 'View All' | 'Articles' | 'Blogs' | 'Links' | 'Videos';

const CATEGORY_ORDER: GridCategory[] = ['View All', 'Articles', 'Blogs', 'Links', 'Videos'];

const TYPE_TO_CATEGORY: Record<Resource['type'], Exclude<GridCategory, 'View All'>> = {
  article: 'Articles',
  blog: 'Blogs',
  link: 'Links',
  video: 'Videos',
};

type GridItem = {
  id: Resource['id'];
  title: string;
  description: string;
  image: string;
  category: Exclude<GridCategory, 'View All'>;
  type: string;
  href: string;
  external: boolean;
};

export default function ContentGrid({
  data,
  backgroundColor = 'var(--color-bg-app)',
}: {
  data: Resource[];
  backgroundColor?: string;
}) {
  const [activeCategory, setActiveCategory] = useState('View All');

  const items: GridItem[] = data.map((r) => {
    const category = TYPE_TO_CATEGORY[r.type];
    const href = r.type === 'link' && r.externalUrl ? r.externalUrl : `/resources/${r.id}`;

    return {
      id: r.id,
      title: r.title,
      description: r.description,
      image: r.imageUrl,
      category,
      type: r.type.toUpperCase(),
      href,
      external: r.type === 'link',
    };
  });

  const categories = CATEGORY_ORDER.filter(
    (cat) => cat === 'View All' || items.some((i) => i.category === cat)
  );

  const filtered =
    activeCategory === 'View All'
      ? items
      : items.filter((p) => p.category === activeCategory);

  return (
    <section
      className="py-16"
      style={{ backgroundColor }}
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
          {/* Mobile: horizontal category nav */}
          <div className="w-full lg:hidden">
            <nav className="flex gap-3 overflow-x-auto pb-2 px-1">
              {categories.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                        : 'text-[var(--color-text-body)]/70 bg-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="lg:w-64 lg:flex-shrink-0 hidden lg:block">
            <div className="lg:sticky lg:top-32 space-y-2">
              {categories.map((cat) => {
                const active = activeCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      active
                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
                        : 'text-[var(--color-text-body)]/70 hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-body)]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1">
            {/* Mobile: horizontally scrollable cards with snap */}
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-2 sm:px-0 lg:hidden">
              {filtered.map((post, i) => (
                <Link
                  key={post.id}
                  href={post.href}
                  target={post.external ? '_blank' : undefined}
                  rel={post.external ? 'noopener noreferrer' : undefined}
                  className="group overflow-hidden rounded-xl border shadow-sm transition-transform duration-400 ease-[cubic-bezier(.22,1,.36,1)] animate-in fade-in snap-start will-change-transform transform-gpu hover:ring hover:ring-[var(--color-bg-app)] hover:ring-opacity-10 hover:[transform:perspective(800px)_rotateY(-4deg)] md:hover:[transform:perspective(1000px)_rotateY(-6deg)]"
                  style={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderColor: 'var(--color-border)',
                    minWidth: '260px',
                    animationDelay: `${i * 80}ms`,
                  }}
                >
                  <div
                    className="relative h-44 w-[260px] overflow-hidden"
                    style={{ backgroundColor: 'var(--color-bg-subtle)' }}
                  >
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-4 transition-colors duration-300" style={{ width: '260px' }}>
                    <span
                      className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: 'var(--color-bg-subtle)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      {post.type}
                    </span>

                    <h3
                      className="mb-3 text-xl md:text-2xl font-semibold leading-snug font-title transition-colors duration-300"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {post.title}
                    </h3>

                    <p
                      className="text-sm line-clamp-3 body-text transition-opacity duration-300 group-hover:opacity-90"
                      style={{ color: 'var(--color-text-body)' }}
                    >
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop/Tablet: grid layout */}
            <div className="hidden lg:block">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((post, i) => (
                  <Link
                    key={post.id}
                    href={post.href}
                    target={post.external ? '_blank' : undefined}
                    rel={post.external ? 'noopener noreferrer' : undefined}
                    className="group overflow-hidden rounded-xl border shadow-sm transition-transform duration-400 ease-[cubic-bezier(.22,1,.36,1)] animate-in fade-in slide-in-from-bottom-4 will-change-transform transform-gpu hover:ring hover:ring-[var(--color-bg-app)] hover:ring-opacity-10 hover:[transform:perspective(800px)_rotateY(-4deg)] md:hover:[transform:perspective(1000px)_rotateY(-6deg)]"
                    style={{
                      backgroundColor: 'var(--color-bg-card)',
                      borderColor: 'var(--color-border)',
                      animationDelay: `${i * 80}ms`,
                    }}
                  >
                    <div
                      className="relative h-48 w-full overflow-hidden"
                      style={{ backgroundColor: 'var(--color-bg-subtle)' }}
                    >
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="p-6 transition-colors duration-300">
                      <span
                        className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: 'var(--color-bg-subtle)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        {post.type}
                      </span>

                      <h3
                        className="mb-3 text-xl md:text-2xl font-semibold leading-snug font-title transition-colors duration-300"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {post.title}
                      </h3>

                      <p
                        className="text-sm line-clamp-3 body-text transition-opacity duration-300 group-hover:opacity-90"
                        style={{ color: 'var(--color-text-body)' }}
                      >
                        {post.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
