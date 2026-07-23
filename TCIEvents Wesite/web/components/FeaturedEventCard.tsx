/**
 * FeaturedEventCard — the "hero" version of EventCard, used only in the
 * homepage **★ Featured** row (docs/02-Spec.md Part B + C.1 §3).
 *
 * It's the same idea as EventCard but deliberately larger and more premium so a
 * handful of hand-picked events stand out:
 *  - a taller 4:3 cover image (vs. the workhorse card's 16:9)
 *  - a gold "★ Featured" badge (top-left) — our one sparing use of the gold
 *    accent, per the "Tropical Luxury" palette
 *  - a short two-line description snippet + the organizer name, which the
 *    compact EventCard doesn't show
 *  - a soft gold ring so it reads as "special" even before you notice the badge
 *
 * Like EventCard, the whole thing is a single link to `/events/[slug]` (built
 * in Milestone 3, so the link 404s for now — expected, not a bug), and it's a
 * plain server component: all motion is CSS, zero JavaScript shipped.
 */

import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Star, BadgeCheck } from "lucide-react";
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
        isSoldOut ? "bg-danger/90 text-white" : "bg-warn/95 text-ink-900",
      )}
    >
      {isSoldOut ? "Sold out" : "Almost gone"}
    </span>
  );
}

export function FeaturedEventCard({
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
        "group flex flex-col overflow-hidden rounded-card border border-gold-500/40 bg-white shadow-soft ring-1 ring-gold-500/10 transition duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:-translate-y-1 focus-visible:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-2",
        className,
      )}
    >
      {/* Cover image (4:3 — taller than the workhorse card) */}
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-100">
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

        {/* Gold "★ Featured" badge (top-left) — our sparing gold accent */}
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-ink-900 shadow-soft">
          <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
          Featured
        </span>

        {/* Status pill (top-right) — only when low/sold out */}
        <span className="absolute right-3 top-3">
          <StatusPill status={event.status} />
        </span>

        {/* Category chip (bottom-left, frosted) */}
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-xs font-medium text-ink-900 shadow-soft backdrop-blur-sm">
          <span aria-hidden>{category.emoji}</span>
          {category.label}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {/* Date · time */}
        <p className="flex items-center gap-1.5 text-sm font-medium text-ocean-600">
          <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
          <span>
            {formatEventDate(event.startAt)}
            <span className="text-ink-500"> · {formatEventTime(event.startAt)}</span>
          </span>
        </p>

        {/* Title (larger than EventCard; clamped to 2 lines) */}
        <h3 className="font-display text-xl font-semibold leading-snug text-ink-900 line-clamp-2 transition-colors group-hover:text-ocean-700">
          {event.title}
        </h3>

        {/* Short description snippet — the extra richness featured cards get */}
        <p className="text-sm leading-relaxed text-ink-500 line-clamp-2">
          {event.description}
        </p>

        {/* Venue · island */}
        <p className="flex items-center gap-1.5 text-sm text-ink-500">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
          <span className="truncate">
            {event.venueName} · {event.island}
          </span>
        </p>

        {/* Organizer (with a verified check when applicable) */}
        <p className="flex items-center gap-1.5 text-sm text-ink-500">
          <span className="truncate">by {event.organizer}</span>
          {event.organizerVerified && (
            <BadgeCheck
              className="h-4 w-4 shrink-0 text-ocean-600"
              aria-label="Verified organizer"
            />
          )}
        </p>

        {/* Footer: price + view affordance (pinned to the bottom) */}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-semibold text-ink-900">
            {priceLabel(event)}
          </span>
          <span className="text-sm font-semibold text-ocean-600 transition-colors group-hover:text-ocean-700">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
