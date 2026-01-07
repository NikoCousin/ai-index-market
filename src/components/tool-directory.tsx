"use client";

import { useState } from "react";
import Link from "next/link";
import { Tool } from "@/lib/data";

export default function ToolDirectory({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");

  // 🔎 THE FILTER LOGIC
  const filteredTools = tools.filter((tool) => {
    const searchContent = (
      tool.name +
      tool.tagline +
      tool.pricingModel
    ).toLowerCase();
    return searchContent.includes(query.toLowerCase());
  });

  // Get top trending tool for the badge
  const topTrend = tools[0]?.name || "ChatGPT";

  return (
    <div className="w-full">
      {/* 1. HERO SEARCH SECTION (The dark area) */}
      <div className="mb-12 text-center relative max-w-xl mx-auto">
        {" "}
        {/* Changed max-w-2xl to max-w-xl for narrower look */}
        {/* The Search Bar - Floating in the Hero */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full p-4 pl-12 text-sm text-slate-900 border border-slate-200 rounded-full bg-white shadow-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Search AI tools (e.g. 'video', 'free')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        {/* 🔥 STATS BADGES (Restored!) */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {/* Badge 1: Tools Count */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-300 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {tools.length} Tools Tracked
          </div>

          {/* Badge 2: Trending Tool */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-300 shadow-sm">
            <span>🔥</span>
            Top Trend: <span className="text-white font-bold">{topTrend}</span>
          </div>
        </div>
      </div>

      {/* 2. THE TABLE SECTION (Separate White Box) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="pl-6 pr-2 py-4 font-medium text-slate-500 w-10">
                  #
                </th>
                <th className="px-4 py-4 font-medium text-slate-500 w-16">
                  Logo
                </th>
                <th className="px-4 py-4 font-medium text-slate-500">
                  Tool Name
                </th>
                <th className="px-4 py-4 font-medium text-slate-500">
                  Pricing
                </th>
                <th className="px-4 py-4 font-medium text-slate-500">Rank</th>
                <th className="px-4 py-4 font-medium text-slate-500">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool, index) => (
                  <ToolRow key={tool.slug} tool={tool} index={index} />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-lg font-medium text-slate-600">
                        No tools found for "{query}"
                      </p>
                      <button
                        onClick={() => setQuery("")}
                        className="mt-2 text-blue-500 hover:text-blue-700 font-medium"
                      >
                        Clear Search
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ⬇️ LOGO COMPONENT (Manual Fallback)
function ToolRow({ tool, index }: { tool: Tool; index: number }) {
  const [imageError, setImageError] = useState(false);

  return (
    <tr className="hover:bg-slate-50/80 transition-colors">
      <td className="pl-6 pr-2 py-4 text-slate-500">#{index + 1}</td>
      <td className="px-4 py-4">
        <div className="h-10 w-10 overflow-hidden rounded-xl border border-slate-100 shadow-sm bg-slate-50">
          {!imageError ? (
            <img
              src={`/logos/${tool.slug}.png`}
              alt={tool.name}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-slate-800 text-white font-bold text-xs">
              {tool.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="font-semibold text-slate-900">
          <Link
            href={`/tools/${tool.slug}`}
            className="hover:text-blue-600 hover:underline"
          >
            {tool.name}
          </Link>
        </div>
        <div className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">
          {tool.tagline}
        </div>
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
            tool.pricingModel === "PAID"
              ? "bg-purple-50 text-purple-700 ring-purple-700/10"
              : tool.pricingModel === "FREE"
              ? "bg-green-50 text-green-700 ring-green-600/20"
              : "bg-blue-50 text-blue-700 ring-blue-700/10"
          }`}
        >
          {tool.pricingModel}
        </span>
      </td>
      <td className="px-4 py-4 font-mono text-slate-700">
        {tool.score?.rankScore}
      </td>
      <td className="px-4 py-4 text-green-600 font-medium">
        +{tool.score?.trendScore}%
      </td>
    </tr>
  );
}
