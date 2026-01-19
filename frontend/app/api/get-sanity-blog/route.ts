import { NextRequest, NextResponse } from 'next/server';
import { sanityClient, urlFor } from '@/lib/sanity';

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const slug = url.searchParams.get('slug');
    if (!slug) return NextResponse.json({ error: 'missing slug' }, { status: 400 });

    const query = `*[_type=="blog" && slug.current == $slug][0]{ _id, title, "slug": slug.current, excerpt, coverImage, content, author, publishedAt, isFeatured }`;
    const b = await sanityClient.fetch(query, { slug });
    if (!b) return NextResponse.json({ notFound: true }, { status: 404 });

    const mapped = {
      id: `sanity-blog-${b.slug || b._id}`,
      type: 'blog',
      title: b.title,
      description: b.excerpt || '',
      content: b.content ? JSON.stringify(b.content) : undefined,
      imageUrl: b.coverImage ? urlFor(b.coverImage).width(1200).url() : '/img8.jpg',
      date: b.publishedAt || '',
      author: b.author || 'MindSettler Team',
      isFeatured: !!b.isFeatured,
      slug: b.slug,
    };

    return NextResponse.json(mapped);
  } catch (e) {
    console.error('sanity fetch error', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
