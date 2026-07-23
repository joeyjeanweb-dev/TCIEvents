"use client";

/**
 * SiteFooter — the deep-ocean footer shown on every page.
 *
 * Layout (per docs/03-Wireframes.md §6 + docs/02-Spec.md):
 *  - Brand blurb on the left.
 *  - Four link columns: Explore · Company · Support · Follow.
 *  - A "get event updates" newsletter box (VISUAL ONLY — Phase 1 stores nothing;
 *    on submit it just shows an honest confirmation, per the data-honesty policy).
 *  - Legal bar: © line + a short "demo site" honesty note.
 *
 * Honesty notes (Phase 1):
 *  - Internal links to /discover, /host, /about, /help, /terms, /privacy point at
 *    pages we build in later milestones, so some 404 for now — same accepted
 *    pattern as SiteHeader. No dead `#` links.
 *  - Social icons are placeholders (no real accounts yet) — rendered as buttons
 *    labelled "coming soon", not links to invented profiles.
 */

import { useState } from "react";
import Link from "next/link";
import { Send, Check } from "lucide-react";

// ---- Link columns ---------------------------------------------------------
const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Browse events", href: "/discover" },
      { label: "Categories", href: "/discover" },
      { label: "Host an event", href: "/host" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/help" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help", href: "/help" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

// ---- Social brand glyphs (lucide dropped brand icons, so these are inline) --
type Social = { name: string; icon: React.ReactNode };
const SOCIALS: Social[] = [
  {
    name: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M13.5 21v-8h2.6l.4-3h-3V8.1c0-.9.3-1.5 1.5-1.5H17V3.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.8v8h2.7Z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.9.9-.9 2.2-.1 3.5a10 10 0 0 0 4.2 3.7c1.5.7 2.1.7 2.9.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3Z" />
      </svg>
    ),
  },
];

export function SiteFooter() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <footer className="mt-auto bg-ocean-900 text-white/80">
      <div className="container-page py-14 md:py-16">
        {/* Top: brand blurb + link columns */}
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-xs">
            <p className="font-display text-2xl font-semibold text-white">
              TCIEvents
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Discover and book the best events across Turks &amp; Caicos —
              concerts, boat parties, beach dining and more.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/75 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Middle: newsletter + social */}
        <div className="mt-12 flex flex-col gap-8 border-t border-white/10 pt-10 md:flex-row md:items-start md:justify-between">
          {/* Newsletter (visual only) */}
          <div className="max-w-sm">
            <h3 className="font-display text-lg font-semibold text-white">
              Get event updates
            </h3>
            <p className="mt-1.5 text-sm text-white/60">
              The best of Turks &amp; Caicos in your inbox.
            </p>

            {submitted ? (
              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-turquoise">
                <Check className="h-4 w-4" />
                You&apos;re on the list! (Demo only — nothing is stored yet.)
              </p>
            ) : (
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                  // Phase 1: no backend. Prevent navigation, show honest confirm.
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="min-w-0 flex-1 rounded-control border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/40"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex items-center justify-center rounded-control bg-gradient-to-r from-gold-500 to-[#d9b64a] px-4 py-2.5 text-ink-900 shadow-soft transition hover:brightness-105"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          {/* Social (placeholders — no live accounts yet) */}
          <div className="md:text-right">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Follow
            </h3>
            <div className="mt-4 flex gap-3 md:justify-end">
              {SOCIALS.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  title={`${s.name} — coming soon`}
                  aria-label={`${s.name} — coming soon`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: legal bar */}
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© 2026 TCIEvents. All rights reserved.</p>
          <p>Demo site — sample events, no real ticket sales yet.</p>
        </div>
      </div>
    </footer>
  );
}
