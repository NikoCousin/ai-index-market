"use client";

import Image from "next/image";
import { useState } from "react";

export default function ToolLogo({
  name,
  websiteUrl,
  className = "h-10 w-10",
}: {
  name: string;
  websiteUrl?: string;
  className?: string;
}) {
  const [error, setError] = useState(false);

  // 1. SAFETY: If no URL, show Initials immediately
  if (!websiteUrl) {
    return <InitialsFallback name={name} className={className} />;
  }

  // 2. CLEANER: Fix "midjourney.com" -> "https://midjourney.com" to prevent crashes
  const getDomain = (url: string) => {
    try {
      const safeUrl = url.startsWith("http") ? url : `https://${url}`;
      return new URL(safeUrl).hostname;
    } catch (e) {
      return ""; // If URL is total garbage, return empty
    }
  };

  const domain = getDomain(websiteUrl);

  // 3. GOOGLE MAGIC: Get the icon
  const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  if (error || !domain) {
    return <InitialsFallback name={name} className={className} />;
  }

  // 4. DISPLAY
  return (
    <div
      className={`${className} relative flex-shrink-0 overflow-hidden rounded-xl bg-white/5`}
    >
      {/* We use a standard img tag here for simplicity and speed with external URLs */}
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className="h-full w-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}

// The "Plan B" Component (Your nice colored letters)
function InitialsFallback({
  name,
  className,
}: {
  name: string;
  className: string;
}) {
  return (
    <div
      className={`${className} flex flex-shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-100 font-bold border border-blue-500/30`}
    >
      {name.substring(0, 2).toUpperCase()}
    </div>
  );
}
