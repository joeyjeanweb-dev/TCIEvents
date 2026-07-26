/**
 * Event Details page (`/events/[slug]`) — Milestone 3, Step 3.1.
 *
 * This is the page every EventCard on the site has been linking to since
 * Milestone 1 (until now those links 404'd). One file, one event: the slug in
 * the URL — e.g. `/events/full-moon-beach-party` — is looked up in
 * `lib/sample-events.ts`.
 *
 * Step 3.1 built the **layout skeleton**: breadcrumb, cover image, title,
 * meta (date / venue / organizer), the About text and the "When & where" block.
 * Step 3.2 filled the right-hand column with `components/TicketsCard.tsx` — the
 * ticket list with −/+ steppers — and 3.3 gave that card its live subtotal /
 * 5% fee / total (`lib/pricing.ts`).
 * Step 3.4 added the two blocks under "When & where": `components/VenueMap.tsx`
 * (the map of the venue) and `components/PhotoGallery.tsx` (the photo strip and
 * its full-screen viewer).
 * Step 3.5 added `components/RelatedEvents.tsx` — the "More from this
 * organizer" row, full width below both columns.
 * Still to come in this milestone: the sticky/mobile ticket behaviour (3.6),
 * the checkout link (3.7) and full Open Graph tags (3.8).
 *
 * Next.js notes (this version differs from older Next.js):
 *  - `params` is a **Promise** and must be awaited — in the page and in
 *    `generateMetadata`.
 *  - `generateStaticParams` lists every slug up front so all 15 event pages are
 *    pre-rendered at build time instead of being built on first visit.
 *  - `notFound()` renders the 404 page for a slug that isn't in our data.
 *
 * Server component — no "use client", so this page ships no JavaScript.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Clock,
  MapPin,
  Star,
} from "lucide-react";
import {
  SAMPLE_EVENTS,
  CATEGORY_MAP,
  formatEventDate,
  formatEventDateLong,
  formatEventTime,
  formatEventTimeRange,
  getEventBySlug,
  STATUS_LABEL,
  type SampleEvent,
} from "@/lib/sample-events";
import { PhotoGallery } from "@/components/PhotoGallery";
import { RelatedEvents } from "@/components/RelatedEvents";
import { TicketsCard } from "@/components/TicketsCard";
import { VenueMap } from "@/components/VenueMap";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Routing + metadata
// ---------------------------------------------------------------------------

/** Pre-render one page per sample event at build time. */
export function generateStaticParams() {
  return SAMPLE_EVENTS.map((event) => ({ slug: event.slug }));
}

/**
 * The browser-tab title and search-result description for this event.
 * Full Open Graph / social-share tags come later in Step 3.8.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Event not found" };

  return {
    title: event.title,
    description: `${formatEventDate(event.startAt)} · ${event.venueName}, ${
      event.island
    } — ${event.description.split("\n\n")[0]}`,
  };
}

// ---------------------------------------------------------------------------
// Small building blocks (kept local to this page for now)
// ---------------------------------------------------------------------------

/** Home / Discover / This event — shown over the top of the cover image. */
function Breadcrumb({ title }: { title: string }) {
  const linkClass =
    "rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70";

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-white/75">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className={linkClass}>
            Home
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <li>
          <Link href="/discover" className={linkClass}>
            Discover
          </Link>
        </li>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {/* The current page isn't a link. `aria-current` tells a screen reader
            "this is where you are". */}
        <li aria-current="page" className="max-w-[60vw] truncate text-white">
          {title}
        </li>
      </ol>
    </nav>
  );
}

/** One line in the "When & where" list: icon + label + value. */
function FactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof CalendarDays;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ocean-600/10 text-ocean-700">
        <Icon className="h-4.5 w-4.5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
          {label}
        </p>
        <div className="mt-0.5 text-ink-900">{children}</div>
      </div>
    </div>
  );
}

