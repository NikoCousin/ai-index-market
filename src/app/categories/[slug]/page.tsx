import { notFound } from "next/navigation";
import { loadSeed, type Tool, getCategoryNameFromSlug } from "@/lib/data";
import ToolDirectory from "@/components/tool-directory";
import { getToolsByCategory } from "@/lib/supabase/queries";
import { calculateMarketIndexScoreV1 } from "@/lib/ranking";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Converts a URL slug (e.g., "video-generation") to a category name (e.g., "Video Generation")
 * by replacing hyphens with spaces and capitalizing words
 * Used as a fallback when no explicit mapping exists
 */
function unslugifyCategory(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
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
  const seed = loadSeed();

  const category = seed.categories.find((c) => c.slug === slug);
  if (!category) notFound();

  // Get database category name using the mapping function
  // This bridges the gap between URL slugs and database category strings
  // Priority: 1) Explicit mapping, 2) Seed category name, 3) Unslugified slug
  const mappedDbName = getCategoryNameFromSlug(slug);
  const categoryName = mappedDbName || category.name || unslugifyCategory(slug);
  
  // Debug: Log the normalization
  console.log(`Category slug: "${slug}" → Database category name: "${categoryName}"`);

  // Fetch tools from Supabase filtered by category
  const dbTools = await getToolsByCategory(categoryName);
  
  // Create a map of seed tools for fallback
  const seedToolsMap = new Map(seed.tools.map(t => [t.slug, t]));

  // Merge database tools with seed data and calculate Market Index Score
  const tools: Tool[] = dbTools.map((dbTool) => {
    const seedTool = seedToolsMap.get(dbTool.tool_slug || dbTool.slug);
    
    // Calculate Market Index Score V1
    const marketIndexScore = calculateMarketIndexScoreV1(
      dbTool.traffic_monthly_est,
      dbTool.x_mentions_30d,
      dbTool.youtube_videos_90d,
      dbTool.ios_reviews_count,
      dbTool.android_installs_range,
      dbTool.android_reviews_count
    );

    // Merge database data with seed data (database takes priority)
    return {
      // Use database values first, fallback to seed
      name: dbTool.tool_name || seedTool?.name || 'Unknown Tool',
      tool_name: dbTool.tool_name || seedTool?.name,
      slug: dbTool.tool_slug || dbTool.slug || seedTool?.slug || '',
      tool_slug: dbTool.tool_slug || dbTool.slug || seedTool?.slug,
      tagline: dbTool.tagline || seedTool?.tagline || '',
      descriptionShort: dbTool.description_short || seedTool?.descriptionShort,
      descriptionLong: dbTool.description_long || seedTool?.descriptionLong,
      analyst_brief: dbTool.analyst_brief || seedTool?.analyst_brief,
      pricingModel: dbTool.pricing_model || seedTool?.pricingModel,
      pricing_model: dbTool.pricing_model || seedTool?.pricing_model,
      categories: dbTool.category ? [dbTool.category] : (dbTool.categories || seedTool?.categories || []),
      useCases: dbTool.use_cases || seedTool?.useCases || [],
      pros: dbTool.pros || seedTool?.pros,
      cons: dbTool.cons || seedTool?.cons,
      lastVerifiedAt: dbTool.last_verified_at || seedTool?.lastVerifiedAt,
      updates: dbTool.updates || seedTool?.updates,
      platforms: seedTool?.platforms || [],
      platforms_string: dbTool.platforms_string || seedTool?.platforms_string,
      // Merge links object
      links: {
        websiteUrl: dbTool.website_url || seedTool?.links?.websiteUrl || seedTool?.links?.website_url,
        website_url: dbTool.website_url || seedTool?.links?.website_url || seedTool?.links?.websiteUrl,
        pricingUrl: dbTool.pricing_url || seedTool?.links?.pricingUrl,
        docsUrl: dbTool.docs_url || seedTool?.links?.docsUrl,
        githubUrl: dbTool.github_url || seedTool?.links?.githubUrl,
        xUrl: dbTool.x_url || seedTool?.links?.xUrl,
        discordUrl: dbTool.discord_url || seedTool?.links?.discordUrl,
        youtubeUrl: dbTool.youtube_url || seedTool?.links?.youtubeUrl,
      },
      // Merge specs object
      specs: {
        developer: dbTool.developer || seedTool?.specs?.developer || 'Unknown',
        launchYear: dbTool.launch_year || seedTool?.specs?.launchYear || 'Unknown',
        hasApi: dbTool.has_api ?? seedTool?.specs?.hasApi ?? false,
        mobileApp: dbTool.mobile_app ?? seedTool?.specs?.mobileApp ?? false,
      },
      // Database Market Index Score V1 fields
      traffic_monthly_est: dbTool.traffic_monthly_est,
      x_mentions_30d: dbTool.x_mentions_30d,
      youtube_videos_90d: dbTool.youtube_videos_90d,
      ios_reviews_count: dbTool.ios_reviews_count,
      android_installs_range: dbTool.android_installs_range,
      android_reviews_count: dbTool.android_reviews_count,
      // Calculated Market Index Score
      marketIndexScore,
    };
  });

  // Sort tools by Market Index Score (highest first)
  tools.sort((a, b) => (b.marketIndexScore || 0) - (a.marketIndexScore || 0));

  // Calculate stats for the header using Market Index Score
  const avgIndexScore =
    tools.length > 0
      ? Math.round(
          tools.reduce((acc, t) => acc + (t.marketIndexScore || 0), 0) /
            tools.length
        )
      : 0;

  const topTool = tools[0];

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
              Avg. Index Score
            </div>
            <div className="text-3xl font-bold text-white">{avgIndexScore}</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 shadow-sm text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Top Tool
            </div>
            <div className="text-3xl font-bold text-green-400">
              {topTool?.name || "-"}
            </div>
          </div>
        </div>
      </ToolDirectory>
    </main>
  );
}
