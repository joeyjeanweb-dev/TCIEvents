/**
 * DiscoverBrowser — the interactive part of the Discover page (Step 2.1).
 *
 * The page itself (`app/discover/page.tsx`) is a normal server component: it
 * reads the URL, hands us the events and the starting filters, and stops there.
 * Everything that has to *react* to a click lives in here, which is why this
 * file is marked "use client".
 *
 * What it does today:
 *   - shows the compact SearchBar, pre-filled from the URL,
 *   - keeps the chosen filters in React state and filters the list live,
 *   - shows the result count and a "Clear filters" button,
 *   - renders the responsive EventCard grid,
 *   - shows a friendly message when nothing matches.
 *
 * Still to come in this milestone:
 *   - Step 2.2/2.3: the FilterPanel sidebar (category checkboxes, price range,
 *     "free only") — this component will grow the extra state,
 *   - Step 2.4: the Sort dropdown (date / price / popularity),
 *   - Step 2.5: a proper designed EmptyState component,
 *   - Step 2.6: the mobile filter drawer.
 *
 * On the URL: pressing **Go** also rewrites the address bar (via
 * `router.replace`) so the filtered view can be bookmarked or shared. We use
 * `replace` rather than `push` so the back button doesn't have to walk back
 * through every search you tried.
 */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { SearchBar, type SearchValues } from "@/components/SearchBar";
import {
  DEFAULT_FILTERS,
  discoverHref,
  filterEvents,
  hasActiveFilters,
  type DiscoverFilters,
} from "@/lib/filter-events";
import { CATEGORY_MAP, type SampleEvent } from "@/lib/sample-events";

export function DiscoverBrowser({
  events,
  initialFilters,
  nowISO,
}: {
  /** Every sample event, already sorted soonest-first by the page. */
  events: SampleEvent[];
  /** Where we start, read from `/discover?q=…&category=…` on the server. */
  initialFilters: DiscoverFilters;
  /** "Right now", captured once on the server (see lib/filter-events.ts). */
  nowISO: string;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<DiscoverFilters>(initialFilters);

  // useMemo = only re-run the filtering when the inputs actually change,
  // instead of on every single re-render.
  const results = useMemo(
    () => filterEvents(events, filters, nowISO),
    [events, filters, nowISO],
  );

  /** Apply new filters to the grid *and* mirror them into the address bar. */
  function apply(next: DiscoverFilters) {
    setFilters(next);
    router.replace(discoverHref(next), { scroll: false });
  }

  /** The SearchBar hands back its three fields; category is kept as-is. */
  function handleSearch(values: SearchValues) {
    apply({ ...filters, ...values });
  }

  const isFiltered = hasActiveFilters(filters);

  return (
    <>
      {/* ---- Search bar ---- */}
      <SearchBar
        size="compact"
        defaultValues={filters}
        onSubmit={handleSearch}
        className="mx-auto max-w-4xl"
      />

      {/* ---- Count + active filters + clear ---- */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-sand-200 pb-4">
        <p className="text-sm text-ink-500">
          <span className="font-semibold text-ink-900">{results.length}</span>{" "}
          {results.length === 1 ? "event" : "events"}
          {isFiltered && <span> matching your search</span>}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {/* Small read-only pills describing what's currently narrowed down. */}
          {filters.category !== "all" && (
            <FilterTag>{CATEGORY_MAP[filters.category].label}</FilterTag>
          )}
          {filters.island !== "all" && <FilterTag>{filters.island}</FilterTag>}

          {isFiltered && (
            <button
              type="button"
              onClick={() => apply(DEFAULT_FILTERS)}
              className="rounded-control px-3 py-1.5 text-sm font-semibold text-ocean-600 transition-colors hover:bg-sand-100 hover:text-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ---- Results grid, or the "nothing matched" message ---- */}
      {results.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        /* Placeholder wording for now — Step 2.5 turns this into the proper
           designed EmptyState component from the spec. */
        <div className="mt-8 flex flex-col items-center rounded-card border border-sand-200 bg-sand-100 px-6 py-16 text-center">
          <SearchX className="h-8 w-8 text-ocean-600" aria-hidden />
          <h2 className="mt-4 font-display text-2xl font-semibold text-ocean-900">
            No events match your search
          </h2>
          <p className="mt-2 max-w-md text-ink-500">
            Try a different date, another island, or clear your filters to see
            everything happening across Turks &amp; Caicos.
          </p>
          <button
            type="button"
            onClick={() => apply(DEFAULT_FILTERS)}
            className="mt-6 rounded-control bg-ocean-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-2"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}

/** A small sand-coloured pill showing one active filter. */
function FilterTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-sand-200 bg-sand-100 px-3 py-1 text-xs font-medium text-ink-900">
      {children}
    </span>
  );
}
