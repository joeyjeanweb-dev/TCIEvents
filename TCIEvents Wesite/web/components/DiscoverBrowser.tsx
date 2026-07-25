/**
 * DiscoverBrowser — the interactive part of the Discover page (Steps 2.1–2.4).
 *
 * The page itself (`app/discover/page.tsx`) is a normal server component: it
 * reads the URL, hands us the events and the starting filters, and stops there.
 * Everything that has to *react* to a click lives in here, which is why this
 * file is marked "use client".
 *
 * What it does today:
 *   - shows the compact SearchBar, pre-filled from the URL,
 *   - shows the FilterPanel sidebar (Steps 2.2–2.3) beside the results on
 *     desktop, and behind a "Filters" button on mobile,
 *   - keeps the chosen filters in React state and filters the list live,
 *   - shows the result count, a pill per active filter, and "Clear filters",
 *   - shows the Sort dropdown (Step 2.4) and re-orders the grid,
 *   - renders the responsive EventCard grid,
 *   - shows the designed EmptyState (Step 2.5) when nothing matches, including
 *     one-tap suggestions for loosening a single filter.
 *
 * Sort is deliberately kept *out* of the `filters` object: it doesn't hide any
 * events, so it shouldn't light up "Clear filters" or get wiped when you press
 * it. Filter = which events; sort = what order.
 *
 * Two pieces of state, and the difference matters:
 *   - **`filters`** = what the grid is actually showing. Changing anything in
 *     the sidebar updates this immediately.
 *   - **`draft`** = what's currently typed/picked in the search bar but not yet
 *     submitted. The bar has a **Go** button, so typing "jazz" shouldn't filter
 *     until you press it. Pressing Go copies the draft into `filters`.
 *   The sidebar writes to *both*, which is what keeps the bar's Date/Island
 *   dropdowns showing the same thing as the sidebar's radio buttons.
 *
 * Still to come in this milestone:
 *   - Step 2.6: turn the mobile filter section into a slide-up drawer.
 *
 * On the URL: every applied change also rewrites the address bar (via
 * `router.replace`) so the filtered view can be bookmarked or shared. We use
 * `replace` rather than `push` so the back button doesn't have to walk back
 * through every filter you tried.
 */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarOff, SearchX, SlidersHorizontal } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { EventCard } from "@/components/EventCard";
import { FilterPanel } from "@/components/FilterPanel";
import { SearchBar, type SearchValues } from "@/components/SearchBar";
import { SortSelect } from "@/components/SortSelect";
import {
  countByCategory,
  countFree,
  DEFAULT_FILTERS,
  discoverHref,
  filterEvents,
  hasActiveFilters,
  priceCeiling,
  relaxationSuggestions,
  sortEvents,
  type DiscoverFilters,
  type SortOption,
} from "@/lib/filter-events";
import { CATEGORY_MAP, type SampleEvent } from "@/lib/sample-events";
import { cn } from "@/lib/utils";

