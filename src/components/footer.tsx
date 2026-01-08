import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold group-hover:bg-blue-500 transition-colors">
                AI
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                IndexMarket
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              The world's most trusted index for AI tools, APIs, and plugins.
              Track market movements in real-time.
            </p>
          </div>

          {/* Link Columns */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-400 transition-colors"
                >
                  All Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-blue-400 transition-colors"
                >
                  Categories
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/use-cases"
                  className="hover:text-blue-400 transition-colors"
                >
                  Use Cases
                </Link>
              </li> */}
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-400 transition-colors"
                >
                  Submit Tool
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-400 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-400 transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-400 transition-colors"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-400 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 IndexMarket Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {/* Social Placeholders */}
            <a
              href="#"
              className="text-slate-500 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
