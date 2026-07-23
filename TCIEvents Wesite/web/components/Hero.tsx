/**
 * Hero — the big full-bleed banner at the top of a page, matching the approved
 * mockup (docs/design/homepage-target-mockup.png).
 *
 * It's reusable on purpose: the homepage uses it now, and the /host organizer
 * landing page (Milestone 5) will reuse the same component with different copy
 * and (optionally) a different image — Joey asked for a "similar hero" there.
 *
 * Layout:
 *  - a full-width background image (`next/image`, `priority` so it loads first),
 *  - a gentle left-weighted light scrim so the dark headline stays readable over
 *    the bright photo,
 *  - a text column (headline → subtext → one CTA button) sitting over the lighter
 *    left side of the image, exactly like the mockup.
 *
 * The global SiteHeader is sticky + translucent (frosted). We pull the hero up
 * underneath it with a negative top margin (and matching top padding on the text)
 * so the photo shows through the frosted bar — again matching the mockup.
 */

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Hero({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  imageSrc,
  imageAlt,
  className,
}: {
  /** Headline. Accepts a node so callers can add a <br/> between lines. */
  title: React.ReactNode;
  subtitle: React.ReactNode;
  ctaLabel: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        // pull up under the sticky, translucent header (h-16 / md:h-20)
        "relative isolate -mt-16 overflow-hidden md:-mt-20",
        className,
      )}
    >
      {/* Background photo */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />

      {/* Left-weighted light scrim → keeps the dark headline legible while the
          right side of the photo stays vivid. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/85 via-white/45 to-transparent sm:from-white/75 sm:via-white/25" />

      <div className="container-page flex min-h-[78vh] flex-col justify-center pb-16 pt-28 md:min-h-[82vh] md:pt-36">
        <div className="max-w-xl">
          <h1 className="font-display text-4xl font-semibold leading-[1.08] text-ink-900 sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-base text-ink-700 sm:text-lg">
            {subtitle}
          </p>
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center rounded-control bg-gradient-to-r from-gold-500 to-[#d9b64a] px-7 py-3.5 text-base font-semibold text-ink-900 shadow-soft transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-2"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
