import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type PostLang = 'en' | 'ko';

type Frontmatter = {
  title?: string;
  date?: unknown;
  tags?: unknown;
  excerpt?: string;
  lang?: unknown;
};

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt?: string;
  content: string;
  lang: PostLang;
}

export function getAllPosts(): PostData[] {
  const posts = getAllSlugs()
    .map((slug) => getPostBySlug(slug, 'en'))
    .filter((post): post is PostData => post !== null);

  return posts.sort((a, b) => {
    const at = Date.parse(a.date || '');
    const bt = Date.parse(b.date || '');
    if (Number.isNaN(at) && Number.isNaN(bt)) return 0;
    if (Number.isNaN(at)) return 1;
    if (Number.isNaN(bt)) return -1;
    return bt - at;
  });
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const slugs = new Set<string>();
  const fileNames = fs.readdirSync(postsDirectory);

  for (const fileName of fileNames) {
    if (fileName.endsWith('.ko.md')) {
      slugs.add(fileName.slice(0, -'.ko.md'.length));
      continue;
    }
    if (fileName.endsWith('.md')) {
      slugs.add(fileName.slice(0, -'.md'.length));
    }
  }

  return Array.from(slugs).sort((a, b) => a.localeCompare(b));
}

function normalizeDate(value: unknown): string {
  // Accept common frontmatter formats:
  // - "YYYY-MM-DD"
  // - Date object (yaml date)
  // - number timestamp
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'number') return new Date(value).toISOString();
  // Fallback: stringify
  try {
    return String(value);
  } catch {
    return '';
  }
}

function normalizeTags(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((v) => String(v).trim())
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    // allow "tag1, tag2" shorthand
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [String(value)].map((s) => s.trim()).filter(Boolean);
}

export function getPostBySlug(slug: string, preferLang: PostLang = 'en'): PostData | null {
  const candidates =
    preferLang === 'ko'
      ? [`${slug}.ko.md`, `${slug}.md`]
      : [`${slug}.md`, `${slug}.ko.md`];

  for (const fileName of candidates) {
    const fullPath = path.join(postsDirectory, fileName);
    if (!fs.existsSync(fullPath)) {
      continue;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const fm = data as Frontmatter;

    const date = normalizeDate(fm.date);
    const tags = normalizeTags(fm.tags);
    const inferredLang: PostLang = fileName.endsWith('.ko.md') ? 'ko' : 'en';
    const lang = normalizeLang(fm.lang, inferredLang);

    return {
      slug,
      title: fm.title || slug,
      date,
      tags,
      excerpt: fm.excerpt || '',
      content,
      lang,
    };
  }

  return null;
}

function normalizeLang(value: unknown, fallback: PostLang): PostLang {
  if (value === 'en' || value === 'ko') {
    return value;
  }
  return fallback;
}
