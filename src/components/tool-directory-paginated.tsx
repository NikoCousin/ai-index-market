"use client";

import { useState, useEffect } from "react";
import { Tool } from "@/lib/data";
import ToolDirectory from "./tool-directory";

interface ToolDirectoryPaginatedProps {
  tools: Tool[];
}

const TOOLS_PER_PAGE = 20;

export default function ToolDirectoryPaginated({
  tools,
}: ToolDirectoryPaginatedProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(tools.length / TOOLS_PER_PAGE);
  const startIndex = (currentPage - 1) * TOOLS_PER_PAGE;
  const endIndex = startIndex + TOOLS_PER_PAGE;
  const paginatedTools = tools.slice(startIndex, endIndex);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Reset to page 1 if current page is beyond available pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="w-full">
      <ToolDirectory tools={paginatedTools} startIndex={startIndex} />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all min-w-[100px] ${
              currentPage === 1
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                : "bg-slate-800/80 text-white hover:bg-slate-700 border border-slate-700 hover:border-blue-500 shadow-lg shadow-black/20"
            }`}
          >
            Previous
          </button>

          <div className="px-6 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all min-w-[100px] ${
              currentPage === totalPages
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                : "bg-slate-800/80 text-white hover:bg-slate-700 border border-slate-700 hover:border-blue-500 shadow-lg shadow-black/20"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

