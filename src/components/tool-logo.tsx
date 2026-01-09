"use client";

import Image from "next/image";
import { useState } from "react";

interface ToolLogoProps {
  name?: string;
  tool_name?: string;
  websiteUrl?: string;
  className?: string;
}

/**
 * Extracts the hostname from a URL, removing protocol, www, and trailing slashes
 */
function extractHostname(url: string): string | null {
  if (!url) return null;

  try {
    // Add protocol if missing
    let urlToParse = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      urlToParse = `https://${url}`;
    }

    const urlObj = new URL(urlToParse);
    let hostname = urlObj.hostname;

    // Remove 'www.' prefix if present
    if (hostname.startsWith("www.")) {
      hostname = hostname.substring(4);
    }

    return hostname;
  } catch (error) {
    // Invalid URL, return null
    return null;
  }
}

export default function ToolLogo({
  name,
  tool_name,
  websiteUrl,
  className = "h-10 w-10",
}: ToolLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use tool_name from database or name from seed data, with fallback
  const displayName = name || tool_name || 'Tool';

  // Extract hostname from websiteUrl
  const hostname = websiteUrl ? extractHostname(websiteUrl) : null;

  // If no valid hostname, show initials fallback
  if (!hostname || imageError) {
    const initials = displayName.substring(0, 1).toUpperCase();
    return (
      <div
        className={`${className} rounded-xl border border-slate-700 shadow-sm bg-slate-800 flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}
      >
        {initials}
      </div>
    );
  }

  // Build unavatar.io URL with fallback
  const unavatarUrl = `https://unavatar.io/${hostname}?fallback=https://avatar.vercel.sh/${hostname}`;

  return (
    <div className={`${className} relative rounded-xl border border-slate-700 shadow-sm bg-slate-800 overflow-hidden flex-shrink-0`}>
      <Image
        src={unavatarUrl}
        alt={`${displayName} logo`}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
        unoptimized // unavatar.io handles optimization
      />
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <span className="text-white font-bold text-xs">
            {displayName.substring(0, 1).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}
