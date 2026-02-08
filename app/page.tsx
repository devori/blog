import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-4xl mx-auto px-4 py-16">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Leo의 블로그
          </h1>
          <p className="text-gray-600 text-lg">생각과 경험을 기록하는 공간</p>
        </header>

        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">아직 작성된 글이 없습니다.</p>
          ) : (
            posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100"
              >
                <Link href={`/posts/${post.slug}`}>
                  <h2 className="text-2xl font-bold mb-2 text-gray-800 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <time className="text-sm text-gray-500 mb-3 block">{post.date}</time>
                {post.excerpt && <p className="text-gray-600">{post.excerpt}</p>}
              </article>
            ))
          )}
        </div>
      </main>

      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>© 2026 Leo. All rights reserved.</p>
      </footer>
    </div>
  );
}