/** "Tickets available" / "Almost sold out" / "Sold out" pill. */
function StatusBadge({ status }: { status: SampleEvent["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
        status === "sold_out" && "bg-danger/10 text-danger",
        status === "almost_sold_out" && "bg-warn/15 text-ink-900",
        status === "available" && "bg-success/10 text-success",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "sold_out" && "bg-danger",
          status === "almost_sold_out" && "bg-warn",
          status === "available" && "bg-success",
        )}
        aria-hidden
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

// ---------------------------------------------------------------------------
// The page
// ---------------------------------------------------------------------------

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  // Unknown slug → Next.js renders the 404 page instead of this one.
  if (!event) notFound();

  const category = CATEGORY_MAP[event.category];
  // The description is one string with blank lines between paragraphs, so we
  // split it into an array and render a <p> for each.
  const paragraphs = event.description.split("\n\n");

  return (
    <main className="flex-1">
      {/* ================= Cover ================= */}
      <section className="relative isolate -mt-16 overflow-hidden md:-mt-20">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        {/* Dark ocean scrim — heavier at the bottom, where the text sits. */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ocean-900/75 via-ocean-900/35 to-ocean-900/85" />

        <div className="container-page flex min-h-[62vh] flex-col pt-24 pb-10 md:min-h-[68vh] md:pt-32 md:pb-14">
          <Breadcrumb title={event.title} />

          {/* `mt-auto` pushes the title block down to the bottom of the photo. */}
          <div className="mt-auto pt-10">
            {/* Category + featured badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-ink-900 shadow-soft backdrop-blur-sm">
                <span aria-hidden>{category.emoji}</span>
                {category.label}
              </span>
              {event.featured && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-3 py-1 text-sm font-semibold text-ink-900 shadow-soft">
                  <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
                  Featured
                </span>
              )}
            </div>

            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.1] text-white drop-shadow-[0_2px_14px_rgba(11,60,93,0.5)] sm:text-5xl lg:text-6xl">
              {event.title}
            </h1>

            {/* Meta line: date · time · venue */}
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-white/90 drop-shadow-[0_1px_8px_rgba(11,60,93,0.45)]">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4.5 w-4.5 shrink-0" aria-hidden />
                {formatEventDate(event.startAt)} · {formatEventTime(event.startAt)}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 shrink-0" aria-hidden />
                {event.venueName}, {event.island}
              </span>
            </div>

            {/* Organizer */}
            <p className="mt-3 flex items-center gap-1.5 text-sm text-white/80">
              by <span className="font-medium text-white">{event.organizer}</span>
              {event.organizerVerified && (
                <span className="inline-flex items-center gap-1 text-ocean-400">
                  <BadgeCheck className="h-4 w-4" aria-hidden />
                  <span>verified</span>
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ================= Body: content + ticket column ================= */}
      <div className="container-page grid grid-cols-1 gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14 lg:py-16">
        {/* ---- Left column ---- */}
        <div className="min-w-0">
          <StatusBadge status={event.status} />

          <h2 className="mt-6 font-display text-2xl font-semibold text-ink-900">
            About this event
          </h2>
          <div className="mt-4 space-y-4 text-[17px] leading-relaxed text-ink-900/80">
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
            When &amp; where
          </h2>
          <div className="mt-4 grid gap-5 rounded-card border border-sand-200 bg-sand-100/60 p-6 sm:grid-cols-2">
            <FactRow icon={CalendarDays} label="Date">
              {formatEventDateLong(event.startAt)}
            </FactRow>
            <FactRow icon={Clock} label="Time">
              {formatEventTimeRange(event.startAt, event.endAt)}
            </FactRow>
            <FactRow icon={MapPin} label="Location">
              <span className="font-medium">{event.venueName}</span>
              <br />
              <span className="text-ink-500">{event.address}</span>
            </FactRow>
            <FactRow icon={BadgeCheck} label="Organizer">
              <span className="font-medium">{event.organizer}</span>
              {event.organizerVerified && (
                <span className="ml-1.5 text-sm text-ocean-600">✔ verified</span>
              )}
            </FactRow>
          </div>

          {/* The map sits directly under the facts panel — same "where is this?"
              question, so it doesn't get its own heading (Step 3.4). */}
          <VenueMap
            venueName={event.venueName}
            address={event.address}
            lat={event.lat}
            lng={event.lng}
          />

          {/* Photo strip + full-screen viewer (Step 3.4). */}
          <PhotoGallery images={event.gallery} eventTitle={event.title} />
        </div>

        {/* ---- Right column: the Tickets card (Step 3.2) ---- */}
        <aside className="lg:pt-1">
          <TicketsCard event={event} />

          <Link
            href="/discover"
            className="mt-4 inline-block text-sm font-medium text-ocean-600 transition-colors hover:text-ocean-700"
          >
            ← Back to all events
          </Link>
        </aside>
      </div>

      {/* ================= More from this organizer (Step 3.5) ================= */}
      {/* Deliberately OUTSIDE the two-column grid so the cards get the full
          1200px page width. Inside the left column they'd be squeezed into
          ~720px, i.e. three ~220px cards. It also gives Step 3.6's sticky
          ticket card a clean place to stop. */}
      <RelatedEvents event={event} />
    </main>
  );
}
