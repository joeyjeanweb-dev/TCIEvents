/**
 * OrganizerCTA — the "Hosting an event?" banner that closes the homepage
 * (docs/02-Spec.md §C.1 item 6, docs/03-Wireframes.md §2).
 *
 * It's the one place on the homepage that speaks to *organizers* rather than
 * ticket buyers, so it deliberately looks different from the sections above it:
 * a dark, full-width photo band with an ocean wash over it and the gold
 * "List Your Event" button — the same premium gold treatment the header uses,
 * kept rare on purpose (docs/02-Spec.md Part A).
 *
 * Layout: text on the left, button on the right at `md` and up; stacked and
 * centred on phones.
 *
 * Note: the button points at `/host`, which is built in Milestone 5. Until then
 * it 404s — that's expected, not a broken link we invented.
 */

import Link from "next/link";
import Image from "next/image";
import { Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

export function OrganizerCTA({ className }: { className?: string }) {
  return (
    <section className={cn("relative isolate overflow-hidden", className)}>
      {/* Background photo — a crowd at an event. `fill` makes it cover the whole
          band; `sizes="100vw"` tells Next.js it's always full-width so it can
          serve a sensibly sized file. No `priority`: this sits far down the
          page, so it should load lazily. */}
      <Image
        src="/events/gallery-celebrate.jpg"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />

      {/* Deep ocean wash over the photo. The image is already dark, and this
          keeps the white text comfortably readable across the whole band. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ocean-900/95 via-ocean-900/85 to-ocean-700/75" />

      <div className="container-page py-16 md:py-20">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:justify-between md:gap-12 md:text-left">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-500 ring-1 ring-inset ring-white/20">
              <Megaphone className="h-3.5 w-3.5" aria-hidden />
              For organizers
            </span>

            <h2 className="mt-4 font-display text-3xl font-semibold text-white md:text-4xl">
              Hosting an event?
            </h2>

            <p className="mt-3 text-base text-white/80 md:text-lg">
              Put it in front of visitors and locals looking for something to do
              across the Turks &amp; Caicos Islands — list it in minutes.
            </p>
          </div>

          {/* `shrink-0` stops the button squashing when the headline is long. */}
          <Link
            href="/host"
            className="inline-flex shrink-0 items-center rounded-control bg-gradient-to-r from-gold-500 to-[#d9b64a] px-7 py-3.5 text-base font-semibold text-ink-900 shadow-lift transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-900"
          >
            List Your Event
          </Link>
        </div>
      </div>
    </section>
  );
}
