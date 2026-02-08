import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <h1 className="font-lora text-4xl font-bold text-gray-900 mb-2">
            Leo의 블로그
          </h1>
          <p className="text-gray-600">생각과 경험을 기록하는 공간</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 py-12">아직 작성된 글이 없습니다.</p>
          ) : (
            posts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/posts/${post.slug}`} className="block">
                  <h2 className="font-lora text-3xl font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 text-lg mb-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <time>{post.date}</time>
                    <span>·</span>
                    <span>{Math.ceil(post.content.length / 500)} min read</span>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center text-gray-500 text-sm">
          © 2026 Leo. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
