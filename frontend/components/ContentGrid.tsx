'use client';

import { useState } from 'react';
import Image from 'next/image';

const categories = [
  'View All',
  'Articles',
  'Blogs',
  'Links',
  'Videos',
  'Podcasts',
];

const posts = [
  {
    id: 1,
    title: 'The Art of Product Design: Creating Products that Connect with Customers',
    description:
      'We explore the principles of great product design and how designers can build emotional connections with users.',
    image: '/images/post-1.jpg',
    category: 'Articles',
    type: 'NEWS',
  },
  {
    id: 2,
    title: 'The Future of Startups: Key Trends Shaping the Tech Industry',
    description:
      'A deep dive into emerging startup trends and how technology is redefining innovation.',
    image: '/images/post-2.jpg',
    category: 'Podcasts',
    type: 'INSIGHTS',
  },
  {
    id: 3,
    title: 'Exploring the Benefits and Risks of Automation',
    description:
      'Industry experts discuss automation, AI-driven workflows, and the future of work.',
    image: '/images/post-3.jpg',
    category: 'Videos',
    type: 'PODCAST',
  },
  {
    id: 4,
    title: 'Creating Intuitive Products that Delight Users',
    description:
      'We explore user-first product strategies and design systems that drive engagement.',
    image: '/images/post-4.jpg',
    category: 'Blogs',
    type: 'PODCAST',
  },
  {
    id: 5,
    title: 'The Power of Storytelling in Tech: Building Brands that Resonate',
    description:
      'Why storytelling matters in SaaS branding and how great narratives build trust.',
    image: '/images/post-5.jpg',
    category: 'Links',
    type: 'INSIGHTS',
  },
  {
    id: 6,
    title: 'Scaling Your Startup: Lessons Learned from Successful Founders',
    description:
      'Founders share lessons, mistakes, and growth strategies for scaling sustainably.',
    image: '/images/post-6.jpg',
    category: 'Videos',
    type: 'NEWS',
  },
];

export default function ContentGrid() {
  const [activeCategory, setActiveCategory] = useState('View All');

  const filtered =
    activeCategory === 'View All'
      ? posts
      : posts.filter((p) => p.category === activeCategory);

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
            <article
              key={post.id}
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
