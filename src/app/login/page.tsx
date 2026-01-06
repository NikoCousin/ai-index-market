"use client";

import { useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

// We wrap the content in a separate component to safely use 'useSearchParams'
function LoginForm() {
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Get the 'next' param, or default to Home ('/')
  const nextUrl = searchParams.get("next") || "/";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (view === "sign-in") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        // SUCCESS: Redirect to the dynamic destination
        router.push(nextUrl);
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback?next=${nextUrl}`,
        },
      });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Confirmation email sent! Please check your inbox.",
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden backdrop-blur-sm shadow-2xl">
      {/* TABS */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => {
            setView("sign-in");
            setMessage(null);
          }}
          className={`flex-1 py-4 text-sm font-medium transition-colors cursor-pointer ${
            view === "sign-in"
              ? "bg-slate-800 text-white"
              : "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setView("sign-up");
            setMessage(null);
          }}
          className={`flex-1 py-4 text-sm font-medium transition-colors cursor-pointer ${
            view === "sign-up"
              ? "bg-slate-800 text-white"
              : "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          Sign Up
        </button>
      </div>

      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {view === "sign-in" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-slate-400 text-sm">
            {view === "sign-in"
              ? "Enter your credentials to access your account."
              : "Sign up to start submitting tools."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm border ${
                message.type === "error"
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-green-500/10 border-green-500/20 text-green-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 cursor-pointer shadow-lg shadow-blue-900/20"
          >
            {loading
              ? "Processing..."
              : view === "sign-in"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

// MAIN PAGE COMPONENT
export default function LoginPage() {
  return (
    <main className="container mx-auto px-4 py-20 max-w-md">
      {/* Suspense is required for useSearchParams in Next.js */}
      <Suspense
        fallback={
          <div className="text-center text-slate-500">Loading form...</div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
