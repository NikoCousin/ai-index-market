import { createServerSupabaseClient } from "@/lib/supabase/server";
import NewsCard, { NewsItem } from "./news-card";

export default async function NewsSection() {
  const supabase = await createServerSupabaseClient();

  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(6); // Show latest 6 news items

  if (error) {
    console.error("Error fetching news:", error);
    return null;
  }

  if (!news || news.length === 0) {
    return null;
  }

  return (
    <section className="mt-20">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Latest AI News</h2>
        <p className="text-slate-400">
          Stay updated with the latest developments in AI
        </p>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <NewsCard key={item.id} news={item as NewsItem} />
        ))}
      </div>
    </section>
  );
}

