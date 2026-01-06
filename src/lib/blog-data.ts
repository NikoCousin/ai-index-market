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
    slug: "chatgpt-vs-claude-3-5",
    title: "ChatGPT-4o vs Claude 3.5 Sonnet: Which is Better for Coding?",
    excerpt:
      "We tested both models on 50 complex Python and React tasks. The winner might surprise you.",
    content: "<p>Full article coming soon...</p>",
    author: "Niko S.",
    date: "Jan 5, 2026",
    category: "Comparison",
    imageUrl:
      "https://ui-avatars.com/api/?name=Vs&background=0f172a&color=fff&size=400&font-size=0.5",
    readTime: "5 min read",
  },
  {
    slug: "future-of-ai-agents",
    title: "Why 2026 is the Year of Autonomous AI Agents",
    excerpt:
      "From AutoGPT to Devin, we explore how agents are moving from 'Chat' to 'Action'.",
    content: "<p>Full article coming soon...</p>",
    author: "Gemini",
    date: "Jan 2, 2026",
    category: "Trends",
    imageUrl:
      "https://ui-avatars.com/api/?name=Ag&background=0f172a&color=fff&size=400&font-size=0.5",
    readTime: "8 min read",
  },
  {
    slug: "best-ai-image-generators",
    title: "Midjourney vs DALL-E 3: The Ultimate Image Battle",
    excerpt:
      "A deep dive into prompt adherence, photorealism, and text rendering capabilities.",
    content: "<p>Full article coming soon...</p>",
    author: "Niko S.",
    date: "Dec 28, 2025",
    category: "Design",
    imageUrl:
      "https://ui-avatars.com/api/?name=Mj&background=0f172a&color=fff&size=400&font-size=0.5",
    readTime: "6 min read",
  },
];

export function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
