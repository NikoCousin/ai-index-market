import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Or Geist if you are using that
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const font = Inter({ subsets: ["latin"] });

// GLOBAL SEO CONFIGURATION
export const metadata: Metadata = {
  title: {
    default: "AI Index Market | The Market Cap of AI",
    template: "%s | AI Index Market", // This adds "| AI Index Market" to every page title automatically
  },
  description:
    "Discover, track, and analyze the top AI tools. Real-time rankings for ChatGPT, Claude, Midjourney, and 500+ other AI software.",
  keywords: [
    "AI tools",
    "AI directory",
    "ChatGPT vs Claude",
    "AI market cap",
    "best ai tools",
  ],
  openGraph: {
    title: "AI Index Market | The Market Cap of AI",
    description:
      "Discover and track the top AI tools. Real-time rankings and reviews.",
    url: "https://ai-index-market.vercel.app", // We will update this when we deploy
    siteName: "AI Index Market",
    images: [
      {
        url: "https://ui-avatars.com/api/?name=AI&background=020617&color=3b82f6&size=1200&bold=true", // Placeholder OG Image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-PZGD52RSZ8"
          strategy="afterInteractive"
        />
        <Script id="google-gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PZGD52RSZ8');
          `}
        </Script>
      </head>
      <body
        className={`${font.className} bg-slate-950 text-slate-200 antialiased`}
      >
        <Navbar />
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
