import Link from "next/link";
import { blogPosts, type BlogPost } from "@/lib/blog-data";

export const metadata = {
  title: "AI News & Insights | IndexMarket Blog",
  description:
    "Latest news, comparisons, and tutorials from the world of Artificial Intelligence.",
};

export default function BlogIndexPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full opacity-50 pointer-events-none" />

      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6">
          Latest{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Insights
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Deep dives, comparisons, and industry news. Stay ahead of the curve.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post: BlogPost) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300"
          >
            {/* Image Placeholder */}
            <div className="h-48 w-full bg-slate-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300 backdrop-blur-md border border-blue-500/30">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-300">
                    {post.author}
                  </span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
                <div>{post.readTime}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
