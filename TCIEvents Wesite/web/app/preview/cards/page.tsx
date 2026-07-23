/**
 * TEMPORARY preview page — /preview/cards
 *
 * A scaffold so Joey can verify the reusable cards (Steps 1.4 + 1.5) in a real
 * responsive grid before the homepage is assembled in Step 1.8. It renders the
 * featured events with the FeaturedEventCard and every sample event with the
 * workhorse EventCard, so all states are visible at once (available, almost
 * gone, sold out, free, single-ticket).
 *
 * Delete this route once the homepage + Discover grid are live.
 */

import { EventCard } from "@/components/EventCard";
import { FeaturedEventCard } from "@/components/FeaturedEventCard";
import { CategoryChipRow } from "@/components/CategoryChip";
import { SAMPLE_EVENTS, getFeaturedEvents } from "@/lib/sample-events";

export default function CardsPreviewPage() {
  const featured = getFeaturedEvents();

  return (
    <main className="container-page py-12">
      {/* Step 1.6 — CategoryChip row */}
      <p className="text-sm font-medium uppercase tracking-widest text-ocean-600">
        Step 1.6 · Component preview
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-ocean-900 md:text-5xl">
        CategoryChip row
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-500">
        The “browse by category” row that sits under the homepage hero. On a
        narrow screen it scrolls sideways (drag or swipe); on wider screens it
        wraps and centers. Each chip links to the Discover page pre-filtered to
        that category — those links 404 for now (Discover is Milestone 2).
      </p>

      <div className="mt-8">
        <CategoryChipRow />
      </div>

      <p className="mt-8 text-sm text-ink-500">
        And the same row with one chip shown as the active/selected filter (used
        later on Discover):
      </p>
      <div className="mt-3">
        <CategoryChipRow activeCategory="music" />
      </div>

      {/* Step 1.5 — FeaturedEventCard */}
      <p className="mt-20 text-sm font-medium uppercase tracking-widest text-gold-500">
        Step 1.5 · Component preview
      </p>
      <h2 className="mt-3 flex items-center gap-2 text-4xl font-semibold text-ocean-900 md:text-5xl">
        FeaturedEventCard
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-ink-500">
        The larger, premium card for hand-picked events — taller 4:3 image, gold
        “★ Featured” badge, a description snippet and the organizer. Only the{" "}
        <code className="rounded bg-sand-100 px-1 text-sm">featured: true</code>{" "}
        events appear here. Hover one to see the lift + image zoom.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((event) => (
          <FeaturedEventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Step 1.4 — EventCard (the workhorse, for comparison) */}
      <p className="mt-20 text-sm font-medium uppercase tracking-widest text-ocean-600">
        Step 1.4 · Component preview
      </p>
      <h2 className="mt-3 text-4xl font-semibold text-ocean-900 md:text-5xl">
        EventCard
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-ink-500">
        Every sample event, rendered with the reusable workhorse card. Resize the
        window to check 1 / 2 / 3 columns, and hover a card to see the lift +
        image zoom. (This is a temporary preview page — it goes away once the
        homepage grid is built.)
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SAMPLE_EVENTS.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </main>
  );
}
