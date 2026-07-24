/**
 * TEMPORARY — part of the /preview/search scaffold (Step 1.7).
 *
 * Shows the `onSubmit` mode: instead of navigating to Discover, the bar hands
 * its values back to this parent, which prints them. That's exactly how the
 * Discover page will use it in Milestone 2 to filter the grid live.
 *
 * Delete alongside the rest of /preview/search.
 */

"use client";

import { useState } from "react";
import { SearchBar, type SearchValues } from "@/components/SearchBar";

export function SearchBarDemo() {
  const [submitted, setSubmitted] = useState<SearchValues | null>(null);

  return (
    <>
      <h2 className="mt-12 text-2xl font-semibold text-ocean-900">
        Values check{" "}
        <span className="text-ink-500">(doesn&apos;t navigate)</span>
      </h2>
      <p className="mt-2 max-w-2xl text-ink-500">
        This copy catches what you searched for instead of going to Discover.
        Type something, pick a date and island, press Go, and confirm the values
        below match.
      </p>
      <div className="mt-4">
        <SearchBar onSubmit={setSubmitted} />
      </div>
      <pre className="mt-4 overflow-x-auto rounded-card bg-sand-100 p-4 text-sm text-ink-900">
        {submitted
          ? JSON.stringify(submitted, null, 2)
          : "Nothing submitted yet — press Go above."}
      </pre>
    </>
  );
}
