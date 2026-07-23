/**
 * EventCard — the workhorse card used in every event grid across the site
 * (homepage "Upcoming", the Discover grid, "More from this organizer").
 *
 * What it shows (per docs/02-Spec.md Part B + the wireframes):
 *  - 16:9 cover image with a gentle zoom on hover
 *  - a frosted category chip (emoji + label) over the top-left of the image
 *  - a status pill (top-right) ONLY when tickets are running low or gone
 *  - date · time, title, venue · island, and a "from $XX" / "Free" price
 *
 * The whole card is a single link to the event's details page
 * (`/events/[slug]`). That page is built in Milestone 3, so for now the link
 * 404s — that's expected and intentional, not a bug.
 *
 * This is a plain (server) component: all the hover motion is pure CSS, so it
 * needs no "use client" and ships zero JavaScript.
 */

import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import {
  type SampleEvent,
  CATEGORY_MAP,
  priceLabel,
  formatEventDate,
  formatEventTime,
} from "@/lib/sample-events";
import { cn } from "@/lib/utils";

/** Small coloured pill shown over the image when tickets are low or sold out. */
function StatusPill({ status }: { status: SampleEvent["status"] }) {
  if (status === "available") return null;

  const isSoldOut = status === "sold_out";
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-semibold shadow-soft backdrop-blur-sm",
        isSoldOut
          ? "bg-danger/90 text-white"
          : "bg-warn/95 text-ink-900",
      )}
    >
      {isSoldOut ? "Sold out" : "Almost gone"}
    </span>
  );
}

export function EventCard({
  event,
  className,
}: {
  event: SampleEvent;
  className?: string;
}) {
  const category = CATEGORY_MAP[event.category];
  const isSoldOut = event.status === "sold_out";

  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-card border border-sand-200 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:-translate-y-1 focus-visible:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-2",
        className,
      )}
    >
      {/* Cover image (16:9) */}
      <div className="relative aspect-[16/9] overflow-hidden bg-sand-100">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-105",
            isSoldOut && "opacity-75 grayscale-[35%]",
          )}
        />

        {/* Category chip (top-left) */}
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-xs font-medium text-ink-900 shadow-soft backdrop-blur-sm">
          <span aria-hidden>{category.emoji}</span>
          {category.label}
        </span>

        {/* Status pill (top-right) */}
        <span className="absolute right-3 top-3">
          <StatusPill status={event.status} />
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Date · time */}
        <p className="flex items-center gap-1.5 text-sm font-medium text-ocean-600">
          <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
          <span>
            {formatEventDate(event.startAt)}
            <span className="text-ink-500"> · {formatEventTime(event.startAt)}</span>
          </span>
        </p>

        {/* Title (clamped to 2 lines so cards stay aligned) */}
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-900 line-clamp-2 transition-colors group-hover:text-ocean-700">
          {event.title}
        </h3>

        {/* Venue · island */}
        <p className="flex items-center gap-1.5 text-sm text-ink-500">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
          <span className="truncate">
            {event.venueName} · {event.island}
          </span>
        </p>

        {/* Footer: price + view affordance (pushed to the bottom) */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-semibold text-ink-900">
            {priceLabel(event)}
          </span>
          <span className="text-sm font-medium text-ocean-600 transition-colors group-hover:text-ocean-700">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
