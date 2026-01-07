"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface SearchBarProps {
  handleSearch?: (term: string) => void;
  value?: string;
}

export default function SearchBar(props: SearchBarProps = {}) {
  const { handleSearch, value } = props;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // If props are provided, use controlled component mode
  // Otherwise, use URL params mode
  const urlHandleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    // Kept the fix: { scroll: false } prevents jumping
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  const onSearch = handleSearch || urlHandleSearch;
  const inputValue = value !== undefined ? value : searchParams.get("q")?.toString() || "";

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-slate-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search tools (e.g. 'video', 'coding')..."
        className="block w-full rounded-full border border-slate-700 bg-slate-800 py-3 pl-10 pr-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm shadow-sm transition-colors"
        onChange={(e) => {
          onSearch(e.target.value);
        }}
        value={inputValue}
      />
    </div>
  );
}
