import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NextJS Theme ADE",
    template: "%s | NextJS Theme ADE",
  },
  description: "A modern, performant blog theme built with Next.js and TypeScript",
  keywords: ["blog", "nextjs", "typescript", "theme", "dark theme"],
  authors: [{ name: "Theme Developer" }],
  creator: "NextJS Theme ADE",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nextjs-theme-ade.vercel.app",
    title: "NextJS Theme ADE",
    description: "A modern, performant blog theme built with Next.js and TypeScript",
    siteName: "NextJS Theme ADE",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextJS Theme ADE",
    description: "A modern, performant blog theme built with Next.js and TypeScript",
    creator: "@your_twitter_handle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-gray-900 text-gray-100 antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
