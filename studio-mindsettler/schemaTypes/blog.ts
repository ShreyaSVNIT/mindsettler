export default {
  name: "blog",
  type: "document",
  title: "Blog",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "title" },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "excerpt",
      type: "text",
      title: "Short Description",
      rows: 3,
    },
    {
      name: "coverImage",
      type: "image",
      title: "Cover Image",
      options: { hotspot: true },
    },
    {
      name: "content",
      type: "array",
      title: "Content",
      of: [{ type: "block" }],
    },
    {
      name: "author",
      type: "string",
      title: "Author",
      initialValue: "MindSettler Team",
    },
    {
      name: "publishedAt",
      type: "datetime",
      title: "Published At",
    },

    // NEW
    {
      name: "isFeatured",
      type: "boolean",
      title: "Featured Blog",
      initialValue: false,
    },
    {
      name: "category",
      type: "string",
      title: "Category",
      options: {
        list: [
          "Mental Health",
          "Wellness",
          "Relationships",
          "Self Growth",
        ],
      },
    },

    //  SEO
    {
      name: "seoTitle",
      type: "string",
      title: "SEO Title",
    },
    {
      name: "seoDescription",
      type: "text",
      title: "SEO Description",
      rows: 3,
    },
    {
      name: "seoImage",
      type: "image",
      title: "SEO Image",
    },
  ],
};