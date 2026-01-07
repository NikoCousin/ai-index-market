"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface VoteButtonProps {
  slug: string;
  layout?: "vertical" | "horizontal"; // You can choose the style!
}

export default function VoteButton({
  slug,
  layout = "horizontal",
}: VoteButtonProps) {
  const [count, setCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const router = useRouter();

  // 1. Fetch Data
  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { count: voteCount } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("tool_slug", slug);

      setCount(voteCount || 0);

      if (user) {
        const { data } = await supabase
          .from("votes")
          .select("*")
          .eq("tool_slug", slug)
          .eq("user_id", user.id)
          .single();
        if (data) setHasVoted(true);
      }
      setLoading(false);
    }
    fetchData();
  }, [slug, supabase]);

  // 2. Handle Click
  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Auth Check
    if (!user) {
      router.push(`/login?next=/tools/${slug}`);
      return;
    }

    // Animation / Logic
    const newHasVoted = !hasVoted;
    setHasVoted(newHasVoted);
    setCount((prev) => (newHasVoted ? prev + 1 : prev - 1));

    if (newHasVoted) {
      await supabase
        .from("votes")
        .insert({ tool_slug: slug, user_id: user.id });
    } else {
      await supabase
        .from("votes")
        .delete()
        .eq("tool_slug", slug)
        .eq("user_id", user.id);
    }
  };

  // Loading Skeleton
  if (loading) {
    return layout === "vertical" ? (
      <div className="h-16 w-12 bg-slate-800 rounded-xl animate-pulse" />
    ) : (
      <div className="h-10 w-24 bg-slate-800 rounded-lg animate-pulse" />
    );
  }

  // === DESIGN 1: THE "PRODUCT HUNT" VERTICAL BOX ===
  if (layout === "vertical") {
    return (
      <button
        onClick={handleVote}
        className={`group flex flex-col items-center justify-center w-14 h-16 rounded-xl border transition-all duration-200 ease-out active:scale-95 cursor-pointer ${
          hasVoted
            ? "bg-gradient-to-b from-blue-500 to-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30"
            : "bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-white"
        }`}
      >
        <span
          className={`text-2xl -mt-1 mb-0.5 ${
            hasVoted ? "text-white" : "group-hover:text-blue-400"
          }`}
        >
          ▲
        </span>
        <span className="text-xs font-bold font-mono">{count}</span>
      </button>
    );
  }

  // === DESIGN 2: THE "CRYPTO PILL" HORIZONTAL (Default) ===
  return (
    <button
      onClick={handleVote}
      className={`group flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 active:scale-95 cursor-pointer ${
        hasVoted
          ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
          : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-500 hover:text-white"
      }`}
    >
      <span
        className={`text-base transition-transform ${
          hasVoted ? "" : "group-hover:-translate-y-0.5"
        }`}
      >
        ▲
      </span>
      <span className="font-bold text-sm">
        {hasVoted ? "Upvoted" : "Upvote"}
      </span>
      <div
        className={`h-4 w-[1px] ${
          hasVoted ? "bg-blue-500/50" : "bg-slate-700"
        }`}
      />
      <span className="font-mono text-sm">{count}</span>
    </button>
  );
}
