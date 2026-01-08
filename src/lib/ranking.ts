import { loadSeed, Tool } from "@/lib/data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Base scores for each tier (0-100 Index scale)
const TIER_BASE_SCORES = { 1: 92.0, 2: 78.0, 3: 50.0 };
const VOTE_WEIGHT = 0.1; // Add 0.1 per vote
const MAX_SCORE = 99.9; // Cap at 99.9

interface VoteCounts {
  totalVotes: number;
  recentVotes: number;
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
 * Gets all tools with calculated rankings based on votes and tiers
 */
export async function getRankedTools(): Promise<Tool[]> {
  // Load all tools from seed.json
  const seed = loadSeed();
  const tools = seed.tools;

  // Fetch vote counts from Supabase
  const voteCountsMap = await getVoteCounts();

  // Map over tools and calculate new scores
  const rankedTools = tools.map((tool) => {
    const voteCounts = voteCountsMap.get(tool.slug) || {
      totalVotes: 0,
      recentVotes: 0,
    };

    // Formula 1: AI Index Score (0-100 scale)
    // Base score by tier, plus 0.1 per vote, capped at 99.9
    const tierBase = TIER_BASE_SCORES[tool.tier as keyof typeof TIER_BASE_SCORES] || TIER_BASE_SCORES[3];
    const votePoints = voteCounts.totalVotes * VOTE_WEIGHT;
    const rawScore = Math.min(tierBase + votePoints, MAX_SCORE);
    
    // Format to one decimal place string (e.g., "98.5")
    const indexScore = rawScore.toFixed(1);

    // Formula 2: Trend % (The Volatility)
    const trendPercentage = calculateTrendPercentage(voteCounts.recentVotes);

    // Return tool with updated fields
    return {
      ...tool,
      indexScore,
      rawScore,
      trendPercentage,
    };
  });

  // Sort by rawScore (highest first)
  rankedTools.sort((a, b) => (b.rawScore || 0) - (a.rawScore || 0));

  return rankedTools;
}

