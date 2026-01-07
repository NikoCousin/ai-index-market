import { notFound } from "next/navigation";
import { loadSeed } from "@/lib/data";
import ToolDirectory from "@/components/tool-directory";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = loadSeed();
  const category = data.categories.find((c) => c.slug === slug);

  if (!category) return { title: "Category Not Found" };

  return {
    title: `Top ${category.name} AI Tools | IndexMarket`,
    description: `Compare the best ${category.name} AI tools and software.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const data = loadSeed();

  const category = data.categories.find((c) => c.slug === slug);
  if (!category) notFound();

  // Filter tools that belong to this category
  const tools = data.tools.filter((t) => t.categories.includes(slug));

  // Calculate stats for the header
  const avgRank =
    tools.length > 0
      ? Math.round(
          tools.reduce((acc, t) => acc + (t.score?.rankScore || 0), 0) /
            tools.length
        )
      : 0;

  const topTrend = tools.sort(
    (a, b) => (b.score?.trendScore || 0) - (a.score?.trendScore || 0)
  )[0];

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      {/* 1. HERO TITLE */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
          Top{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
            {category.name}
          </span>{" "}
          AI Tools
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Market cap and rankings for the top {category.name.toLowerCase()}{" "}
          tools. Updated continuously.
        </p>
      </div>

      {/* 2. DIRECTORY (Contains Search Bar... then Stats... then Table) */}
      <ToolDirectory tools={tools}>
        {/* 3. INJECTED STATS GRID (Will appear BETWEEN Search and Table) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 shadow-sm text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Total Tools
            </div>
            <div className="text-3xl font-bold text-white">{tools.length}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 shadow-sm text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Avg. Rank Score
            </div>
            <div className="text-3xl font-bold text-white">{avgRank}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 shadow-sm text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Top Trending
            </div>
            <div className="text-3xl font-bold text-green-400">
              {topTrend?.name || "-"}
            </div>
          </div>
        </div>
      </ToolDirectory>
    </main>
  );
}
