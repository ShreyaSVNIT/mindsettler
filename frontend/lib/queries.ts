export const BLOG_LIST_QUERY = `
*[_type == "blog"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt,
  category,
  isFeatured
}
`;

export const FEATURED_BLOGS_QUERY = `
*[_type == "blog" && isFeatured == true] | order(publishedAt desc)[0...3] {
  title,
  slug,
  coverImage,
  excerpt
}
`;

export const BLOG_DETAIL_QUERY = `
*[_type == "blog" && slug.current == $slug][0] {
  title,
  content,
  coverImage,
  publishedAt,
  author,
  seoTitle,
  seoDescription,
  seoImage
}
`;