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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${nextUrl}`,
      },
    });
    if (error) {
      setMessage({ type: "error", text: error.message });
      setLoading(false);
    }
    // Note: On success, user will be redirected, so we don't need to handle that here
  };

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

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full rounded-lg bg-white border border-slate-300 shadow-sm hover:shadow-md px-4 py-3 font-medium text-slate-900 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4 flex items-center justify-center gap-3 cursor-pointer"
        >
          {/* Google G Icon SVG */}
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900/50 px-2 text-slate-500">OR</span>
          </div>
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
            className="w-full rounded-xl bg-blue-600 px-4 py-4 font-bold text-white hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 cursor-pointer shadow-lg shadow-blue-900/20 min-h-[48px] flex items-center justify-center"
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
