"use client";

import Link from "next/link";
import { Tool } from "@/lib/data";
import { useState } from "react";

export default function ToolsTable({ tools }: { tools: Tool[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="pl-4 pr-2 py-3 font-medium text-slate-500 w-10">
              #
            </th>
            <th className="pl-0 pr-4 py-3 font-medium text-slate-500 w-12"></th>
            <th className="px-4 py-3 font-medium text-slate-500">Tool</th>
            <th className="px-4 py-3 font-medium text-slate-500">Pricing</th>
            <th className="px-4 py-3 font-medium text-slate-500">Rank</th>
            <th className="px-4 py-3 font-medium text-slate-500">Trend</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tools.map((tool, index) => (
            <ToolRow key={tool.slug} tool={tool} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ⬇️ THIS IS THE COMPONENT WITH THE FALLBACK LOGIC ⬇️
function ToolRow({ tool, index }: { tool: Tool; index: number }) {
  const [imageError, setImageError] = useState(false);

  return (
    <tr className="hover:bg-slate-50/80 transition-colors">
      <td className="pl-4 pr-2 py-4 text-slate-500 w-10">#{index + 1}</td>

      {/* LOGO COLUMN */}
      <td className="pl-0 pr-4 py-4 w-12">
        <div className="h-10 w-10 overflow-hidden rounded-lg border border-slate-100 shadow-sm bg-slate-50">
          {!imageError ? (
            // 1. TRY TO SHOW THE IMAGE
            <img
              src={`/logos/${tool.slug}.png`}
              alt={`${tool.name} logo`}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)} // <--- If fails, trigger fallback
            />
          ) : (
            // 2. FALLBACK: SHOW COLORED INITIALS
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

      <td className="px-4 py-4 text-slate-700 font-medium">
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
