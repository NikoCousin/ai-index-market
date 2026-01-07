"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type NewsItem = {
  id: number;
  title: string;
  summary: string;
  image_url: string;
  source_url: string;
  source_domain: string;
  published_at: string;
  tags?: string[];
};

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const published = new Date(dateString);
  const diffInSeconds = Math.floor(
    (now.getTime() - published.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
}

export default function NewsCard({ news }: { news: NewsItem }) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(news.image_url);

  // Fallback image - a gradient placeholder
  const fallbackImage = `data:image/svg+xml,${encodeURIComponent(
    `<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="600" fill="url(#grad)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" fill="#64748b" text-anchor="middle" dominant-baseline="middle">${news.source_domain}</text>
    </svg>`
  )}`;

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(fallbackImage);
    }
  };

  return (
    <Link
      href={news.source_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden hover:border-blue-500 hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Top Half: Image */}
      <div className="relative w-full h-48 overflow-hidden bg-slate-800">
        {!imageError ? (
          <Image
            src={imageSrc}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={handleImageError}
            unoptimized={imageSrc.startsWith("data:")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="text-center px-4">
              <div className="text-2xl font-bold text-slate-400 mb-1">
                {news.source_domain.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Half: Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors leading-tight">
          {news.title}
        </h3>

        {/* Summary */}
        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">
          {news.summary}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-800">
          <span className="font-medium text-slate-400">
            {news.source_domain}
          </span>
          <span>•</span>
          <span>{getTimeAgo(news.published_at)}</span>
        </div>
      </div>
    </Link>
  );
}
