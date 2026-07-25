/**
 * Discover / Browse page (`/discover`) — Milestone 2, Steps 2.1–2.6.
 *
 * This is the page the homepage hero button, the "See all events" link, the
 * category chips and the SearchBar have all been pointing at since Milestone 1.
 *
 * How it's put together:
 *   - **This file is a server component.** It reads the query string, works out
 *     the starting filters, and renders the page furniture (heading, container).
 *     It ships no JavaScript of its own.
 *   - **`DiscoverBrowser` is the client component.** It owns the interactive
 *     bits — the search bar, the FilterPanel (sidebar on desktop, slide-up
 *     drawer on mobile), the live filtering and sorting, the result count, the
 *     grid and the empty state.
 *
 * Next.js 16 note: `searchParams` is a **Promise** here (it used to be a plain
 * object in older versions), so it has to be `await`ed — hence `async function`.
 */

import type { Metadata } from "next";
import { DiscoverBrowser } from "@/components/DiscoverBrowser";
import { PageHero } from "@/components/PageHero";
import {
  discoverHref,
  parseDiscoverFilters,
  parseSortOption,
} from "@/lib/filter-events";
import { getUpcomingEvents } from "@/lib/sample-events";

export const metadata: Metadata = {
  title: "Discover Events",
  description:
    "Browse every upcoming event across Turks & Caicos — concerts, boat parties, festivals, beach dining and more. Filter by date, island and category.",
};

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseDiscoverFilters(params);
  // `?sort=price` / `?sort=popularity`; anything else means date order.
  const sort = parseSortOption(params);

  // Soonest-first. That's both the default order and the starting point the
  // browser component re-sorts from when you change the Sort dropdown.
  const events = getUpcomingEvents();

  // Read the clock ONCE, here on the server, and pass it down. Both the server
  // render and the browser then agree on what "today" means, which keeps the
  // date presets ("This weekend") from producing two different results.
  const nowISO = new Date().toISOString();

  return (
    <main className="flex-1">
      {/* ---- Photo banner ---- */}
      <PageHero
        title="Discover Events"
        subtitle="Every upcoming event across the Turks & Caicos Islands — search by name, date or island."
        imageSrc="/events/discover-hero.jpg"
        imageAlt="Crowd at a beachfront sunset concert beneath palm trees in the Turks & Caicos Islands"
        overlap
      />

      {/* ---- Search + results ---- */}
      <section className="pb-14 md:pb-16">
        <div className="container-page">
          {/*
            The `key` ties this component to the current URL. If you arrive from
            a category chip, or click "Discover" in the nav to start over, the
            component remounts and picks up the new starting filters instead of
            hanging on to the previous ones.

            Step 2.6 note: the "float the search card onto the banner" wrapper
            (`relative z-10 -mt-14`) used to live here, around everything. A
            `z-index` on a wrapper traps its contents in their own layer, which
            would have pinned the new mobile filter drawer *underneath* the
            sticky site header. It now sits inside DiscoverBrowser, around the
            search bar alone — which is the only thing that ever needed it.
          */}
          <DiscoverBrowser
            key={discoverHref(filters, sort)}
            events={events}
            initialFilters={filters}
            initialSort={sort}
            nowISO={nowISO}
          />
        </div>
      </section>
    </main>
  );
}
