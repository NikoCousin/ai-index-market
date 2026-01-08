export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown content
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "the-battle-for-tier-1",
    title: "The Battle for Tier 1",
    excerpt:
      "Why reasoning models—not raw scale—are becoming the new gold standard",
    content: "<p>For most of the past two years, the AI race was framed as a scale war: larger models, more parameters, bigger context windows. That framing is breaking down. In 2025, the market's center of gravity has shifted toward reasoning quality—how well a model understands intent, follows multi-step logic, and produces reliable outputs under ambiguity.</p><p>This shift explains why the competition between ChatGPT and Claude now defines the Tier 1 category. Both platforms are no longer evaluated on novelty, but on consistency. Enterprises, researchers, and operators care less about what a model can do once, and more about what it can do correctly every day.</p><h2>Why reasoning beats raw capability</h2><p>Reasoning models outperform because they reduce operational risk. Better instruction-following, clearer chains of thought, and improved handling of edge cases translate directly into lower review costs and faster workflows. In production environments, this matters more than marginal gains in creativity or verbosity.</p><p>ChatGPT's strength lies in breadth and tooling—reasoning embedded inside a wider productivity surface. Claude, by contrast, has carved out trust by excelling at long-form reasoning and controlled outputs. The result is not a winner-takes-all market, but a narrowing Tier 1 where small differences in reliability drive adoption.</p><p>The takeaway is clear: the next phase of AI competition will not be won by size alone. It will be won by models that think more clearly, more often.</p>",
    author: "Cousin",
    date: "Jan 5, 2026",
    category: "Analysis",
    imageUrl:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=800&q=80",
    readTime: "5 min read",
  },
  {
    slug: "hidden-gems",
    title: "Hidden Gems",
    excerpt:
      "Why niche AI tools are quietly outperforming generalists in 2025",
    content: "<p>As general-purpose AI tools race to do everything, a quieter trend is reshaping actual usage: narrowly focused tools are delivering more measurable value. In 2025, performance is increasingly defined by workflow fit, not model size.</p><p>Tools like Cursor and Runway exemplify this shift. They do not compete with generalist assistants on breadth. Instead, they win by embedding AI directly into specific production environments—code editors, video timelines—where context is native and friction is minimal.</p><h2>Why specialization compounds</h2><p>Niche tools benefit from tighter feedback loops. Cursor understands a repository because it lives inside the IDE. Runway accelerates creative iteration because it combines generation and editing in a single surface. These products reduce context switching, which is one of the largest hidden costs in knowledge work.</p><p>Generalist models remain powerful, but they increasingly act as infrastructure. The value capture is moving up the stack to tools that translate intelligence into action with fewer steps. This is why smaller products can outperform larger platforms on user retention and perceived ROI.</p><p>For investors and operators, the signal is clear: the next wave of breakout AI companies will not necessarily build better models. They will build better tools around them.</p>",
    author: "Unknown",
    date: "Jan 2, 2026",
    category: "Trends",
    imageUrl:
      "https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?auto=format&fit=crop&w=800&q=80",
    readTime: "6 min read",
  },
  {
    slug: "understanding-the-ai-index",
    title: "Understanding the AI Index",
    excerpt:
      "How we calculate value in a hype-driven market",
    content: "<p>The AI market is saturated with claims, rankings, and subjective opinions. Our goal with the AI Market Index is to replace narrative with measurement. To do that, we focus on two variables that matter more than hype: capability tier and market validation.</p><h2>Tier points: measuring capability</h2><p>Each tool in the index is assigned Tier Points based on technical depth, reliability, and production readiness. Tier 1 represents tools capable of handling mission-critical workflows. Lower tiers reflect narrower scope or experimental maturity. This component answers a simple question: how strong is the tool, objectively?</p><h2>Voting volume: measuring market pull</h2><p>Capability alone is not enough. Voting Volume captures adoption signals—usage, community engagement, and repeat selection by practitioners. It reflects where real users are placing their trust, not just where attention is loudest.</p><h2>The true score</h2><p>The AI Index score is the product of Tier Points and Voting Volume. This structure rewards tools that are both technically strong and genuinely used. It penalizes hype-only products and surfaces durable value over time.</p><p>In a market moving as fast as AI, clarity is a competitive advantage. The index exists to provide it.</p>",
    author: "Christy S.",
    date: "Dec 28, 2025",
    category: "Insights",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    readTime: "5 min read",
  },
];

export function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
