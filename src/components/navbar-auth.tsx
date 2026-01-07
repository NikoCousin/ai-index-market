"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { signOutAction } from "@/app/actions";

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

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-xs text-slate-400">
          {user.email}
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] px-2 flex items-center justify-center"
          >
            Sign Out
          </button>
        </form>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] px-2 flex items-center justify-center"
    >
      Sign In
    </Link>
  );
}
