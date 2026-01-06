import { loadSeed } from "@/lib/data";
import SearchBar from "@/components/search-bar";
import ToolsTable from "@/components/tools-table";

export const revalidate = 3600;

export default async function ToolsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const seed = loadSeed();

  const params = await searchParams;
  const query = params?.q?.toLowerCase() || "";

  const tools = [...seed.tools]
    .filter((t) => {
      if (!query) return true;
      const searchContent = `${t.name} ${t.tagline} ${t.categories.join(
        " "
      )}`.toLowerCase();
      return searchContent.includes(query);
    })
    .sort((a, b) => (b.score?.rankScore ?? 0) - (a.score?.rankScore ?? 0));

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full opacity-50 pointer-events-none" />

      {/* HERO SECTION */}
      <div className="mb-20 text-center relative">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-8">
          The Market Cap of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
            AI
          </span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Discover, track, and analyze the top AI tools. Real-time rankings
          based on popularity, trend, and community score.
        </p>

        {/* Search Bar is back here! */}
        <SearchBar />

        {/* Stats Badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-300 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {seed.tools.length} Tools Tracked
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-300 shadow-sm">
            <span>🔥</span>
            Top Trend:{" "}
            <span className="text-white font-bold">{seed.tools[0]?.name}</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {tools.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
          <ToolsTable tools={tools} />
        </div>
      ) : (
        <div className="text-center py-20 border border-slate-800 rounded-2xl bg-slate-900/50 text-slate-400">
          <p className="text-lg">No tools found for "{query}"</p>
          <button
            onClick={() => (window.location.href = "/tools")}
            className="mt-2 text-blue-400 hover:underline text-sm"
          >
            Clear search
          </button>
        </div>
      )}
    </main>
  );
}
