import Link from "next/link";
import { notFound } from "next/navigation";
import { loadSeed, getRelatedTools, type Tool, type ToolUpdate } from "@/lib/data";
import { getToolBySlug } from "@/lib/supabase/queries";
import VoteButton from "@/components/vote-button";
import ToolLogo from "@/components/tool-logo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = loadSeed();
  const tool = data.tools.find((t) => t.slug === slug);

  if (!tool) return { title: "Tool Not Found" };

  return {
    title: `${tool.name} Review, Pros & Cons | AI Index`,
    description: tool.descriptionShort,
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  
  // Try to fetch from Supabase first
  let dbTool = await getToolBySlug(slug);
  
  // Always load seed data as fallback
  const data = loadSeed();
  const seedTool = data.tools.find((t) => t.slug === slug);

  if (!dbTool && !seedTool) {
    notFound();
  }

  // Merge database data with seed data (database takes priority, seed as fallback)
  const tool = {
    // Use database values first, fallback to seed
    name: dbTool?.tool_name || seedTool?.name || 'Unknown Tool',
    tool_name: dbTool?.tool_name || seedTool?.name,
    slug: dbTool?.slug || seedTool?.slug || slug,
    tagline: dbTool?.tagline || seedTool?.tagline || '',
    descriptionShort: dbTool?.description_short || seedTool?.descriptionShort,
    descriptionLong: dbTool?.description_long || seedTool?.descriptionLong,
    analyst_brief: dbTool?.analyst_brief || seedTool?.analyst_brief,
    pricingModel: dbTool?.pricing_model || seedTool?.pricingModel,
    pricing_model: dbTool?.pricing_model || seedTool?.pricing_model,
    categories: dbTool?.categories || seedTool?.categories || [],
    useCases: dbTool?.use_cases || seedTool?.useCases || [],
    pros: dbTool?.pros || seedTool?.pros,
    cons: dbTool?.cons || seedTool?.cons,
    lastVerifiedAt: dbTool?.last_verified_at || seedTool?.lastVerifiedAt,
    updates: dbTool?.updates || seedTool?.updates,
    // Merge links object
    links: {
      websiteUrl: dbTool?.website_url || seedTool?.links?.websiteUrl || seedTool?.links?.website_url,
      website_url: dbTool?.website_url || seedTool?.links?.website_url || seedTool?.links?.websiteUrl,
      pricingUrl: dbTool?.pricing_url || seedTool?.links?.pricingUrl,
      docsUrl: dbTool?.docs_url || seedTool?.links?.docsUrl,
      githubUrl: dbTool?.github_url || seedTool?.links?.githubUrl,
      xUrl: dbTool?.x_url || seedTool?.links?.xUrl,
      discordUrl: dbTool?.discord_url || seedTool?.links?.discordUrl,
      youtubeUrl: dbTool?.youtube_url || seedTool?.links?.youtubeUrl,
    },
    // Merge specs object
    specs: {
      developer: dbTool?.developer || seedTool?.specs?.developer,
      launchYear: dbTool?.launch_year || seedTool?.specs?.launchYear,
      hasApi: dbTool?.has_api ?? seedTool?.specs?.hasApi ?? false,
      mobileApp: dbTool?.mobile_app ?? seedTool?.specs?.mobileApp ?? false,
    },
    // Keep database-specific fields for Market Index Score V1 calculation
    traffic_monthly_est: dbTool?.traffic_monthly_est,
    x_mentions_30d: dbTool?.x_mentions_30d,
    youtube_videos_90d: dbTool?.youtube_videos_90d,
    ios_reviews_count: dbTool?.ios_reviews_count,
    android_installs_range: dbTool?.android_installs_range,
    android_reviews_count: dbTool?.android_reviews_count,
  };

  // Helper function to parse android_installs_range string (e.g., '100M+', '50K', '1B') to number
  const parseAndroidInstalls = (range: string | number | undefined | null): number => {
    if (!range) return 0;
    if (typeof range === 'number') return range;
    
    const str = String(range).trim().toUpperCase();
    // Remove any non-digit characters except for K, M, B, +
    const match = str.match(/^([\d.]+)([KMB]?)\+?$/);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const multiplier = match[2];
    
    switch (multiplier) {
      case 'K': return value * 1000;
      case 'M': return value * 1000000;
      case 'B': return value * 1000000000;
      default: return value;
    }
  };

  // Calculate Market Index Score V1 using weighted formula:
  // 50% Website Traffic + 30% Social Attention + 20% Mobile Presence
  const calculateMarketIndexScore = (
    traffic: number | undefined | null,
    xMentions: number | undefined | null,
    youtubeVideos: number | undefined | null,
    iosReviews: number | undefined | null,
    androidInstalls: string | number | undefined | null,
    androidReviews: number | undefined | null
  ): number => {
    // 50% Weight: Website Traffic component
    let trafficScore = 0;
    if (traffic && traffic > 0) {
      trafficScore = Math.min(Math.floor(Math.log10(traffic + 1) * 10), 100);
    }

    // 30% Weight: Social Attention component
    // Combine x_mentions_30d and youtube_videos_90d using logarithmic scale
    let socialScore = 0;
    const hasXMentions = xMentions && xMentions > 0;
    const hasYoutubeVideos = youtubeVideos && youtubeVideos > 0;

    if (hasXMentions || hasYoutubeVideos) {
      // Normalize each metric to 0-100 using logarithmic scale
      const xMentionsNormalized = hasXMentions
        ? Math.min(Math.floor(Math.log10(xMentions + 1) * 10), 100)
        : 0;
      
      const youtubeVideosNormalized = hasYoutubeVideos
        ? Math.min(Math.floor(Math.log10(youtubeVideos + 1) * 10), 100)
        : 0;

      // Average the two social metrics
      if (hasXMentions && hasYoutubeVideos) {
        socialScore = (xMentionsNormalized + youtubeVideosNormalized) / 2;
      } else if (hasXMentions) {
        socialScore = xMentionsNormalized;
      } else if (hasYoutubeVideos) {
        socialScore = youtubeVideosNormalized;
      }
    }

    // 20% Weight: Mobile Presence component
    // Scale android_installs_range and ios_reviews_count
    let mobileScore = 0;
    const androidInstallsNum = parseAndroidInstalls(androidInstalls);
    const hasAndroidInstalls = androidInstallsNum > 0;
    const hasIOSReviews = iosReviews && iosReviews > 0;
    const hasAndroidReviews = androidReviews && androidReviews > 0;

    if (hasAndroidInstalls || hasIOSReviews || hasAndroidReviews) {
      // Normalize each metric to 0-100 using logarithmic scale
      const androidInstallsNormalized = hasAndroidInstalls
        ? Math.min(Math.floor(Math.log10(androidInstallsNum + 1) * 10), 100)
        : 0;
      
      const iosReviewsNormalized = hasIOSReviews
        ? Math.min(Math.floor(Math.log10(iosReviews + 1) * 10), 100)
        : 0;
      
      const androidReviewsNormalized = hasAndroidReviews
        ? Math.min(Math.floor(Math.log10(androidReviews + 1) * 10), 100)
        : 0;

      // Average available mobile metrics
      const mobileMetrics = [
        androidInstallsNormalized,
        iosReviewsNormalized,
        androidReviewsNormalized
      ].filter(score => score > 0);
      
      if (mobileMetrics.length > 0) {
        mobileScore = mobileMetrics.reduce((sum, score) => sum + score, 0) / mobileMetrics.length;
      }
    }

    // Weighted combination: 50% traffic + 30% social + 20% mobile
    const finalScore = (trafficScore * 0.5) + (socialScore * 0.3) + (mobileScore * 0.2);
    
    return Math.min(Math.max(0, Math.round(finalScore)), 100);
  };

  const marketIndexScore = calculateMarketIndexScore(
    tool.traffic_monthly_est,
    tool.x_mentions_30d,
    tool.youtube_videos_90d,
    tool.ios_reviews_count,
    tool.android_installs_range,
    tool.android_reviews_count
  );

  // Fetch related tools with optional chaining to prevent crash
  const firstCategory = tool?.categories?.[0] || 'uncategorized';
  const relatedTools = getRelatedTools(tool.slug || slug, firstCategory);

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl text-slate-200">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-400">
        <Link href="/tools" className="hover:text-blue-400 transition-colors">
          Tools
        </Link>
        <span>/</span>
        <span className="font-medium text-white">{tool.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* === LEFT MAIN COLUMN === */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Section */}
          <div className="flex items-start gap-6">
            {/* === CHANGED: LEFT COLUMN (Logo + Vote Button) === */}
            <div className="flex flex-col items-center gap-3">
              <ToolLogo
                name={tool.name}
                tool_name={tool.tool_name}
                websiteUrl={tool.links?.website_url || tool.links?.websiteUrl || undefined}
                className="h-24 w-24 flex-shrink-0 rounded-2xl"
              />
            </div>
            {/* ============================================== */}

            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  {tool.name}
                </h1>
                {/* Minimalist AI Market Index Score Badge */}
                {marketIndexScore > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50">
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                      AI Market Index
                    </span>
                    <span className="text-lg font-bold text-white tabular-nums">
                      {marketIndexScore}
                    </span>
                  </div>
                )}
              </div>
              {tool.tagline && (
                <p className="text-lg text-slate-300 leading-relaxed">
                  {tool.tagline}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {/* The New Vote Button (Vertical Mode) */}
                <VoteButton slug={tool.slug} />
                {(tool.pricingModel || tool.pricing_model) && (
                  <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-400 border border-slate-700">
                    {tool.pricingModel || tool.pricing_model}
                  </span>
                )}
                {tool.lastVerifiedAt && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-400 border border-slate-700">
                    Verified{" "}
                    {new Date(tool.lastVerifiedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          {(tool.analyst_brief || tool.descriptionLong || tool.descriptionShort) && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
              <h2 className="text-xl font-bold text-white mb-4">
                About {tool.name}
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                {tool.analyst_brief || tool.descriptionLong || tool.descriptionShort}
              </p>

            {tool?.categories && tool.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tool.categories.map((cat: string) => (
                  <Link
                    key={cat}
                    href={`/categories/${cat}`}
                    className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:border-blue-500 hover:text-blue-400 transition-colors min-h-[36px] flex items-center justify-center"
                  >
                    #{cat}
                  </Link>
                ))}
              </div>
            )}
          </div>
          )}

          {/* Latest Updates Section */}
          {tool.updates && tool.updates.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
              <h2 className="text-xl font-bold text-white mb-6">
                Latest Updates
              </h2>
              <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-700"></div>

                {/* Timeline Items */}
                <div className="space-y-8">
                  {tool.updates.map((update: ToolUpdate, index: number) => {
                    const getTypeColor = () => {
                      switch (update.type) {
                        case "MAJOR":
                          return "bg-blue-500 border-blue-400";
                        case "MINOR":
                          return "bg-slate-500 border-slate-400";
                        case "NEWS":
                          return "bg-purple-500 border-purple-400";
                        default:
                          return "bg-slate-500 border-slate-400";
                      }
                    };

                    const getTypeBadgeColor = () => {
                      switch (update.type) {
                        case "MAJOR":
                          return "bg-blue-500/20 text-blue-400 border-blue-500/30";
                        case "MINOR":
                          return "bg-slate-500/20 text-slate-400 border-slate-500/30";
                        case "NEWS":
                          return "bg-purple-500/20 text-purple-400 border-purple-500/30";
                        default:
                          return "bg-slate-500/20 text-slate-400 border-slate-500/30";
                      }
                    };

                    return (
                      <div key={index} className="relative flex gap-6">
                        {/* Timeline Dot */}
                        <div className="relative z-10 flex-shrink-0">
                          <div
                            className={`h-12 w-12 rounded-full border-2 ${getTypeColor()} flex items-center justify-center shadow-lg`}
                          >
                            <div className="h-3 w-3 rounded-full bg-white"></div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-8">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold border ${getTypeBadgeColor()}`}
                            >
                              {update.type}
                            </span>
                            <span className="text-sm text-slate-400">
                              {new Date(update.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {update.title}
                          </h3>
                          <p className="text-slate-300 leading-relaxed">
                            {update.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Pros & Cons Section */}
          {(tool.pros || tool.cons) && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pros */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                  <span>👍</span> The Good
                </h3>
                <ul className="space-y-3">
                  {tool.pros?.map((pro: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {pro}
                    </li>
                  )) || (
                    <span className="text-slate-500 italic">
                      No pros listed.
                    </span>
                  )}
                </ul>
              </div>

              {/* Cons */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                  <span>👎</span> The Bad
                </h3>
                <ul className="space-y-3">
                  {tool.cons?.map((con: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <svg
                        className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      {con}
                    </li>
                  )) || (
                    <span className="text-slate-500 italic">
                      No cons listed.
                    </span>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* === RIGHT SIDEBAR === */}
        <div className="space-y-6">
          {/* CTA Button */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            {(tool.links?.website_url || tool.links?.websiteUrl) && (
              <>
                <div className="mb-4">
                  <span className="text-sm text-slate-500">Website</span>
                  <div className="font-medium text-slate-200 break-words truncate">
                    {tool.links?.website_url || tool.links?.websiteUrl}
                  </div>
                </div>
                <a
                  href={tool.links?.website_url || tool.links?.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-xl bg-blue-600 px-4 py-4 text-center text-sm font-semibold text-white hover:bg-blue-500 transition-colors min-h-[48px] flex items-center justify-center"
                >
                  Visit Website ↗
                </a>
              </>
            )}
          </div>

          {/* Pricing Model */}
          {tool.pricing_model && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                Pricing
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {tool.pricing_model}
              </p>
            </div>
          )}

          {/* Platforms */}
          {tool.platforms_string && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                Platforms
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {tool.platforms_string}
              </p>
            </div>
          )}

          {/* Tech Specs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Tech Specs
            </h3>
            <div className="space-y-4">
              {tool.specs?.developer && (
                <div className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                  <span className="text-slate-500 text-sm">Developer</span>
                  <span className="text-slate-200 text-sm font-medium">
                    {tool.specs.developer}
                  </span>
                </div>
              )}
              {tool.specs?.launchYear && (
                <div className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                  <span className="text-slate-500 text-sm">Launched</span>
                  <span className="text-slate-200 text-sm font-medium">
                    {tool.specs.launchYear}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                <span className="text-slate-500 text-sm">API Available</span>
                <span
                  className={`text-sm font-medium ${
                    tool.specs?.hasApi ? "text-green-400" : "text-slate-500"
                  }`}
                >
                  {tool.specs?.hasApi ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                <span className="text-slate-500 text-sm">Mobile App</span>
                <span
                  className={`text-sm font-medium ${
                    tool.specs?.mobileApp ? "text-green-400" : "text-slate-500"
                  }`}
                >
                  {tool.specs?.mobileApp ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* AI Market Index Score Section */}
          {marketIndexScore > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                AI Market Index
              </h3>
              <div className="flex items-center justify-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="text-center">
                  <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider">
                    Overall Score
                  </div>
                  <div className="text-5xl font-mono font-bold text-white mb-2">
                    {marketIndexScore}
                  </div>
                  <div className="text-xs text-slate-400">
                    Calculated from traffic data
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Market Data */}
          {/* <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Market Data
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-500 mb-1">AI Index</div>
                <div className="text-xl font-mono font-bold text-white">
                  {tool.indexScore || tool.score?.rankScore?.toFixed(1) || "-"}
                </div>
              </div>
              {tool.trendPercentage && (
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">Trend</div>
                  <div className="text-xl font-mono font-bold text-green-400">
                    {tool.trendPercentage}
                  </div>
                </div>
              )}
            </div>
          </div> */}
        </div>
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="mt-16 pt-16 border-t border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-6">
            Alternatives to consider
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((t: Tool) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group block rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center gap-4 mb-3">
                  <ToolLogo
                    name={t.name}
                    websiteUrl={t.links?.website_url || t.links?.websiteUrl}
                    className="h-10 w-10 flex-shrink-0 rounded-lg"
                  />
                  <div>
                    <div className="font-semibold text-white group-hover:text-blue-400">
                      {t.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t.pricingModel}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">
                  {t.tagline}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
