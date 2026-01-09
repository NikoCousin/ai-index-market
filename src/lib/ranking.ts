import { loadSeed, Tool } from "@/lib/data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAllTools } from "@/lib/supabase/queries";

// Base scores for each tier (0-100 Index scale)
const TIER_BASE_SCORES = { 1: 92.0, 2: 78.0, 3: 50.0 };
const VOTE_WEIGHT = 0.1; // Add 0.1 per vote
const MAX_SCORE = 99.9; // Cap at 99.9

interface VoteCounts {
  totalVotes: number;
  recentVotes: number;
}

/**
 * Helper function to parse android_installs_range string (e.g., '100M+', '50K') to number
 */
function parseAndroidInstalls(range: string | number | undefined | null): number {
  if (!range) return 0;
  if (typeof range === 'number') return range;
  
  const str = String(range).trim().toUpperCase();
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
}

/**
 * Calculate Market Index Score V1 using weighted formula:
 * 50% Website Traffic + 30% Social Attention + 20% Mobile Presence
 */
function calculateMarketIndexScoreV1(
  traffic: number | undefined | null,
  xMentions: number | undefined | null,
  youtubeVideos: number | undefined | null,
  iosReviews: number | undefined | null,
  androidInstalls: string | number | undefined | null,
  androidReviews: number | undefined | null
): number {
  // 50% Weight: Website Traffic component
  let trafficScore = 0;
  if (traffic && traffic > 0) {
    trafficScore = Math.min(Math.floor(Math.log10(traffic + 1) * 10), 100);
  }

  // 30% Weight: Social Attention component
  let socialScore = 0;
  const hasXMentions = xMentions && xMentions > 0;
  const hasYoutubeVideos = youtubeVideos && youtubeVideos > 0;

  if (hasXMentions || hasYoutubeVideos) {
    const xMentionsNormalized = hasXMentions
      ? Math.min(Math.floor(Math.log10(xMentions + 1) * 10), 100)
      : 0;
    
    const youtubeVideosNormalized = hasYoutubeVideos
      ? Math.min(Math.floor(Math.log10(youtubeVideos + 1) * 10), 100)
      : 0;

    if (hasXMentions && hasYoutubeVideos) {
      socialScore = (xMentionsNormalized + youtubeVideosNormalized) / 2;
    } else if (hasXMentions) {
      socialScore = xMentionsNormalized;
    } else if (hasYoutubeVideos) {
      socialScore = youtubeVideosNormalized;
    }
  }

  // 20% Weight: Mobile Presence component
  let mobileScore = 0;
  const androidInstallsNum = parseAndroidInstalls(androidInstalls);
  const hasAndroidInstalls = androidInstallsNum > 0;
  const hasIOSReviews = iosReviews && iosReviews > 0;
  const hasAndroidReviews = androidReviews && androidReviews > 0;

  if (hasAndroidInstalls || hasIOSReviews || hasAndroidReviews) {
    const androidInstallsNormalized = hasAndroidInstalls
      ? Math.min(Math.floor(Math.log10(androidInstallsNum + 1) * 10), 100)
      : 0;
    
    const iosReviewsNormalized = hasIOSReviews
      ? Math.min(Math.floor(Math.log10(iosReviews + 1) * 10), 100)
      : 0;
    
    const androidReviewsNormalized = hasAndroidReviews
      ? Math.min(Math.floor(Math.log10(androidReviews + 1) * 10), 100)
      : 0;

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
}

/**
 * Fetches vote counts from Supabase for all tools
 */
async function getVoteCounts(): Promise<Map<string, VoteCounts>> {
  const supabase = await createServerSupabaseClient();
  const voteCountsMap = new Map<string, VoteCounts>();

  try {
    // Get all votes with created_at timestamps
    const { data: allVotes, error } = await supabase
      .from("votes")
      .select("tool_slug, created_at");

    if (error) {
      console.error("Error fetching votes:", error);
      return voteCountsMap;
    }

    if (!allVotes) {
      return voteCountsMap;
    }

    // Calculate 24 hours ago timestamp
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Count votes per tool
    for (const vote of allVotes) {
      const slug = vote.tool_slug;
      if (!slug) continue;

      const createdAt = vote.created_at
        ? new Date(vote.created_at)
        : null;

      // Initialize if not exists
      if (!voteCountsMap.has(slug)) {
        voteCountsMap.set(slug, { totalVotes: 0, recentVotes: 0 });
      }

      const counts = voteCountsMap.get(slug)!;
      counts.totalVotes += 1;

      // Count recent votes (last 24 hours)
      if (createdAt && createdAt >= twentyFourHoursAgo) {
        counts.recentVotes += 1;
      }
    }
  } catch (error) {
    console.error("Error in getVoteCounts:", error);
  }

  return voteCountsMap;
}

/**
 * Calculates the trend percentage based on recent votes
 */
function calculateTrendPercentage(recentVotes: number): string {
  // Default stable baseline
  let trendPercentage = "+1.2%";

  if (recentVotes > 0) {
    // "Hype" Logic: If it has recent votes, amplify the percentage.
    // A small tool getting votes should look like it's exploding (+75%)
    const volatility = Math.min(98, recentVotes * 15 + 20);
    trendPercentage = `+${volatility.toFixed(1)}%`;
  }

  return trendPercentage;
}

/**
 * Gets all tools with calculated rankings using V1 Index Formula from Supabase
 */
export async function getRankedTools(): Promise<Tool[]> {
  // Fetch all tools from Supabase
  const dbTools = await getAllTools();
  
  // Load seed data as fallback
  const seed = loadSeed();
  const seedToolsMap = new Map(seed.tools.map(t => [t.slug, t]));

  // Fetch vote counts from Supabase
  const voteCountsMap = await getVoteCounts();

  // Merge database tools with seed data and calculate Market Index Score
  const rankedTools: Tool[] = dbTools.map((dbTool) => {
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

    const voteCounts = voteCountsMap.get(dbTool.tool_slug || dbTool.slug) || {
      totalVotes: 0,
      recentVotes: 0,
    };

    // Formula 2: Trend % (The Volatility)
    const trendPercentage = calculateTrendPercentage(voteCounts.recentVotes);

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
      categories: dbTool.categories || seedTool?.categories || [],
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
        developer: dbTool.developer || seedTool?.specs?.developer,
        launchYear: dbTool.launch_year || seedTool?.specs?.launchYear,
        hasApi: dbTool.has_api ?? seedTool?.specs?.hasApi ?? false,
        mobileApp: dbTool.mobile_app ?? seedTool?.specs?.mobileApp ?? false,
      },
      // Market Index Score V1
      indexScore: marketIndexScore.toString(),
      rawScore: marketIndexScore,
      marketIndexScore: marketIndexScore,
      trendPercentage,
      tier: seedTool?.tier,
    };
  });

  // If no database tools, fallback to seed data with old calculation
  if (rankedTools.length === 0) {
    const tools = seed.tools;
    const fallbackTools = tools.map((tool) => {
      const voteCounts = voteCountsMap.get(tool.slug) || {
        totalVotes: 0,
        recentVotes: 0,
      };

      const tierBase = TIER_BASE_SCORES[tool.tier as keyof typeof TIER_BASE_SCORES] || TIER_BASE_SCORES[3];
      const votePoints = voteCounts.totalVotes * VOTE_WEIGHT;
      const rawScore = Math.min(tierBase + votePoints, MAX_SCORE);
      const indexScore = rawScore.toFixed(1);
      const trendPercentage = calculateTrendPercentage(voteCounts.recentVotes);

      return {
        ...tool,
        indexScore,
        rawScore,
        trendPercentage,
      };
    });

    fallbackTools.sort((a, b) => (b.rawScore || 0) - (a.rawScore || 0));
    return fallbackTools;
  }

  // Sort by Market Index Score (highest first)
  rankedTools.sort((a, b) => (b.marketIndexScore || 0) - (a.marketIndexScore || 0));

  return rankedTools;
}

