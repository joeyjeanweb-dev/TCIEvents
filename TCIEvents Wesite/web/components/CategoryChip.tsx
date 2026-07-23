/**
 * CategoryChip + CategoryChipRow — the horizontal "Explore by Category" row that
 * sits under the hero on the homepage (docs/02-Spec.md Part B + C.1 §2, and the
 * approved mockup in docs/design/homepage-target-mockup.png).
 *
 * What it is:
 *  - CategoryChip: one rounded white pill = a small coloured icon + label
 *    (♪ Music, ⛵ Boat & Water…). It's a link to the Discover page, pre-filtered
 *    to that category (`/discover?category=music`).
 *  - CategoryChipRow: the full row — a leading "All Events" chip followed by one
 *    chip per category from CATEGORIES. It scrolls sideways on narrow screens and
 *    wraps + centers on wider ones.
 *
 * Icons: we use coloured `lucide-react` line-icons here (one accent colour per
 * category) to match the mockup. The plain emoji still live on `CATEGORIES` and
 * are used by the over-image chips on EventCard / FeaturedEventCard — those are
 * unchanged.
 *
 * Active state: the selected chip is drawn as an *outline* (white fill, ocean
 * border + ring) rather than a solid fill, again matching the mockup. The
 * `active` prop is wired up now for Discover to use later.
 *
 * Honest-link note: the Discover page is built in Milestone 2, so for now these
 * links 404 — expected and intentional, exactly like EventCard linking to
 * `/events/[slug]` before Milestone 3.
 *
 * Plain (server) component — the horizontal scroll and all hover motion are pure
 * CSS, so it needs no "use client" and ships zero JavaScript.
 */

import Link from "next/link";
import {
  Music,
  Martini,
  Sailboat,
  UtensilsCrossed,
  PartyPopper,
  Trophy,
  Users,
  Drama,
  Briefcase,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/sample-events";
import { cn } from "@/lib/utils";

/** Icon + accent colour for each category (homepage chip row only). */
const CATEGORY_ICON: Record<Category, { Icon: LucideIcon; color: string }> = {
  music: { Icon: Music, color: "text-violet-500" },
  nightlife: { Icon: Martini, color: "text-emerald-500" },
  boat: { Icon: Sailboat, color: "text-ocean-600" },
  food: { Icon: UtensilsCrossed, color: "text-orange-500" },
  festival: { Icon: PartyPopper, color: "text-pink-500" },
  sports: { Icon: Trophy, color: "text-gold-500" },
  family: { Icon: Users, color: "text-teal-500" },
  arts: { Icon: Drama, color: "text-rose-500" },
  business: { Icon: Briefcase, color: "text-amber-700" },
};

/** One category pill. `active` styles it as the currently-selected filter. */
export function CategoryChip({
  icon,
  label,
  href,
  active = false,
  className,
}: {
  icon?: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        // shrink-0 keeps chips from squashing so the row scrolls instead
        "group inline-flex shrink-0 items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:-translate-y-0.5 focus-visible:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-2",
        active
          ? // selected = ocean outline (not a solid fill), per the mockup
            "border-ocean-600 text-ocean-700 ring-1 ring-ocean-600"
          : "border-sand-200 text-ink-900 hover:border-ocean-300 hover:text-ocean-700",
        className,
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

/**
 * The full horizontal row of chips.
 *
 * @param activeCategory highlight one chip as selected (used later by Discover).
 *                       Pass "all" for the leading "All Events" chip.
 */
export function CategoryChipRow({
  activeCategory,
  className,
}: {
  activeCategory?: Category | "all";
  className?: string;
}) {
  return (
    <div
      className={cn(
        // horizontal scroll on small screens; the row wraps + centers when it fits
        "no-scrollbar flex gap-3 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible",
        className,
      )}
    >
      <CategoryChip
        label="All Events"
        href="/discover"
        active={activeCategory === "all"}
        icon={<CalendarDays className="h-4 w-4 text-ocean-600" aria-hidden />}
      />
      {CATEGORIES.map((c) => {
        const { Icon, color } = CATEGORY_ICON[c.key];
        return (
          <CategoryChip
            key={c.key}
            label={c.label}
            href={`/discover?category=${c.key}`}
            active={activeCategory === c.key}
            icon={<Icon className={cn("h-4 w-4", color)} aria-hidden />}
          />
        );
      })}
    </div>
  );
}
