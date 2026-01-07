import { notFound } from "next/navigation";
import { loadSeed } from "@/lib/data";
import ToolDirectory from "@/components/tool-directory";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = loadSeed();
  // Find the use case in the data (assuming you have a useCases array in seed)
  // If useCases aren't separated in seed, we can just display the slug formatted
  const useCaseName =
    slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

  return {
    title: `Best AI Tools for ${useCaseName} | IndexMarket`,
    description: `Top rated AI tools and software for ${useCaseName}.`,
  };
}

export default async function UseCasePage({ params }: Props) {
  const { slug } = await params;
  const data = loadSeed();

  // FORMATTING: Convert slug "content-creation" -> "Content Creation"
  const useCaseName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // FILTERING: Logic to find tools for this use case
  // (Checks if the tool's useCases array contains this slug)
  const tools = data.tools.filter((t) => t.useCases.includes(slug));

  if (tools.length === 0) {
    // Optional: Handle empty state or 404 if strictly required
    // notFound();
  }

  // CALCULATE STATS
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
          Best AI Tools for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
            {useCaseName}
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Compare the top performing AI software for {useCaseName.toLowerCase()}
          . Ranked by market impact.
        </p>
      </div>

      {/* 2. DIRECTORY (Search + Stats + Table) */}
      <ToolDirectory tools={tools}>
        {/* 3. INJECTED STATS (Sandwiched!) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stat 1: Count */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 shadow-sm text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Available Tools
            </div>
            <div className="text-3xl font-bold text-white">{tools.length}</div>
          </div>

          {/* Stat 2: Avg Rank */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 shadow-sm text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Avg. Market Score
            </div>
            <div className="text-3xl font-bold text-white">{avgRank}</div>
          </div>

          {/* Stat 3: Top Trend */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 shadow-sm text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Category Leader
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
