"use client";

import { useState, useMemo } from "react";
import { Tool } from "@/lib/data";
import SearchBar from "./search-bar";
import ToolsTable from "./tools-table";

interface ToolsContainerProps {
  tools: Tool[];
}

export default function ToolsContainer({ tools }: ToolsContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tools based on search query (name, tagline, and categories)
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return tools;
    }

    const query = searchQuery.toLowerCase();
    return tools.filter((tool) => {
      const nameMatch = tool.name.toLowerCase().includes(query);
      const taglineMatch = tool.tagline.toLowerCase().includes(query);
      const categoriesMatch = tool.categories.some((cat) =>
        cat.toLowerCase().includes(query)
      );
      return nameMatch || taglineMatch || categoriesMatch;
    });
  }, [tools, searchQuery]);

  const handleSearch = (term: string) => {
    setSearchQuery(term);
  };

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar handleSearch={handleSearch} value={searchQuery} />
      </div>

      {/* Results */}
      {filteredTools.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
          <ToolsTable tools={filteredTools} />
        </div>
      ) : (
        <div className="text-center py-20 border border-slate-800 rounded-2xl bg-slate-900/50 text-slate-400">
          <p className="text-lg">No tools found for "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-2 text-blue-400 hover:underline text-sm cursor-pointer"
          >
            Clear search
          </button>
        </div>
      )}
    </>
  );
}

