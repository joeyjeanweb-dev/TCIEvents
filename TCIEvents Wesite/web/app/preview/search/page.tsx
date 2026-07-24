/**
 * TEMPORARY preview page — /preview/search
 *
 * A scaffold so Joey can verify the SearchBar (Step 1.7) before the Discover
 * page it belongs to is built in Milestone 2. It shows the compact variant (the
 * one Discover will use), the large variant, a pre-filled example, and a demo
 * that catches the submitted values instead of navigating.
 *
 * Delete this route once the Discover page is live.
 */

import { SearchBar } from "@/components/SearchBar";
import { SearchBarDemo } from "./SearchBarDemo";

export default function SearchPreviewPage() {
  return (
    <main className="container-page py-12">
      <p className="text-sm font-medium uppercase tracking-widest text-ocean-600">
        Step 1.7 · Component preview
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-ocean-900 md:text-5xl">
        SearchBar
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-500">
        Search + Date + Island + Go. On desktop it&apos;s one white bar with
        divided segments; below 768px it stacks — search on top, the two
        dropdowns side by side, then a full-width Go button. Pressing{" "}
        <strong>Go</strong> sends you to{" "}
        <code className="rounded bg-sand-100 px-1 text-sm">/discover</code> with
        your choices in the URL. That page is Milestone 2, so it 404s for now —
        expected. Check the URL bar to confirm the right values were passed.
      </p>

      {/* Compact — the Discover page top bar */}
      <h2 className="mt-12 text-2xl font-semibold text-ocean-900">
        Compact <span className="text-ink-500">(Discover page top bar)</span>
      </h2>
      <div className="mt-4">
        <SearchBar />
      </div>

      {/* Large */}
      <h2 className="mt-12 text-2xl font-semibold text-ocean-900">
        Large <span className="text-ink-500">(bigger variant, kept for later)</span>
      </h2>
      <div className="mt-4">
        <SearchBar size="large" />
      </div>

      {/* Pre-filled — how it will look when you land on Discover from a link */}
      <h2 className="mt-12 text-2xl font-semibold text-ocean-900">
        Pre-filled{" "}
        <span className="text-ink-500">(arriving with filters already set)</span>
      </h2>
      <p className="mt-2 max-w-2xl text-ink-500">
        Discover will read the URL and hand those values in, so the bar always
        shows what you&apos;re actually filtering by.
      </p>
      <div className="mt-4">
        <SearchBar
          defaultValues={{
            q: "beach party",
            date: "weekend",
            island: "Grand Turk",
          }}
        />
      </div>

      {/* On a sand band, to check contrast off a white page */}
      <h2 className="mt-12 text-2xl font-semibold text-ocean-900">
        On a sand background{" "}
        <span className="text-ink-500">(contrast check)</span>
      </h2>
      <div className="mt-4 rounded-card bg-sand-100 p-6">
        <SearchBar />
      </div>

      {/* Live values — proves the values are wired up without needing Discover */}
      <SearchBarDemo />
    </main>
  );
}
