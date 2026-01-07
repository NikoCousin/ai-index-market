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
              className="block w-full p-4 pl-12 text-sm text-slate-900 border border-slate-200 rounded-full bg-white shadow-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Search in this category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 🟢 2. INJECTED STATS (This renders whatever you pass inside the component) */}
      {children && <div className="mb-10 max-w-5xl mx-auto">{children}</div>}

      {/* 3. THE TABLE SECTION */}
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
                    No tools found for "{query}"
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
