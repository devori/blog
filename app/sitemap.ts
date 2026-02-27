import type { MetadataRoute } from 'next';
import { getAllSlugs, getPostBySlug } from '@/lib/posts';
import { SITE_URL } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs();

  const postEntries: MetadataRoute.Sitemap = slugs.flatMap((slug) => {
    const post = getPostBySlug(slug);
    if (!post) return [];

    const parsed = Date.parse(post.date);
    return [
      {
        url: `${SITE_URL}/posts/${slug}`,
        lastModified: Number.isNaN(parsed) ? new Date() : new Date(parsed),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
    ];
  });

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...postEntries,
  ];
}
