/**
 * RelatedEvents — the "More from this organizer" row at the foot of every event
 * page (Milestone 3, Step 3.5).
 *
 * `docs/03-Wireframes.md` §4 sketches this as "MORE FROM THIS ORGANIZER" with a
 * strip of small cards. That's exactly what it shows — *when the organizer
 * actually has another event*.
 *
 * ---------------------------------------------------------------------------
 * The honest-fallback problem
 * ---------------------------------------------------------------------------
 * Our 15 sample events are spread across 14 organizers, so only ONE of them
 * ("Ocean Club Events") runs more than a single event. Taken literally, "More
 * from this organizer" would therefore be an empty row on 13 of the 15 pages —
 * a dead patch at the bottom of the page.
 *
 * The two dishonest ways out are: pretend other people's events belong to this
 * organizer, or invent extra sample events to pad the row. `CLAUDE.md`'s
 * data-honesty policy rules both out.
 *
 * So instead `getRelatedEvents()` (in `lib/sample-events.ts`) casts a wider net
 * — same organizer, else same category, else same island, else just what's
 * coming up — and tells us which net caught them. The heading changes to match,
 * so the label over the row is always literally true of the events under it:
 *
 *   organizer → "More from Ocean Club Events"
 *   category  → "More Nightlife events"
 *   island    → "More events on Grand Turk"
 *   upcoming  → "More events in Turks & Caicos"
 *
 * The cards themselves are the same `EventCard` used on the homepage and
 * Discover grid, so a related event looks and behaves identically wherever you
 * meet it.
 *
 * Server component — no "use client". It's static markup, so it ships no
 * JavaScript.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  CATEGORY_MAP,
  getRelatedEvents,
  type RelatedKind,
  type SampleEvent,
} from "@/lib/sample-events";
import { EventCard } from "@/components/EventCard";

/**
 * The wording for one kind of row: the heading, the line under it, and where
 * the "see more" link goes.
 *
 * Every `href` points at a Discover URL the filters already understand
 * (`?q=` searches organizer names too, `?category=`, `?island=`), so the link
 * lands on a real, pre-filtered list rather than a dead end.
 */
function rowCopy(
  kind: RelatedKind,
  event: SampleEvent,
): { heading: string; blurb: string; href: string; linkLabel: string } {
  switch (kind) {
    case "organizer":
      return {
        heading: `More from ${event.organizer}`,
        blurb: "Other events this organizer has coming up.",
        href: `/discover?q=${encodeURIComponent(event.organizer)}`,
        linkLabel: "See all their events",
      };

    case "category": {
      const { label } = CATEGORY_MAP[event.category];
      return {
        heading: `More ${label} events`,
        blurb: "Coming up across the Turks & Caicos Islands.",
        href: `/discover?category=${event.category}`,
        linkLabel: `All ${label} events`,
      };
    }

    case "island":
      return {
        heading: `More events on ${event.island}`,
        blurb: "What else is on while you're on the island.",
        href: `/discover?island=${encodeURIComponent(event.island)}`,
        linkLabel: `All events on ${event.island}`,
      };

    case "upcoming":
      return {
        heading: "More events in Turks & Caicos",
        blurb: "Everything else coming up across the islands.",
        href: "/discover",
        linkLabel: "Browse all events",
      };
  }
}

export function RelatedEvents({ event }: { event: SampleEvent }) {
  const { kind, events } = getRelatedEvents(event);

  // Nothing to suggest (only possible if this were the only event we have) —
  // render nothing at all rather than an empty heading.
  if (events.length === 0) return null;

  const copy = rowCopy(kind, event);

  return (
    <section
      aria-labelledby="related-events-heading"
      className="border-t border-sand-200 bg-sand-100/60 py-12 md:py-16"
    >
      <div className="container-page">
        {/* Heading + "see more" link. `items-end` keeps the link sitting on the
            same baseline as the blurb on wide screens; it wraps underneath on
            narrow ones. */}
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div className="min-w-0">
            <h2
              id="related-events-heading"
              className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl"
            >
              {copy.heading}
            </h2>
            <p className="mt-1.5 text-ink-500">{copy.blurb}</p>
          </div>

          <Link
            href={copy.href}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-control text-sm font-semibold text-ocean-600 transition-colors hover:text-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-2"
          >
            {copy.linkLabel}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>

        {/* A list, because that's what it is — three related things. The `flex`
            on each <li> lets the card stretch to a uniform height per row. */}
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((related) => (
            <li key={related.id} className="flex">
              <EventCard event={related} className="w-full" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
