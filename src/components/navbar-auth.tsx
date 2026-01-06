"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function NavbarAuth() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // 1. Check user on load
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // 2. SET UP THE LISTENER (This fixes your bug!)
    // This watches for 'SIGNED_IN' or 'SIGNED_OUT' events in real-time
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      // Optional: If they sign out, refresh the page to clear data
      if (event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // The listener above will handle the UI update automatically
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-xs text-slate-400">
          {user.email}
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
    >
      Sign In
    </Link>
  );
}
