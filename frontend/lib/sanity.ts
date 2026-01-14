import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true, // fast + cheap
});

const builder = imageUrlBuilder(sanityClient);
export const urlFor = (source: any) => builder.image(source);