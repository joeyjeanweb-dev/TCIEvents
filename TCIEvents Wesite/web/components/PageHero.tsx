/**
 * PageHero — the short photo banner that tops an inner page.
 *
 * Not to be confused with `Hero.tsx`: that one is the tall, left-aligned,
 * light-scrimmed homepage banner with a gold CTA button. This is its smaller
 * sibling — roughly half the height, centred white text over a darkened photo,
 * and no button — because on an inner page the content below is the point.
 *
 * Built for the Discover page; deliberately generic so /about, /help and the
 * other supporting pages (Milestone 6) can reuse it with their own photo.
 *
 * Two layout details worth knowing:
 *  - Like `Hero`, it's pulled up underneath the sticky frosted header with a
 *    negative top margin (`-mt-16 md:-mt-20`) so the photo runs edge to edge
 *    behind it, with matching top padding so the text clears the bar.
 *  - `overlap` adds extra bottom padding, leaving room for whatever sits below
 *    to be lifted onto the banner's lower edge (Discover floats its search bar
 *    there). Without it the banner just ends normally.
 *
 * Plain server component — no state, no JavaScript shipped.
 */

import Image from "next/image";
import { cn } from "@/lib/utils";

export function PageHero({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  overlap = false,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  /** Leave room at the bottom for a card floated over the banner's edge. */
  overlap?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate -mt-16 overflow-hidden md:-mt-20",
        className,
      )}
    >
      {/* Background photo. `priority` = load this first; it's the top of the
          page, so it shouldn't wait its turn behind anything else. */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />

      {/* Ocean-tinted scrim. The photo is busy and bright, so we darken it top
          and bottom to keep white text readable without hiding the picture. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ocean-900/70 via-ocean-900/45 to-ocean-900/75" />

      <div
        className={cn(
          "container-page flex min-h-[38vh] flex-col justify-center pt-28 text-center md:min-h-[42vh] md:pt-36",
          overlap ? "pb-24 md:pb-28" : "pb-14 md:pb-20",
        )}
      >
        <span className="mx-auto block h-0.5 w-10 rounded-full bg-gold-500" />
        <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-white drop-shadow-[0_2px_12px_rgba(11,60,93,0.45)] sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-xl text-base text-white/90 drop-shadow-[0_1px_8px_rgba(11,60,93,0.4)] sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
