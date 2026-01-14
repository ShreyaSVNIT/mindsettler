import { sanityClient, urlFor } from "@/lib/sanity";
import { BLOG_DETAIL_QUERY } from "@/lib/queries";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";

export default async function BlogDetail({ params }: { params: { slug: string } }) {
  const blog = await sanityClient.fetch(BLOG_DETAIL_QUERY, {
    slug: params.slug,
  });

  if (!blog) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-title mb-4">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {blog.author} • {new Date(blog.publishedAt).toDateString()}
      </p>

      {blog.coverImage && (
        <img
          src={urlFor(blog.coverImage).width(1200).url()}
          className="rounded-xl mb-8"
          alt={blog.title}
        />
      )}

      <article className="prose max-w-none">
        <PortableText value={blog.content} />
      </article>
    </main>
  );
}