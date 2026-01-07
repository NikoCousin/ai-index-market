"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import NavbarAuth from "./navbar-auth";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20 group-hover:bg-blue-500 transition-colors">
            AI
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
            IndexMarket
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link
            href="/"
            className="hover:text-white transition-colors cursor-pointer"
          >
            All Tools
          </Link>
          <Link
            href="/categories"
            className="hover:text-white transition-colors cursor-pointer"
          >
            Categories
          </Link>
          <Link
            href="/use-cases"
            className="hover:text-white transition-colors cursor-pointer"
          >
            Use Cases
          </Link>
          <Link
            href="/blog"
            className="hover:text-white transition-colors cursor-pointer"
          >
            Blog
          </Link>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <NavbarAuth />
          <Link
            href="/submit"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/25 cursor-pointer min-h-[44px] flex items-center"
          >
            Submit Tool
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <NavbarAuth />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-md"
        >
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              All Tools
            </Link>
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Categories
            </Link>
            <Link
              href="/use-cases"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Use Cases
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Blog
            </Link>
            <Link
              href="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg text-center transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              Submit Tool
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
