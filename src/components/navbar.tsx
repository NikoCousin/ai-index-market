import Link from "next/link";
import NavbarAuth from "./navbar-auth"; // <--- Import the new component

export default function Navbar() {
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

        {/* Navigation Links */}
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

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* NEW: Replaces the old static button */}
          <NavbarAuth />

          <Link
            href="/submit"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/25 cursor-pointer"
          >
            Submit Tool
          </Link>
        </div>
      </div>
    </header>
  );
}
