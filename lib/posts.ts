import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type PostLang = 'ko';

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
    .map((slug) => getPostBySlug(slug))
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

  const fileNames = fs.readdirSync(postsDirectory);

  // Only publish top-level *.md files (Korean).
  // Anything in subfolders (e.g. posts/_en/) is ignored.
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .filter((fileName) => !fileName.endsWith('.en.md'))
    .map((fileName) => fileName.slice(0, -'.md'.length))
    .sort((a, b) => a.localeCompare(b));
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

export function getPostBySlug(slug: string): PostData | null {
  const fileName = `${slug}.md`;
  const fullPath = path.join(postsDirectory, fileName);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const fm = data as Frontmatter;

  const date = normalizeDate(fm.date);
  const tags = normalizeTags(fm.tags);

  return {
    slug,
    title: fm.title || slug,
    date,
    tags,
    excerpt: fm.excerpt || '',
    content,
    lang: 'ko',
  };
}
