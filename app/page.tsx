import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants';

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ tag?: string | string[] }>;
}): Promise<Metadata> {
  const resolved = await searchParams;
  const rawTag = resolved?.tag;
  const selectedTag = Array.isArray(rawTag) ? rawTag[0] : rawTag;

  const title = selectedTag
    ? `Posts tagged: ${selectedTag}`
    : 'Writing down thoughts and experiences';
  const description = selectedTag
    ? `A list of posts tagged with "${selectedTag}".`
    : SITE_DESCRIPTION;
  const canonical = selectedTag
    ? `${SITE_URL}/?tag=${encodeURIComponent(selectedTag)}`
    : SITE_URL;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: SITE_NAME,
      title: selectedTag ? `${selectedTag} | ${SITE_NAME}` : SITE_NAME,
      description,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary',
      title: selectedTag ? `${selectedTag} | ${SITE_NAME}` : SITE_NAME,
      description,
    },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ tag?: string | string[] }>;
}) {
  const posts = getAllPosts();
  const resolvedSearchParams = await searchParams;
  const rawTag = resolvedSearchParams?.tag;
  const selectedTag = Array.isArray(rawTag) ? rawTag[0] : rawTag;
  const filteredPosts = selectedTag
    ? posts.filter((p) => p.tags?.includes(selectedTag))
    : posts;

  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags || []))
  ).sort((a, b) => a.localeCompare(b));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: selectedTag
      ? `${SITE_URL}/?tag=${encodeURIComponent(selectedTag)}`
      : SITE_URL,
    inLanguage: 'en-US',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />

      {/* Hero */}
      <header className="max-w-[640px] w-full mx-auto px-5 pt-20 pb-16 animate-fade-up stagger-1">
        <p className="text-sm text-accent font-medium mb-4 tracking-wide">Blog</p>
        <h1 className="font-lora text-3xl sm:text-4xl font-bold text-foreground leading-[1.3] tracking-tight mb-4">
          Writing down thoughts and experiences.
        </h1>
        <p className="text-base text-muted leading-relaxed">
          Notes on development, design, and everyday life.
        </p>
      </header>

      {/* Posts */}
      <main className="max-w-[640px] w-full mx-auto px-5 pb-24 flex-1">
        <div className="animate-fade-up stagger-2">
          <h2 className="text-xs font-medium text-muted uppercase tracking-[0.15em] mb-4">
            Recent posts
          </h2>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <Link
                href="/"
                className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                  !selectedTag
                    ? 'border-accent text-accent'
                    : 'border-border text-muted hover:text-foreground'
                }`}
              >
                All
              </Link>
              {allTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${encodeURIComponent(tag)}`}
                  className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                    selectedTag === tag
                      ? 'border-accent text-accent'
                      : 'border-border text-muted hover:text-foreground'
                  }`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-0">
          {filteredPosts.length === 0 ? (
            <p className="text-muted py-20 text-center text-sm">
              {selectedTag
                ? `No posts found for tag: "${selectedTag}".`
                : 'No posts yet.'}
            </p>
          ) : (
            filteredPosts.map((post, index) => (
              <article
                key={post.slug}
                className={`animate-fade-up stagger-${Math.min(index + 3, 6)}`}
              >
                <Link
                  href={`/posts/${post.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0 py-3 -mx-3 px-3 rounded-lg transition-colors duration-150 hover:bg-surface-hover"
                >
                  <div className="sm:flex-1 min-w-0">
                    <span className="font-medium text-foreground group-hover:text-accent transition-colors duration-150 block">
                      {post.title}
                    </span>
                    {post.tags?.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={`${post.slug}-${tag}`}
                            className="text-[11px] leading-5 px-1.5 rounded-md border border-border text-muted"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-muted tabular-nums sm:ml-4 shrink-0 sm:pt-0.5">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </Link>
              </article>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
