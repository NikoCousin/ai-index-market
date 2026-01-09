import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getToolsByCategory(categoryName: string) {
  const supabase = await createServerSupabaseClient();

  // Debug: Log what we're querying for
  console.log("Querying for category:", categoryName);

  // Fetch tools by category with all Market Index Score V1 columns
  // Use .ilike() with wildcards for flexible case-insensitive pattern matching
  // This will match "Video Generation" even if DB has "video generation" or contains it in a list
  const { data, error } = await supabase
    .from("tools")
    .select(
      "*, slug:tool_slug, traffic_monthly_est, x_mentions_30d, youtube_videos_90d, ios_reviews_count, android_installs_range, android_reviews_count"
    )
    .ilike("category", `%${categoryName}%`);

  if (error) {
    console.error("Error fetching tools by category:", error);
    throw error;
  }

  return data || [];
}

export async function getToolBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();

  // Fetch tool from public.tools table using tool_slug column (aliased as slug) and selecting all Market Index Score V1 columns
  const { data, error } = await supabase
    .from("tools")
    .select(
      "*, slug:tool_slug, traffic_monthly_est, x_mentions_30d, youtube_videos_90d, ios_reviews_count, android_installs_range, android_reviews_count"
    )
    .eq("tool_slug", slug)
    .single();

  if (error) {
    console.error("Error fetching tool by slug:", error);
    return null;
  }

  return data;
}

export async function getAllTools() {
  const supabase = await createServerSupabaseClient();

  // Fetch all tools from public.tools table with all Market Index Score V1 columns
  const { data, error } = await supabase
    .from("tools")
    .select(
      "*, slug:tool_slug, traffic_monthly_est, x_mentions_30d, youtube_videos_90d, ios_reviews_count, android_installs_range, android_reviews_count"
    );

  if (error) {
    console.error("Error fetching all tools:", error);
    return [];
  }

  return data || [];
}
