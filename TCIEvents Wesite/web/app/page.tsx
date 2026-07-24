/**
 * Homepage (/) — assembled top-to-bottom to match the approved mockup
 * (docs/design/homepage-target-mockup.png).
 *
 * Built so far:
 *   - Step 1.8a: Hero (full-bleed image + headline + "Browse Events" CTA)
 *   - "Explore by Category" section, reusing the Step 1.6 CategoryChipRow
 *   - Step 1.8b: Featured events row (FeaturedEventCards in a scrolling carousel)
 *   - Step 1.8c: Upcoming events grid + "See all events →" link
 *   - Step 1.8d: Organizer CTA banner ("Hosting an event?" → /host)
 *
 * That completes the homepage section list in docs/02-Spec.md §C.1.
 */

import Link from "next/link";
import { CalendarDays, TreePalm } from "lucide-react";
import { Hero } from "@/components/Hero";
import { CategoryChipRow } from "@/components/CategoryChip";
import { EventCard } from "@/components/EventCard";
import { FeaturedEventCard } from "@/components/FeaturedEventCard";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { OrganizerCTA } from "@/components/OrganizerCTA";
import { getFeaturedEvents, getUpcomingEvents } from "@/lib/sample-events";

/** How many EventCards the homepage grid shows before "See all events →". */
const UPCOMING_COUNT = 6;

export default function Home() {
  const featured = getFeaturedEvents();

  // Soonest-first, skipping anything already shown in the Featured row above so
  // the same card never appears twice on one screen. The full list lives on
  // /discover, which is what the "See all events" link is for.
  const upcoming = getUpcomingEvents()
    .filter((event) => !event.featured)
    .slice(0, UPCOMING_COUNT);

  return (
    <main className="flex-1">
      {/* Step 1.8a — Hero */}
      <Hero
        title={
          <>
            Discover Events.
            <br />
            Experience Paradise.
          </>
        }
        subtitle="From sunset concerts to island festivals, find unforgettable events across the Turks & Caicos Islands."
        ctaLabel="Browse Events"
        ctaHref="/discover"
        imageSrc="/events/hero-beach.jpg"
        imageAlt="Turquoise water and white sand at sunset in the Turks & Caicos Islands"
      />

      {/* Explore by Category (reuses the Step 1.6 CategoryChipRow) */}
      <section className="bg-sand-100 py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-col items-center text-center">
            <TreePalm className="h-7 w-7 text-teal-500" aria-hidden />
            <span className="mt-2 h-0.5 w-10 rounded-full bg-gold-500" />
            <h2 className="mt-4 font-display text-3xl font-semibold text-ocean-900 md:text-4xl">
              Explore by Category
            </h2>
            <p className="mt-2 text-ink-500">
              Find exactly what you&rsquo;re looking for.
            </p>
          </div>

          <div className="mt-10">
            <CategoryChipRow activeCategory="all" />
          </div>
        </div>
      </section>

      {/* Step 1.8b — Featured events (horizontal carousel of FeaturedEventCards) */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-ocean-900 md:text-4xl">
              Featured Events
            </h2>
            <Link
              href="/discover"
              className="shrink-0 text-sm font-semibold text-ocean-600 transition-colors hover:text-ocean-700"
            >
              View all events &rarr;
            </Link>
          </div>

          {/* Scrolls sideways; each card has a fixed width so several peek in.
              Swipe on touch, or use the arrow buttons on desktop. */}
          <FeaturedCarousel className="mt-8">
            {featured.map((event) => (
              <FeaturedEventCard
                key={event.id}
                event={event}
                className="w-[280px] shrink-0 snap-start sm:w-[320px]"
              />
            ))}
          </FeaturedCarousel>
        </div>
      </section>

      {/* Step 1.8c — Upcoming events grid + "See all events →" */}
      <section className="bg-sand-100 py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-col items-center text-center">
            <CalendarDays className="h-7 w-7 text-teal-500" aria-hidden />
            <span className="mt-2 h-0.5 w-10 rounded-full bg-gold-500" />
            <h2 className="mt-4 font-display text-3xl font-semibold text-ocean-900 md:text-4xl">
              Upcoming Events
            </h2>
            <p className="mt-2 text-ink-500">
              What&rsquo;s happening next across the islands.
            </p>
          </div>

          {/* 1 card per row on phones, 2 on tablets, 3 on desktop.
              `items-stretch` keeps every card in a row the same height. */}
          <div className="mt-10 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-control border border-ocean-600 bg-white px-6 py-3 text-sm font-semibold text-ocean-600 shadow-soft transition-colors hover:bg-ocean-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-2"
            >
              See all events &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Step 1.8d — Organizer CTA banner ("Hosting an event?" → /host) */}
      <OrganizerCTA />
    </main>
  );
}
