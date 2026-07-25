/**
 * EmptyState — the friendly "there's nothing here" panel (Step 2.5).
 *
 * `docs/02-Spec.md` Part B lists **EmptyState** as one of the site's shared
 * components ("Friendly 'no events match' message — for filtered-to-nothing
 * states"), so it's built as a general-purpose piece rather than something
 * hard-wired to the Discover page: an icon, a heading, a line of explanation,
 * and whatever buttons the caller wants underneath.
 *
 * That matters because Milestone 3+ will need the same panel in other places
 * (an organizer with no events yet, a category with nothing on this month).
 * Only the wording changes; the look stays consistent.
 *
 * It is a **server-friendly** component on purpose — no "use client", no state,
 * no event handlers of its own. The interactive bits are passed in as
 * `children` by whoever is already a client component (here: DiscoverBrowser).
 *
 * Design notes ("Tropical Luxury", docs/02-Spec.md Part A):
 *   - a soft sand→white wash inside a `rounded-card` border so the panel reads
 *     as a calm empty shelf, not an error box (no red, no warning triangle),
 *   - the icon sits in a pale ocean disc, echoing the site's accent colour,
 *   - Fraunces heading, generous vertical padding, everything centred.
 */

import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  children,
  className,
}: {
  /**
   * A lucide icon *component* (not an element) — pass `SearchX`, not
   * `<SearchX />`, so this component controls its size and colour.
   */
  icon?: LucideIcon;
  title: string;
  /** One or two short sentences. Optional. */
  description?: React.ReactNode;
  /** Buttons / links shown under the text. Optional. */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-card border border-sand-200 bg-gradient-to-b from-sand-100 to-white px-6 py-14 text-center sm:py-16",
        className,
      )}
    >
      {/* The pale ocean disc behind the icon. `ring` rather than a border keeps
          the circle perfectly round at every zoom level. */}
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ocean-600/10 ring-1 ring-ocean-400/30">
        <Icon className="h-7 w-7 text-ocean-600" aria-hidden />
      </span>

      {/* h2: the page's h1 is the Discover hero heading, so this is the next
          level down — screen-reader users get a sensible outline. */}
      <h2 className="mt-6 font-display text-2xl font-semibold text-ocean-900 sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-md text-pretty text-ink-500">{description}</p>
      )}

      {children && (
        <div className="mt-8 flex w-full flex-col items-center gap-4">
          {children}
        </div>
      )}
    </div>
  );
}
