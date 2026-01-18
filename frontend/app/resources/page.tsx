import ResourcesClient from '@/components/ResourcesClient';
import { sanityClient, urlFor } from '@/lib/sanity';
import { resources as staticResources } from '@/src/data/resources';

// Revalidate this page every 60 seconds so newly published Sanity blogs
// show up in the content grid without a full site rebuild.
export const revalidate = 60;

async function fetchSanityBlogs() {
    const query = `*[_type == "blog" && !(_id in path('drafts.**'))] | order(publishedAt desc){
        _id,
        title,
        "slug": slug.current,
        excerpt,
        coverImage,
        content,
        author,
        publishedAt,
        isFeatured
    }`;

    const result = await sanityClient.fetch(query);
    return (result || []).map((b: any) => ({
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
    }));
}

export default async function ResourcesPage() {
    // fetch sanity blogs server-side and merge with static resources
    const sanityBlogs = await fetchSanityBlogs();
    const combined = [...sanityBlogs, ...staticResources];

    const blogs = combined.filter((r) => r.type === 'blog');
    const articles = combined.filter((r) => r.type === 'article');
    const videos = combined.filter((r) => r.type === 'video');
    const links = combined.filter((r) => r.type === 'link');

    // pick featured: prefer sanity-marked featured first, then fall back to existing order
    const sanityFeatured = (sanityBlogs as any[]).filter((b: any) => b.isFeatured);
    const featuredPool = [...sanityFeatured, blogs[0], articles[0], videos[0], blogs[1], links[0], articles[1]].filter(Boolean);
    const featured = Array.from(new Map(featuredPool.map((i: any) => [i.id, i])).values()).slice(0, 6);

    const imagesPool = ['/img8.jpg', '/img9.jpg', '/img10.jpg', '/img11.jpg'];
    const shuffled = [...imagesPool].sort(() => Math.random() - 0.5);
    const chosenImages = shuffled.slice(0, Math.min(featured.length, shuffled.length));

    return <ResourcesClient featured={featured} combined={combined} />;
}

