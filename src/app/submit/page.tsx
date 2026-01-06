"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function SubmitPage() {
  const [status, setStatus] = useState<
    "loading" | "idle" | "submitting" | "success" | "error"
  >("loading");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // 1. Initial Check (Run once on mount)
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        // Not logged in? Go to login, then come back here
        router.replace("/login?next=/submit");
      } else {
        setUser(user);
        setStatus("idle");
      }
    }
    checkUser();

    // 2. SECURITY LISTENER (This fixes your bug!)
    // If the user clicks "Sign Out" in the navbar, this triggers immediately.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        // Kick them out instantly
        router.replace("/login?next=/submit");
      } else if (session?.user) {
        // Update user if session refreshes
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  // 3. Handle the Submission
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);

    // Safety check: ensure we have a user before submitting
    if (!user?.email) {
      setStatus("error");
      return;
    }

    const data = {
      name: formData.get("name"),
      url: formData.get("url"),
      category: formData.get("category"),
      tagline: formData.get("tagline"),
      description: formData.get("description"),
      user_email: user.email,
    };

    const { error } = await supabase.from("submissions").insert(data);

    if (error) {
      console.error("Error submitting:", error);
      setStatus("error");
    } else {
      setStatus("success");
    }
  }

  // Loading State
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        <div className="animate-pulse">Checking access...</div>
      </div>
    );
  }

  // Success State
  if (status === "success") {
    return (
      <main className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <div className="rounded-2xl border border-green-900/50 bg-green-900/20 p-12">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Submission Received!
          </h1>
          <p className="text-lg text-slate-300 mb-8">
            Thanks <strong>{user?.email}</strong>! We have saved your tool to
            our database. We review every submission manually within 48 hours.
          </p>
          <button
            onClick={() => router.push("/")}
            className="rounded-full bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-500 transition-colors cursor-pointer"
          >
            Back to Homepage
          </button>
        </div>
      </main>
    );
  }

  // The Form
  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Submit a Tool</h1>
        <p className="text-slate-400">
          Logged in as <span className="text-blue-400">{user?.email}</span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-sm shadow-xl"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tool Name
          </label>
          <input
            required
            name="name"
            type="text"
            placeholder="e.g. SuperAI"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Website URL
          </label>
          <input
            required
            name="url"
            type="url"
            placeholder="https://..."
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Category
          </label>
          <select
            name="category"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
          >
            <option>LLMs & Chatbots</option>
            <option>Image Generation</option>
            <option>Video Generation</option>
            <option>Coding Assistant</option>
            <option>Productivity</option>
            <option>Other</option>
          </select>
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Short Tagline
          </label>
          <input
            required
            name="tagline"
            type="text"
            placeholder="e.g. The best AI for generating cat videos"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Tell us what makes this tool special..."
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        <button
          disabled={status === "submitting"}
          type="submit"
          className="w-full rounded-xl bg-blue-600 px-4 py-4 text-center font-bold text-white hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-blue-900/20"
        >
          {status === "submitting" ? "Saving..." : "Submit for Review"}
        </button>

        {status === "error" && (
          <p className="text-red-400 text-center">
            Something went wrong. Try again.
          </p>
        )}
      </form>
    </main>
  );
}
