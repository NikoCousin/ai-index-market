import Link from "next/link";
import { loadSeed } from "@/lib/data";

export const revalidate = 3600;

export default function UseCasesIndexPage() {
  const data = loadSeed();

  const getToolCount = (useCaseSlug: string) => {
    return data.tools.filter((t) => t.useCases.includes(useCaseSlug)).length;
  };

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        {/* FIXED: Text is White */}
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
          Browse by Use Case
        </h1>
        {/* FIXED: Text is Light Grey */}
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Don't know the tool name? Find the best AI software for your specific
          job to be done.
        </p>
      </div>

      {/* Use Cases Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.useCases.map((useCase) => {
          const count = getToolCount(useCase.slug);

          return (
            <Link
              key={useCase.slug}
              href={`/use-cases/${useCase.slug}`}
              // FIXED: Card background is Dark (bg-slate-900) and Border is Dark (border-slate-800)
              className="group relative block rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-sm hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                {/* FIXED: Title is White */}
                <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {useCase.name}
                </h2>
                {/* FIXED: Badge is Dark Grey */}
                <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400 group-hover:bg-blue-900/30 group-hover:text-blue-300">
                  {count} tools
                </span>
              </div>

              {/* FIXED: Description is Light Grey */}
              <p className="text-slate-400 text-sm leading-relaxed">
                Compare top-rated AI tools optimized for{" "}
                {useCase.name.toLowerCase()} workflows.
              </p>

              <div className="mt-4 flex items-center text-sm font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Tools →
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
