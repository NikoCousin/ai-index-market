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
  status?: ToolStatus;
  skillLevel?: SkillLevel;
  pricingModel?: PricingModel;
  platforms: PlatformType[];
  categories: string[];
  useCases: string[];
  links?: {
    websiteUrl?: string;
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
