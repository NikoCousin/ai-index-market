import { getRankedTools } from "@/lib/ranking";
import ToolDirectoryPaginated from "@/components/tool-directory-paginated";
import NewsSection from "@/components/news-section";

// Revalidate data every hour
export const revalidate = 3600;

export default async function Home() {
  // Use getRankedTools() instead of direct seed import
  const tools = await getRankedTools();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 relative">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full opacity-50 pointer-events-none" />

      {/* HERO TITLE (Static) */}
      <div className="mb-8 text-center relative">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-8">
          The Market Index of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
            AI
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-4">
          Discover, track, and analyze the top AI tools.
        </p>
      </div>

      {/* DIRECTORY SECTION (Contains Search Bar + Table) */}
      {/* This renders the Search Bar in the visual "Hero" spot, and the table below */}
      <ToolDirectoryPaginated tools={tools} />

      {/* NEWS SECTION */}
      <NewsSection />
    </main>
  );
}