export function DiscoverBrowser({
  events,
  initialFilters,
  initialSort,
  nowISO,
}: {
  /** Every sample event, already sorted soonest-first by the page. */
  events: SampleEvent[];
  /** Where we start, read from `/discover?q=…&category=…` on the server. */
  initialFilters: DiscoverFilters;
  /** Starting sort order, read from `?sort=` on the server (Step 2.4). */
  initialSort: SortOption;
  /** "Right now", captured once on the server (see lib/filter-events.ts). */
  nowISO: string;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<DiscoverFilters>(initialFilters);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [draft, setDraft] = useState<SearchValues>({
    q: initialFilters.q,
    date: initialFilters.date,
    island: initialFilters.island,
  });
  /** Mobile only: is the filter section expanded? (Becomes a drawer in 2.6.) */
  const [filtersOpen, setFiltersOpen] = useState(false);

  // useMemo = only re-run the filtering when the inputs actually change,
  // instead of on every single re-render.
  //
  // Filter first, then sort: sorting the 15 that survived is cheaper than
  // sorting all of them and throwing most away — and the two are separate memos
  // so changing the sort doesn't re-run the filtering at all.
  const matched = useMemo(
    () => filterEvents(events, filters, nowISO),
    [events, filters, nowISO],
  );

  const results = useMemo(() => sortEvents(matched, sort), [matched, sort]);

  const counts = useMemo(
    () => countByCategory(events, filters, nowISO),
    [events, filters, nowISO],
  );

  const freeCount = useMemo(
    () => countFree(events, filters, nowISO),
    [events, filters, nowISO],
  );

  // Depends only on the event list, so it's worked out once and never again.
  const priceMax = useMemo(() => priceCeiling(events), [events]);

  // Step 2.5: which single filter, loosened, would bring events back. Only
  // worth working out when the grid is actually empty — the rest of the time
  // this stays an empty array and costs nothing.
  const suggestions = useMemo(
    () =>
      matched.length === 0 ? relaxationSuggestions(events, filters, nowISO) : [],
    [events, filters, matched.length, nowISO],
  );

  /** Apply new filters to the grid *and* mirror them into the address bar. */
  function apply(next: DiscoverFilters) {
    setFilters(next);
    setDraft({ q: next.q, date: next.date, island: next.island });
    router.replace(discoverHref(next, sort), { scroll: false });
  }

  /** Same idea for the Sort dropdown: re-order the grid and update the URL. */
  function applySort(next: SortOption) {
    setSort(next);
    router.replace(discoverHref(filters, next), { scroll: false });
  }

  /** The SearchBar hands back its three fields; the sidebar's stay as they are. */
  function handleSearch(values: SearchValues) {
    apply({ ...filters, ...values });
  }

  const isFiltered = hasActiveFilters(filters);

  return (
    <>
      {/* ---- Search bar ---- */}
      <SearchBar
        size="compact"
        values={draft}
        onValuesChange={setDraft}
        onSubmit={handleSearch}
        className="mx-auto max-w-4xl"
      />

      {/*
        ---- Results bar: count on the left, Sort on the right ----
        Wireframe §3: "42 events        Sort: Date ▾". The active-filter pills
        drop onto their own line underneath so that a handful of them can't push
        the Sort dropdown off the end of the row.
      */}
      <div className="mt-8 border-b border-sand-200 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-500">
            <span className="font-semibold text-ink-900">{results.length}</span>{" "}
            {results.length === 1 ? "event" : "events"}
            {isFiltered && <span> matching your search</span>}
          </p>

          <SortSelect value={sort} onChange={applySort} />
        </div>

        {isFiltered && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Small read-only pills describing what's currently narrowed down. */}
            {filters.categories.map((category) => (
              <FilterTag key={category}>
                {CATEGORY_MAP[category].label}
              </FilterTag>
            ))}
            {filters.island !== "all" && <FilterTag>{filters.island}</FilterTag>}
            {filters.freeOnly && <FilterTag>Free only</FilterTag>}
            {!filters.freeOnly && filters.maxPrice !== null && (
              <FilterTag>Up to ${filters.maxPrice}</FilterTag>
            )}

            <button
              type="button"
              onClick={() => apply(DEFAULT_FILTERS)}
              className="rounded-control px-3 py-1.5 text-sm font-semibold text-ocean-600 transition-colors hover:bg-sand-100 hover:text-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/*
        ---- Sidebar + results ----
        One column on phones/tablets, two from `lg` up: a fixed 16rem filter
        column and a flexible results column (`grid-cols-[16rem_1fr]`).
      */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[16rem_1fr]">
        {/* Mobile: a button that expands the panel. Hidden on desktop, where
            the panel is always visible. Step 2.6 makes this a real drawer. */}
        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
          aria-controls="discover-filters"
          className="flex items-center justify-center gap-2 rounded-control border border-sand-200 bg-white px-4 py-3 text-sm font-semibold text-ink-900 shadow-soft transition-colors hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4 text-ocean-600" aria-hidden />
          {filtersOpen ? "Hide filters" : "Filters"}
        </button>

        {/* Hidden on mobile until you press "Filters", but always visible from
            `lg` up regardless of that toggle — hence the `lg:block`. */}
        <div
          id="discover-filters"
          className={cn(filtersOpen ? "block" : "hidden", "lg:block")}
        >
          {/* `sticky top-24` keeps the panel in view while the grid scrolls
              past it on desktop (24 = clear of the sticky site header). */}
          <FilterPanel
            filters={filters}
            counts={counts}
            freeCount={freeCount}
            priceMax={priceMax}
            onChange={apply}
            onClear={() => apply(DEFAULT_FILTERS)}
            showClear={isFiltered}
            className="lg:sticky lg:top-24"
          />
        </div>

        {/* ---- Results grid, or the "nothing matched" message ---- */}
        <div>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            /*
              ---- Step 2.5: the designed EmptyState ----
              Three shapes, depending on why the grid is empty:
                1. filters are on and something can be loosened → suggestions,
                2. filters are on but nothing helps → "Clear all filters" only,
                3. no filters at all → there are simply no events listed.
              (3) can't happen with today's sample data, but it's the state a real
              database would hit on a quiet week, so it says something honest
              instead of blaming filters that aren't there.
            */
            <EmptyState
              icon={isFiltered ? SearchX : CalendarOff}
              title={
                !isFiltered
                  ? "No events listed yet"
                  : filters.q.trim()
                    ? `No events match “${filters.q.trim()}”`
                    : "No events match your filters"
              }
              description={
                !isFiltered
                  ? "Check back soon — new events are added across Turks & Caicos every week."
                  : suggestions.length > 0
                    ? "You're close. Loosening one thing brings events back:"
                    : "Nothing on the island matches all of those at once. Clearing your filters shows everything that's coming up."
              }
            >
              {/* One button per genuinely useful relaxation, best first. The
                  number beside each label is a real count, not a guess — see
                  relaxationSuggestions() in lib/filter-events.ts. */}
              {suggestions.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.key}
                      type="button"
                      onClick={() => apply(suggestion.filters)}
                      aria-label={`${suggestion.label} — ${suggestion.count} ${
                        suggestion.count === 1 ? "event" : "events"
                      }`}
                      className="flex items-center gap-2 rounded-control border border-sand-200 bg-white px-3.5 py-2 text-sm font-semibold text-ocean-700 shadow-soft transition-colors hover:border-ocean-400 hover:text-ocean-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400"
                    >
                      {suggestion.label}
                      <span
                        aria-hidden
                        className="rounded-full bg-sand-100 px-2 py-0.5 text-xs font-semibold text-ink-500"
                      >
                        {suggestion.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {isFiltered && (
                <button
                  type="button"
                  onClick={() => apply(DEFAULT_FILTERS)}
                  className="rounded-control bg-ocean-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-2"
                >
                  Clear all filters
                </button>
              )}
            </EmptyState>
          )}
        </div>
      </div>
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
