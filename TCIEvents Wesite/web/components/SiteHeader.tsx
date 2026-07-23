"use client";

/**
 * SiteHeader — the sticky top navigation, shown on every page.
 *
 * Behaviour (per docs/02-Spec.md + wireframes):
 *  - Sticky at the top of every page.
 *  - "Frosted" translucent-white bar at the top of the page; turns solid white
 *    with a soft shadow once you scroll down (so it reads over the hero image and
 *    over white content alike).
 *  - Desktop: logo · Browse · Categories ▾ (dropdown of the 9 categories) ·
 *    "List Your Event" gold button.
 *  - Mobile (< md): logo + hamburger that opens a full-height slide-in drawer.
 *
 * Note: /discover and /host don't exist yet (later milestones), so those links
 * 404 for now — that's expected and intentional; we wire the real pages later.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/sample-events";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Toggle the "solid on scroll" state.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock background scrolling while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 backdrop-blur-md transition-colors duration-300",
        scrolled
          ? "bg-white/95 shadow-soft"
          : "bg-white/70 border-b border-white/40",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        {/* Logo → home */}
        <Link href="/" aria-label="TCIEvents home" className="flex items-center">
          <Image
            src="/brand/tci-events-logo-trimmed.png"
            alt="TCIEvents — Turks & Caicos Islands"
            width={1032}
            height={681}
            priority
            className="h-9 w-auto md:h-12"
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          <Link
            href="/discover"
            className="rounded-control px-4 py-2 text-sm font-medium text-ink-900 transition hover:bg-sand-100"
          >
            Browse
          </Link>

          {/* Categories dropdown (CSS hover + keyboard focus-within, no JS state) */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 rounded-control px-4 py-2 text-sm font-medium text-ink-900 transition hover:bg-sand-100 group-focus-within:bg-sand-100"
              aria-haspopup="menu"
            >
              Categories
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="grid w-64 gap-0.5 rounded-card border border-sand-200 bg-white p-2 shadow-lift">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.key}
                    href={`/discover?category=${c.key}`}
                    className="flex items-center gap-2.5 rounded-control px-3 py-2 text-sm text-ink-900 transition hover:bg-sand-100"
                  >
                    <span aria-hidden className="text-base">
                      {c.emoji}
                    </span>
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/host"
            className="ml-2 rounded-control bg-gradient-to-r from-gold-500 to-[#d9b64a] px-5 py-2.5 text-sm font-semibold text-ink-900 shadow-soft transition hover:brightness-105"
          >
            List Your Event
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="rounded-control p-2 text-ocean-900 transition hover:bg-sand-100 md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer + backdrop */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ocean-900/40 backdrop-blur-sm"
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-white shadow-lift">
            <div className="flex h-16 items-center justify-between border-b border-sand-200 px-5">
              <Image
                src="/brand/tci-events-logo-trimmed.png"
                alt="TCIEvents"
                width={1032}
                height={681}
                className="h-8 w-auto"
              />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-control p-2 text-ocean-900 transition hover:bg-sand-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav
              className="flex-1 overflow-y-auto px-4 py-4"
              aria-label="Mobile"
            >
              <Link
                href="/discover"
                className="block rounded-control px-3 py-3 text-base font-medium text-ink-900 transition hover:bg-sand-100"
              >
                Browse
              </Link>

              <p className="mt-4 px-3 pb-1 text-xs font-semibold uppercase tracking-widest text-ink-500">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-1">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.key}
                    href={`/discover?category=${c.key}`}
                    className="flex items-center gap-2 rounded-control px-3 py-2.5 text-sm text-ink-900 transition hover:bg-sand-100"
                  >
                    <span aria-hidden>{c.emoji}</span>
                    {c.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="border-t border-sand-200 p-4">
              <Link
                href="/host"
                className="block rounded-control bg-gradient-to-r from-gold-500 to-[#d9b64a] px-5 py-3 text-center text-sm font-semibold text-ink-900 shadow-soft transition hover:brightness-105"
              >
                List Your Event
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
