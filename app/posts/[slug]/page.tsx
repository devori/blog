import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { remark } from 'remark';
import html from 'remark-html';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import MermaidRender from '@/components/mermaid-render';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  const url = `${SITE_URL}/posts/${slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: 'Leo' }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url,
      siteName: SITE_NAME,
      publishedTime: post.date,
      locale: 'ko_KR',
      tags: post.tags,
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const processedContent = await remark()
    .use(html)
    .process(post.content);
  const contentHtml = processedContent.toString();
  const readingTime = Math.ceil(post.content.length / 500);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url: `${SITE_URL}/posts/${slug}`,
    inLanguage: 'ko-KR',
    keywords: post.tags,
    author: {
      '@type': 'Person',
      name: 'Leo',
    },
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav backLink />

      <main className="flex-1 overflow-y-auto">
      <article className="max-w-[640px] w-full mx-auto px-5 pt-12 pb-24">
        {/* Post Header */}
        <header className="mb-10 animate-fade-up stagger-1">
          <div className="flex items-center gap-2 text-sm text-muted mb-4">
            <time>
              {new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className="text-border">/</span>
            <span>{readingTime}분</span>
          </div>
          <h1 className="font-lora text-3xl sm:text-4xl font-bold text-foreground leading-[1.3] tracking-tight">
            {post.title}
          </h1>
          {post.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${encodeURIComponent(tag)}`}
                  className="text-[11px] leading-5 px-2 rounded-md border border-border text-muted hover:text-foreground hover:border-accent/40 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <MermaidRender rootId="post-content" />
        <div
          id="post-content"
          className="animate-fade-up stagger-2 prose dark:prose-invert max-w-none
            prose-headings:font-lora prose-headings:tracking-tight prose-headings:font-bold
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3
            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-2
            prose-p:text-[15px] prose-p:leading-[1.8] prose-p:text-foreground/80 prose-p:my-4
            prose-a:text-accent prose-a:no-underline prose-a:font-medium hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-code:text-[13px] prose-code:font-mono prose-code:bg-surface prose-code:text-accent prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:border prose-code:border-border prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-surface prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:text-[13px] prose-pre:font-mono
            prose-blockquote:border-l-2 prose-blockquote:border-accent/40 prose-blockquote:pl-4 prose-blockquote:not-italic prose-blockquote:text-muted prose-blockquote:font-normal
            prose-ul:my-4 prose-ol:my-4 prose-li:text-[15px] prose-li:text-foreground/80 prose-li:my-1 prose-li:marker:text-accent/50
            prose-img:rounded-xl prose-img:border prose-img:border-border
            prose-hr:border-border"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
      </main>

      <Footer />
    </div>
  );
}
