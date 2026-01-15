import { sanityClient, urlFor } from "@/lib/sanity";
import { BLOG_LIST_QUERY } from "@/lib/queries";
import Link from "next/link";

type Blog = {
  _id: string;
  title: string;
  excerpt?: string;
  slug?: { current: string };
  coverImage?: any;
};

export default async function BlogPage() {
  const blogs: Blog[] = await sanityClient.fetch(BLOG_LIST_QUERY);

  return (
    <main className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-title mb-12">Blogs</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-500 text-lg">
          No blogs published yet.
        </p>
      ) : (
        <div className="grid gap-8">
          {blogs.map((blog) => {
            if (!blog.slug?.current) return null;

            return (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug.current}`}
                className="group border rounded-2xl p-6 hover:shadow-lg transition"
              >
                {blog.coverImage && (
                  <img
                    src={urlFor(blog.coverImage).width(800).url()}
                    alt={blog.title}
                    className="rounded-xl mb-4 w-full object-cover"
                  />
                )}

                <h2 className="text-2xl font-semibold group-hover:underline">
                  {blog.title}
                </h2>

                {blog.excerpt && (
                  <p className="text-gray-600 mt-2">
                    {blog.excerpt}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}