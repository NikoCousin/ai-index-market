"use client";

import { useState } from "react";
import { Tool } from "@/lib/data";

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
  const [showInitials, setShowInitials] = useState(false);

  // Use local logo file path
  const logoPath = `/logos/${tool.slug}.png`;

  const handleImageError = () => {
    setShowInitials(true);
  };

  const containerClass =
    size === "lg"
      ? "rounded-2xl border border-slate-700 shadow-sm bg-slate-800"
      : "rounded-xl border border-slate-100 shadow-sm bg-slate-50";

  if (!showInitials) {
    return (
      <div className={`${className} ${containerClass} overflow-hidden flex-shrink-0`}>
        <img
          src={logoPath}
          alt={`${tool.name} logo`}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      </div>
    );
  }

  // Initials fallback - colored circle with first letter
  const initialsBgClass = "bg-slate-800";
  const initialsTextClass = size === "lg" ? "text-lg" : size === "md" ? "text-sm" : "text-xs";
  const initials = tool.name.substring(0, 1).toUpperCase();

  return (
    <div className={`${className} ${containerClass} flex items-center justify-center ${initialsBgClass} text-white font-bold ${initialsTextClass} flex-shrink-0`}>
      {initials}
    </div>
  );
}

