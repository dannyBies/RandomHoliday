import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discover your next holiday!",
  description:
    "Random holiday is the easiest way to discover a new random city to visit. You decide how far you want to travel and we'll do the rest!",
  manifest: "./manifest.json",
  openGraph: {
    type: "website",
    title: "Discover your next holiday!",
    description:
      "Random holiday is the easiest way to discover a new random city to visit. You decide how far you want to travel and we'll do the rest!",
    siteName: "Random Holiday",
    images: {
      url: "/og-image.jpg",
    },
  },
  twitter: {
    card: "summary",
    title: "Discover your next holiday!",
    description:
      "Random holiday is the easiest way to discover a new random city to visit. You decide how far you want to travel and we'll do the rest!",
    site: "Random Holiday",
    images: "/og-image.jpg",
  },
  keywords: ["random holiday", "holiday", "trip", "city"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <Analytics />
    </html>
  );
}
