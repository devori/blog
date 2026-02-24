import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs();
  const postsDirectory = path.join(process.cwd(), "posts");

  const postEntries: MetadataRoute.Sitemap = slugs.flatMap((slug) => {
    const enResolved = getPostBySlug(slug, "en");
    if (!enResolved) return [];

    const hasKoreanVariant = fs.existsSync(path.join(postsDirectory, `${slug}.ko.md`));
    const includeKoRoute = hasKoreanVariant || enResolved.lang === "ko";

    const parsed = Date.parse(enResolved.date);
    const enEntry: MetadataRoute.Sitemap[number] = {
      url: `${SITE_URL}/posts/${slug}`,
      lastModified: Number.isNaN(parsed) ? new Date() : new Date(parsed),
      changeFrequency: 'monthly',
      priority: 0.7,
    };

    if (!includeKoRoute) {
      return [enEntry];
    }

    const koResolved = getPostBySlug(slug, "ko") ?? enResolved;
    const koParsed = Date.parse(koResolved.date);
    const koEntry: MetadataRoute.Sitemap[number] = {
      url: `${SITE_URL}/ko/posts/${slug}`,
      lastModified: Number.isNaN(koParsed) ? new Date() : new Date(koParsed),
      changeFrequency: "monthly",
      priority: 0.7,
    };

    return [enEntry, koEntry];
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
