import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getToolsByCategory(slug: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("tools")
    .select("*, votes(count)")
    .contains("categories", [slug]);

  if (error) {
    console.error("Error fetching tools by category:", error);
    throw error;
  }

  return data || [];
}

