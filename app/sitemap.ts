import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const parsed = Date.parse(post.date);
    return {
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: Number.isNaN(parsed) ? new Date() : new Date(parsed),
      changeFrequency: 'monthly',
      priority: 0.7,
    };
  });

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...postEntries,
  ];
}
