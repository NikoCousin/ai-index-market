import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/blog-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return { title: "Article Not Found" };

  return {
    title: `${post.title} | AI Index Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen pb-20">
      {/* 1. HERO SECTION WITH IMAGE BACKGROUND */}
      <div className="relative h-[400px] w-full overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-slate-900">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover opacity-60"
          />
          {/* Gradient fade at bottom to blend into content */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
        </div>

        {/* Title Container */}
        <div className="absolute bottom-0 left-0 w-full p-8 pb-12">
          <div className="container mx-auto max-w-4xl">
            <span className="inline-block rounded-full bg-blue-600/20 px-3 py-1 text-xs font-bold text-blue-400 backdrop-blur-md border border-blue-500/30 mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 shadow-sm">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-slate-300 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white">
                  {post.author[0]}
                </div>
                <span className="font-medium text-white">{post.author}</span>
              </div>
              <span>•</span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ARTICLE CONTENT */}
      <div className="container mx-auto px-4 max-w-4xl mt-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Text Column */}
        <div className="lg:col-span-3">
          {/* We use 'prose-invert' from Tailwind Typography to automatically style HTML content in dark mode */}
          <article className="prose prose-invert prose-lg max-w-none text-slate-300 prose-headings:text-white prose-a:text-blue-400">
            <p className="lead text-xl text-slate-200 mb-8 font-light leading-relaxed">
              {post.excerpt}
            </p>
            {/* SECURITY NOTE: In a real app with user-submitted content, 
              you would use a library like 'dompurify' here. 
              Since this is your static data, it is safe. 
            */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        </div>

        {/* Sidebar (Share & Related) */}
        <div className="hidden lg:block space-y-8">
          <div className="sticky top-24">
            <div className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Share this
            </div>
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-sm text-slate-300 hover:bg-slate-800 transition-colors text-left">
                <span>🐦</span> Share on X
              </button>
              <button className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-sm text-slate-300 hover:bg-slate-800 transition-colors text-left">
                <span>🔗</span> Copy Link
              </button>
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-blue-900/10 border border-blue-500/20">
              <h4 className="font-bold text-white mb-2">
                Build your own Index?
              </h4>
              <p className="text-xs text-blue-200 mb-4">
                Get the latest AI tools delivered to your inbox weekly.
              </p>
              <button className="w-full rounded-lg bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-500">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
