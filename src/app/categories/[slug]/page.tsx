import { notFound } from "next/navigation";
import { loadSeed } from "@/lib/data";
import ToolsTable from "@/components/tools-table";

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
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-2">
          Top <span className="text-blue-400">{category.name}</span> AI Tools
        </h1>
        <p className="text-lg text-slate-400">
          Market cap and rankings for the top {category.name.toLowerCase()}{" "}
          tools. Updated continuously.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Tools
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {tools.length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Avg. Rank Score
          </div>
          <div className="text-2xl font-bold text-slate-900">{avgRank}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Top Trending
          </div>
          <div className="text-2xl font-bold text-green-600">
            {topTrend?.name || "-"}
          </div>
        </div>
      </div>

      {/* Tools Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
        <ToolsTable tools={tools} />
      </div>
    </main>
  );
}
