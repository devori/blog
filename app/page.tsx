import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import Nav from '@/components/nav';
import Footer from '@/components/footer';

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      {/* Hero */}
      <header className="max-w-[640px] w-full mx-auto px-5 pt-20 pb-16 animate-fade-up stagger-1">
        <p className="text-sm text-accent font-medium mb-4 tracking-wide">블로그</p>
        <h1 className="font-lora text-3xl sm:text-4xl font-bold text-foreground leading-[1.3] tracking-tight mb-4">
          생각과 경험을 기록합니다.
        </h1>
        <p className="text-base text-muted leading-relaxed">
          개발, 디자인, 그리고 일상에 대한 이야기.
        </p>
      </header>

      {/* Posts */}
      <main className="max-w-[640px] w-full mx-auto px-5 pb-24 flex-1">
        <div className="animate-fade-up stagger-2">
          <h2 className="text-xs font-medium text-muted uppercase tracking-[0.15em] mb-6">
            최근 글
          </h2>
        </div>

        <div className="space-y-0">
          {posts.length === 0 ? (
            <p className="text-muted py-20 text-center text-sm">
              아직 작성된 글이 없습니다.
            </p>
          ) : (
            posts.map((post, index) => (
              <article
                key={post.slug}
                className={`animate-fade-up stagger-${Math.min(index + 3, 6)}`}
              >
                <Link
                  href={`/posts/${post.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0 py-3 -mx-3 px-3 rounded-lg transition-colors duration-150 hover:bg-surface-hover"
                >
                  <span className="font-medium text-foreground group-hover:text-accent transition-colors duration-150 sm:flex-1">
                    {post.title}
                  </span>
                  <span className="text-sm text-muted tabular-nums sm:ml-4 shrink-0">
                    {new Date(post.date).toLocaleDateString('ko-KR', {
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
