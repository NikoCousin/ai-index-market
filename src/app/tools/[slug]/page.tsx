import Link from "next/link";
import { notFound } from "next/navigation";
import { loadSeed, getRelatedTools } from "@/lib/data";
import VoteButton from "@/components/vote-button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = loadSeed();
  const tool = data.tools.find((t) => t.slug === slug);

  if (!tool) return { title: "Tool Not Found" };

  return {
    title: `${tool.name} Review, Pros & Cons | AI Index`,
    description: tool.descriptionShort,
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const data = loadSeed();
  const tool = data.tools.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  // Fetch related tools
  const relatedTools = getRelatedTools(tool.slug, tool.categories[0]);

  const getLogoUrl = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&color=fff&size=200&bold=true`;

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl text-slate-200">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-400">
        <Link href="/tools" className="hover:text-blue-400 transition-colors">
          Tools
        </Link>
        <span>/</span>
        <span className="font-medium text-white">{tool.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* === LEFT MAIN COLUMN === */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Section */}
          <div className="flex items-start gap-6">
            {/* === CHANGED: LEFT COLUMN (Logo + Vote Button) === */}
            <div className="flex flex-col items-center gap-3">
              {/* Existing Logo Code */}
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-700 shadow-sm bg-slate-800">
                <img
                  src={getLogoUrl(tool.name)}
                  alt={`${tool.name} logo`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            {/* ============================================== */}

            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl mb-2">
                {tool.name}
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed">
                {tool.tagline}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {/* The New Vote Button (Vertical Mode) */}
                <VoteButton slug={tool.slug} />
                <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-400 border border-slate-700">
                  {tool.pricingModel}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-400 border border-slate-700">
                  Verified{" "}
                  {new Date(
                    tool.lastVerifiedAt || Date.now()
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              About {tool.name}
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              {tool.descriptionLong}
            </p>

            <div className="flex flex-wrap gap-2">
              {tool.categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/categories/${cat}`}
                  className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
                >
                  #{cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Pros & Cons Section */}
          {(tool.pros || tool.cons) && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pros */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                  <span>👍</span> The Good
                </h3>
                <ul className="space-y-3">
                  {tool.pros?.map((pro, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {pro}
                    </li>
                  )) || (
                    <span className="text-slate-500 italic">
                      No pros listed.
                    </span>
                  )}
                </ul>
              </div>

              {/* Cons */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                  <span>👎</span> The Bad
                </h3>
                <ul className="space-y-3">
                  {tool.cons?.map((con, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <svg
                        className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      {con}
                    </li>
                  )) || (
                    <span className="text-slate-500 italic">
                      No cons listed.
                    </span>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* === RIGHT SIDEBAR === */}
        <div className="space-y-6">
          {/* CTA Button */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4">
              <span className="text-sm text-slate-500">Website</span>
              <div className="font-medium text-slate-200 break-words truncate">
                {tool.links?.websiteUrl || "N/A"}
              </div>
            </div>
            <a
              href={tool.links?.websiteUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Visit Website ↗
            </a>
          </div>

          {/* Tech Specs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Tech Specs
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                <span className="text-slate-500 text-sm">Developer</span>
                <span className="text-slate-200 text-sm font-medium">
                  {tool.specs?.developer || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                <span className="text-slate-500 text-sm">Launched</span>
                <span className="text-slate-200 text-sm font-medium">
                  {tool.specs?.launchYear || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                <span className="text-slate-500 text-sm">API Available</span>
                <span
                  className={`text-sm font-medium ${
                    tool.specs?.hasApi ? "text-green-400" : "text-slate-500"
                  }`}
                >
                  {tool.specs?.hasApi ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                <span className="text-slate-500 text-sm">Mobile App</span>
                <span
                  className={`text-sm font-medium ${
                    tool.specs?.mobileApp ? "text-green-400" : "text-slate-500"
                  }`}
                >
                  {tool.specs?.mobileApp ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Market Data */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Market Data
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-500 mb-1">Rank</div>
                <div className="text-xl font-mono font-bold text-white">
                  #{tool.score?.rankScore}
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-500 mb-1">Trend</div>
                <div className="text-xl font-mono font-bold text-green-400">
                  +{tool.score?.trendScore}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="mt-16 pt-16 border-t border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-6">
            Alternatives to consider
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group block rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-800 overflow-hidden">
                    <img
                      src={getLogoUrl(t.name)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-blue-400">
                      {t.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t.pricingModel}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">
                  {t.tagline}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
