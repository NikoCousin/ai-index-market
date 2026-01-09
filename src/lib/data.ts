import seedData from "../../data/seed.json";
// ^ If this import fails, change it to: import seedData from "../../data/seed.json";

// --- 1. Types ---

export type PricingModel = "FREE" | "FREEMIUM" | "PAID";
export type ToolStatus = "ACTIVE" | "ACQUIRED" | "DISCONTINUED";
export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type PlatformType = "WEB" | "IOS" | "ANDROID" | "DESKTOP" | "API";
export type UpdateType = "MAJOR" | "MINOR" | "NEWS";

export type ToolUpdate = {
  date: string;
  title: string;
  description: string;
  type: UpdateType;
};

export type Tool = {
  name: string;
  slug: string;
  tagline: string;
  descriptionShort?: string;
  descriptionLong?: string;
  analyst_brief?: string; // New analyst brief field
  status?: ToolStatus;
  skillLevel?: SkillLevel;
  pricingModel?: PricingModel;
  pricing_model?: string; // New string-based pricing model field
  platforms: PlatformType[];
  platforms_string?: string; // New string-based platforms field
  categories: string[];
  useCases: string[];
  links?: {
    websiteUrl?: string;
    website_url?: string; // New website_url field
    pricingUrl?: string;
    docsUrl?: string;
    githubUrl?: string;
    xUrl?: string;
    discordUrl?: string;
    youtubeUrl?: string;
  };
  pros?: string[]; // List of good things
  cons?: string[]; // List of bad things
  specs?: {
    // Technical details
    developer: string;
    launchYear: string;
    hasApi: boolean;
    mobileApp: boolean;
  };
  lastVerifiedAt?: string;
  updates?: ToolUpdate[];
  tier?: number; // 1 = The Kings, 2 = The Challengers, 3 = The Rest
  indexScore?: string; // Formatted 0-100 index score (e.g., "98.5")
  rawScore?: number; // Raw numeric score for sorting (0-99.9)
  rankScore?: number; // Legacy: Calculated market cap-style ranking (deprecated)
  trendPercentage?: string; // Calculated trend percentage (e.g., "+1.2%")
  // Kept as 'score' (singular) to match your existing pages
  score?: {
    popularityScore?: number;
    trendScore?: number;
    freshnessScore?: number;
    communityScore?: number;
    rankScore?: number;
  };
  // Database columns for Market Index Score V1 calculation
  traffic_monthly_est?: number;
  x_mentions_30d?: number;
  youtube_videos_90d?: number;
  ios_reviews_count?: number;
  android_installs_range?: number | string;
  android_reviews_count?: number;
  tool_name?: string; // Database tool name
  tool_slug?: string; // Database tool slug
  marketIndexScore?: number; // Calculated Market Index Score V1 (0-100)
};

export type Category = {
  name: string;
  slug: string;
  description?: string;
};

export type SeedData = {
  categories: Category[];
  useCases: { name: string; slug: string }[];
  tools: Tool[];
};

// --- 2. The Fix: Re-adding loadSeed ---

// Used by your /tools pages
export function loadSeed(): SeedData {
  return seedData as any as SeedData;
}

// --- 3. New Helpers (For Category Pages) ---

/**
 * Maps URL slugs to database category names
 * This bridges the gap between URL-friendly slugs and database category strings
 */
export function getCategoryNameFromSlug(slug: string): string {
  const slugToDbName: Record<string, string> = {
    // Direct mappings
    'audio': 'AI Voice',
    'audio-voice': 'AI Voice',
    'agents': 'Developer Tool',
    'automation-agents': 'Developer Tool',
    'marketing': 'Marketing',
    'marketing-tools': 'Marketing',
    'dev-tools': 'Developer Tool',
    'developer-tools': 'Developer Tool',
    'llms': 'AI Assistant',
    // Keep other mappings as-is (fallback to unslugify)
    'video-generation': 'Video Generation',
    'image-generation': 'Image Generation',
    'productivity': 'Productivity',
  };

  // Return mapped name if exists, otherwise return null to trigger fallback
  return slugToDbName[slug] || '';
}

// Used by your new /categories/[slug] page
export async function getToolsByCategory(categorySlug: string) {
  const data = loadSeed();
  return data.tools.filter((tool) => tool.categories.includes(categorySlug));
}

export async function getCategory(slug: string) {
  const data = loadSeed();
  return data.categories.find((c) => c.slug === slug);
}

// ... existing code ...

// --- Add these new helpers for Use Cases ---

export async function getUseCase(slug: string) {
  const data = loadSeed();
  // We search the 'useCases' array inside seed.json
  return data.useCases.find((u) => u.slug === slug);
}

export async function getToolsByUseCase(useCaseSlug: string) {
  const data = loadSeed();
  // Filter tools that have this specific use case slug
  return data.tools.filter((tool) => tool.useCases.includes(useCaseSlug));
}

// --- Helper for Related Tools ---

export function getRelatedTools(currentSlug: string, categorySlug: string) {
  const data = loadSeed();
  // Return tools in the same category, excluding the current tool
  return data.tools
    .filter(
      (tool) =>
        tool.slug !== currentSlug && tool.categories.includes(categorySlug)
    )
    .slice(0, 6); // Limit to 6 related tools
}
