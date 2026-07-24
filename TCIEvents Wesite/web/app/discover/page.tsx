/**
 * Discover / Browse page (`/discover`) — Milestone 2, Steps 2.1–2.2.
 *
 * This is the page the homepage hero button, the "See all events" link, the
 * category chips and the SearchBar have all been pointing at since Milestone 1.
 *
 * How it's put together:
 *   - **This file is a server component.** It reads the query string, works out
 *     the starting filters, and renders the page furniture (heading, container).
 *     It ships no JavaScript of its own.
 *   - **`DiscoverBrowser` is the client component.** It owns the interactive
 *     bits — the search bar, the FilterPanel sidebar, the live filtering, the
 *     result count and the grid.
 *
 * Next.js 16 note: `searchParams` is a **Promise** here (it used to be a plain
 * object in older versions), so it has to be `await`ed — hence `async function`.
 *
 * Still to come in this milestone: the panel's price + "free only" controls
 * (2.3), the Sort dropdown (2.4), the designed EmptyState (2.5) and the mobile
 * filter drawer (2.6).
 */

import type { Metadata } from "next";
import { DiscoverBrowser } from "@/components/DiscoverBrowser";
import { PageHero } from "@/components/PageHero";
import { discoverHref, parseDiscoverFilters } from "@/lib/filter-events";
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

  // Soonest-first. The browser component filters this list; it never re-sorts,
  // so the grid stays in date order until the Sort dropdown lands in Step 2.4.
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
            The negative top margin lifts the white search card up onto the
            banner's lower edge, so it looks like it's floating over the photo.
            `relative z-10` keeps it above the banner rather than behind it.

            The `key` ties this component to the current URL. If you arrive from
            a category chip, or click "Discover" in the nav to start over, the
            component remounts and picks up the new starting filters instead of
            hanging on to the previous ones.
          */}
          <div className="relative z-10 -mt-14 md:-mt-16">
            <DiscoverBrowser
              key={discoverHref(filters)}
              events={events}
              initialFilters={filters}
              nowISO={nowISO}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
