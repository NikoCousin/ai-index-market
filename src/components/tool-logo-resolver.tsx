"use client";

import { useState } from "react";
import { Tool } from "@/lib/data";
import { resolveToolLogo, getClearbitFallback } from "@/lib/logo";

interface ToolLogoResolverProps {
  tool: Tool;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ToolLogoResolver({
  tool,
  className = "h-10 w-10",
  size = "sm",
}: ToolLogoResolverProps) {
  const [logoState, setLogoState] = useState<"primary" | "clearbit" | "initials">("primary");

  const primaryLogo = resolveToolLogo(tool);
  const clearbitUrl = getClearbitFallback(tool.links?.websiteUrl);

  const handleImageError = () => {
    if (logoState === "primary" && clearbitUrl) {
      setLogoState("clearbit");
    } else {
      setLogoState("initials");
    }
  };

  const getCurrentSrc = () => {
    if (logoState === "primary" && primaryLogo) return primaryLogo;
    if (logoState === "clearbit" && clearbitUrl) return clearbitUrl;
    return null;
  };

  const currentSrc = getCurrentSrc();

  const containerClass =
    size === "lg"
      ? "rounded-2xl border border-slate-700 shadow-sm bg-slate-800"
      : "rounded-xl border border-slate-100 shadow-sm bg-slate-50";

  if (currentSrc) {
    return (
      <div className={`${className} ${containerClass} overflow-hidden flex-shrink-0`}>
        <img
          src={currentSrc}
          alt={`${tool.name} logo`}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      </div>
    );
  }

  // Initials fallback
  const initialsBgClass = "bg-slate-800";
  const initialsTextClass = size === "lg" ? "text-lg" : "text-xs";

  return (
    <div className={`${className} ${containerClass} flex items-center justify-center ${initialsBgClass} text-white font-bold ${initialsTextClass} flex-shrink-0`}>
      {tool.name.substring(0, 2).toUpperCase()}
    </div>
  );
}

