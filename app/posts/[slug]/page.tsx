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
  const readingTime = Math.ceil(post.content.length / 500);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
          >
            ← 목록으로
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="font-lora text-5xl font-bold mb-6 text-gray-900 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <time>{post.date}</time>
            <span>·</span>
            <span>{readingTime} min read</span>
          </div>
        </header>

        <div
          className="prose prose-lg max-w-none
            font-lora
            prose-headings:font-lora prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6
            prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-800 prose-p:text-xl prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-gray-900 prose-a:underline prose-a:decoration-gray-400 prose-a:underline-offset-4
            hover:prose-a:decoration-gray-900
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
            prose-blockquote:border-l-4 prose-blockquote:border-gray-900 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700
            prose-ul:my-6 prose-li:my-2 prose-li:text-xl prose-li:text-gray-800
            prose-img:rounded-lg prose-img:my-8"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>

      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center text-gray-500 text-sm">
          © 2026 Leo. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
