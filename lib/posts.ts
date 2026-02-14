import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt?: string;
  content: string;
}

export function getAllPosts(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const rawDate = (data as any).date;
      const date = normalizeDate(rawDate);

      const tags = normalizeTags((data as any).tags);

      return {
        slug,
        title: data.title || slug,
        date,
        tags,
        excerpt: data.excerpt || '',
        content,
      };
    });

  return allPostsData.sort((a, b) => {
    const at = Date.parse(a.date || '');
    const bt = Date.parse(b.date || '');
    if (Number.isNaN(at) && Number.isNaN(bt)) return 0;
    if (Number.isNaN(at)) return 1;
    if (Number.isNaN(bt)) return -1;
    return bt - at;
  });
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
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const rawDate = (data as any).date;
    const date = normalizeDate(rawDate);

    const tags = normalizeTags((data as any).tags);

    return {
      slug,
      title: data.title || slug,
      date,
      tags,
      excerpt: data.excerpt || '',
      content,
    };
  } catch {
    return null;
  }
}
