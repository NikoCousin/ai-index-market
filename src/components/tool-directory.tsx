"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { Tool } from "@/lib/data";

// ✅ Added 'children' prop here to accept the Stats
export default function ToolDirectory({
  tools,
  children,
}: {
  tools: Tool[];
  children?: ReactNode;
}) {
  const [query, setQuery] = useState("");

  const filteredTools = tools.filter((tool) => {
    const searchContent = (
      tool.name +
      tool.tagline +
      tool.pricingModel
    ).toLowerCase();
    return searchContent.includes(query.toLowerCase());
  });

  return (
    <div className="w-full">
      {/* 1. HERO SEARCH SECTION */}
      <div className="mb-8 text-center relative max-w-xl mx-auto">
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
              className="block w-full p-4 pl-12 text-base sm:text-sm text-slate-900 border border-slate-200 rounded-full bg-white shadow-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Search in this category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Badges Section */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          {/* Tracked Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-xl shadow-black/20">
            <div className="relative flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping opacity-40"></div>
            </div>
            <span className="text-sm font-medium text-white whitespace-nowrap">
              12 Tools Tracked
            </span>
          </div>

          {/* Trending Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-xl shadow-black/20">
            <span className="text-base flex-shrink-0">🔥</span>
            <span className="text-sm font-medium text-white whitespace-nowrap">
              Top Trend:{" "}
              <span className="text-orange-400 font-semibold">ChatGPT</span>
            </span>
          </div>
        </div>
      </div>

      {/* 🟢 2. INJECTED STATS (This renders whatever you pass inside the component) */}
      {children && <div className="mb-10 max-w-5xl mx-auto">{children}</div>}

      {/* 3. THE TABLE SECTION - Desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
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
                <th className="px-4 py-4 font-medium text-slate-500">
                  AI Index
                </th>
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
                    No tools found for "{query}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool, index) => (
            <MobileToolCard key={tool.slug} tool={tool} index={index} />
          ))
        ) : (
          <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200 p-8">
            No tools found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}

// ⬇️ LOGO COMPONENT
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
        <div className="text-xs text-slate-500 mt-0.5 max-w-full sm:max-w-[200px] truncate">
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
      <td className="px-4 py-4">
        <span className="font-mono font-bold text-slate-900">
          {tool.indexScore || tool.score?.rankScore?.toFixed(1) || "-"}
        </span>
      </td>
      <td className="px-4 py-4">
        {tool.trendPercentage ? (
          <div className="flex items-center gap-1 text-emerald-500 font-medium">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span>{tool.trendPercentage}</span>
          </div>
        ) : (
          <span className="text-slate-400">+1.2%</span>
        )}
      </td>
    </tr>
  );
}

// ⬇️ MOBILE CARD COMPONENT
function MobileToolCard({ tool, index }: { tool: Tool; index: number }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 shadow-sm bg-slate-50">
          {!imageError ? (
            <img
              src={`/logos/${tool.slug}.png`}
              alt={tool.name}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-slate-800 text-white font-bold text-sm">
              {tool.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900 text-base mb-1">
                #{index + 1} {tool.name}
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">
                {tool.tagline}
              </p>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium ring-1 ring-inset min-h-[32px] ${
                tool.pricingModel === "PAID"
                  ? "bg-purple-50 text-purple-700 ring-purple-700/10"
                  : tool.pricingModel === "FREE"
                  ? "bg-green-50 text-green-700 ring-green-600/20"
                  : "bg-blue-50 text-blue-700 ring-blue-700/10"
              }`}
            >
              {tool.pricingModel}
            </span>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="font-mono font-bold text-slate-900">
                AI Index:{" "}
                {tool.indexScore || tool.score?.rankScore?.toFixed(1) || "-"}
              </span>
              {tool.trendPercentage ? (
                <div className="flex items-center gap-1 text-emerald-500 font-medium">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <span>Trend: {tool.trendPercentage}</span>
                </div>
              ) : (
                <span className="text-slate-400 font-medium">Trend: +1.2%</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
