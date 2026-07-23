/**
 * TEMPORARY preview page — /preview/cards
 *
 * A scaffold so Joey can verify the reusable EventCard (Step 1.4) in a real
 * responsive grid before the homepage is assembled in Step 1.8. It renders every
 * sample event so all card states are visible at once (available, almost gone,
 * sold out, free, single-ticket).
 *
 * Delete this route once the homepage + Discover grid are live.
 */

import { EventCard } from "@/components/EventCard";
import { SAMPLE_EVENTS } from "@/lib/sample-events";

export default function CardsPreviewPage() {
  return (
    <main className="container-page py-12">
      <p className="text-sm font-medium uppercase tracking-widest text-ocean-600">
        Step 1.4 · Component preview
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-ocean-900 md:text-5xl">
        EventCard
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-500">
        Every sample event, rendered with the reusable card. Resize the window to
        check 1 / 2 / 3 columns, and hover a card to see the lift + image zoom.
        (This is a temporary preview page — it goes away once the homepage grid
        is built.)
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SAMPLE_EVENTS.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </main>
  );
}
