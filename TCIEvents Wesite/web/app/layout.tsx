import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

// Display / headings — refined serif for the luxury-resort tone
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Body / UI — clean, highly legible
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tcievents.com"),
  title: {
    default: "TCIEvents — Discover the best events in Turks & Caicos",
    template: "%s · TCIEvents",
  },
  description:
    "Concerts, boat parties, beach dining and more. Discover and book the best events across Turks & Caicos.",
  openGraph: {
    type: "website",
    siteName: "TCIEvents",
    title: "TCIEvents — Discover the best events in Turks & Caicos",
    description:
      "Concerts, boat parties, beach dining and more across Turks & Caicos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-ink-900">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
