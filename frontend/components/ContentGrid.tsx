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

export default function ContentGrid({ data }: { data: Resource[] }) {
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
      style={{ backgroundColor: 'var(--color-bg-app)' }}
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Tabs */}
        <div
          className="mb-12 flex flex-wrap gap-6 border-b text-sm font-medium"
          style={{ borderColor: 'var(--color-border)' }}
        >
          {categories.map((cat) => {
            const active = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="relative pb-3 transition-all duration-300 ease-out"
                style={{
                  color: active
                    ? 'var(--color-primary)'
                    : 'var(--color-text-body)',
                }}
              >
                {cat}

                {/* underline */}
                <span
                  className={`absolute left-0 -bottom-[1px] h-[2px] w-full origin-left transition-transform duration-300 ease-out ${
                    active ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => (
            <Link
              key={post.id}
              href={post.href}
              target={post.external ? '_blank' : undefined}
              rel={post.external ? 'noopener noreferrer' : undefined}
              className="group overflow-hidden rounded-xl border shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md animate-in fade-in slide-in-from-bottom-4"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                borderColor: 'var(--color-border)',
                animationDelay: `${i * 80}ms`,
              }}
            >
              {/* Image */}
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

              {/* Content */}
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
                  className="mb-3 text-lg font-semibold leading-snug font-title transition-colors duration-300"
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
    </section>
  );
}
