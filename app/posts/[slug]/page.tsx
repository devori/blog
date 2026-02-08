import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { remark } from 'remark';
import html from 'remark-html';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <article className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 mb-8 inline-block"
        >
          ← 목록으로
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
          <time className="text-gray-500">{post.date}</time>
        </header>

        <div
          className="prose prose-lg max-w-none
            prose-headings:text-gray-900
            prose-p:text-gray-700
            prose-a:text-blue-600
            prose-strong:text-gray-900
            prose-code:text-purple-600
            prose-pre:bg-gray-900
            prose-pre:text-gray-100"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
    </div>
  );
}
