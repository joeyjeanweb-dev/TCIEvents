/**
 * SortSelect — the "Sort: Date ▾" dropdown on the Discover page (Step 2.4).
 *
 * Position, per `docs/03-Wireframes.md` §3: the far right of the results bar,
 * opposite the event count ("42 events … Sort: Date ▾"), on both desktop and
 * mobile.
 *
 * Like the SearchBar's dropdowns this is a **native `<select>`** with its own
 * arrow drawn on top. Native means we get the iOS/Android wheel picker, full
 * keyboard support and screen-reader announcements for free — a hand-built
 * dropdown would need all of that re-implementing. `appearance-none` hides the
 * browser's default arrow so our ChevronDown is the only one showing.
 *
 * The visible "Sort" text is a real `<label>` tied to the select by `htmlFor`,
 * so clicking the word opens the menu and screen readers read
 * "Sort, Date — soonest first, combo box".
 *
 * "use client": it reports every change back up to DiscoverBrowser.
 */

"use client";

import { ArrowUpDown, ChevronDown } from "lucide-react";
import { SORT_OPTIONS, type SortOption } from "@/lib/filter-events";
import { cn } from "@/lib/utils";

export function SortSelect({
  value,
  onChange,
  className,
}: {
  value: SortOption;
  onChange: (next: SortOption) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label
        htmlFor="discover-sort"
        className="flex shrink-0 items-center gap-1.5 text-sm text-ink-500"
      >
        <ArrowUpDown className="h-4 w-4 text-ocean-600" aria-hidden />
        Sort
      </label>

      <div className="relative">
        <select
          id="discover-sort"
          value={value}
          onChange={(event) => onChange(event.target.value as SortOption)}
          className="h-10 cursor-pointer appearance-none rounded-control border border-sand-200 bg-white pl-3 pr-9 text-sm font-semibold text-ink-900 shadow-soft transition-colors hover:bg-sand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
          aria-hidden
        />
      </div>
    </div>
  );
}
