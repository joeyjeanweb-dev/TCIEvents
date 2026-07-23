/**
 * Homepage (/) — assembled top-to-bottom to match the approved mockup
 * (docs/design/homepage-target-mockup.png).
 *
 * Built so far:
 *   - Step 1.8a: Hero (full-bleed image + headline + "Browse Events" CTA)
 *   - "Explore by Category" section, reusing the Step 1.6 CategoryChipRow
 *   - Step 1.8b: Featured events row (FeaturedEventCards in a scrolling carousel)
 *
 * Still to come in later steps: Upcoming grid + "See all events" link, and the
 * organizer CTA banner.
 */

import Link from "next/link";
import { TreePalm } from "lucide-react";
import { Hero } from "@/components/Hero";
import { CategoryChipRow } from "@/components/CategoryChip";
import { FeaturedEventCard } from "@/components/FeaturedEventCard";
import { getFeaturedEvents } from "@/lib/sample-events";

export default function Home() {
  const featured = getFeaturedEvents();

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

          {/* Scrolls sideways; each card has a fixed width so several peek in */}
          <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
            {featured.map((event) => (
              <FeaturedEventCard
                key={event.id}
                event={event}
                className="w-[280px] shrink-0 snap-start sm:w-[320px]"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
