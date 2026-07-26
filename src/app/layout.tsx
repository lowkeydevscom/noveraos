import type { Metadata, Viewport } from "next";
import { Inter, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NoveraOS - AI Operating System for Thought Dump & Workspace Synthesis",
  description:
    "Frictionless cognitive operating system to capture unstructured thoughts, generate 1536-dimensional embeddings, and perform RAG grounded AI workspace synthesis.",
  keywords: ["NoveraOS", "Thought Dump", "AI Workspace", "pgvector", "RAG", "Embeddings"],
  authors: [{ name: "NoveraOS Team" }],
  openGraph: {
    title: "NoveraOS - AI Operating System",
    description: "Frictionless cognitive operating system for thought dump and workspace synthesis.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#181715",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)] antialiased font-sans">
        <AuthProvider>
          <div id="app-root">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
