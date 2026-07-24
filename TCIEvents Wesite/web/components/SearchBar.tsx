/**
 * SearchBar — the search + date + island + Go control bar (Step 1.7).
 *
 * Where it lives: the top of the **Discover** page (Milestone 2). We decided on
 * 2026-07-23 to keep the homepage hero clean (one gold CTA, per the approved
 * mockup) instead of floating this bar over it, so this is built now and slotted
 * into Discover next.
 *
 * Three inputs + a button:
 *  - a free-text search box (event name, venue, organizer…),
 *  - a **Date** dropdown of friendly presets (Any date / Today / This weekend /…)
 *    rather than a calendar picker — quicker on a phone and enough for Phase 1,
 *  - an **Island** dropdown built from `ISLANDS` in lib/sample-events.ts,
 *  - a **Go** button that submits the form.
 *
 * Two behaviours, chosen by whether the caller passes `onSubmit`:
 *  - **No `onSubmit` (default):** submitting navigates to
 *    `/discover?q=…&date=…&island=…`. That's how it works on its own today.
 *  - **With `onSubmit`:** we hand the values back to the parent and navigate
 *    nowhere. Milestone 2's Discover page will use this to filter the grid live.
 *
 * Honest-link note: `/discover` doesn't exist until Milestone 2, so pressing Go
 * on the preview page 404s for now — expected, same as the category chips.
 *
 * "use client": this component holds typed-in state and calls the router, both
 * of which only work in a Client Component.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CalendarDays, MapPin, ChevronDown } from "lucide-react";
import { ISLANDS, type Island } from "@/lib/sample-events";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Values
// ---------------------------------------------------------------------------

/** The date presets offered in the Date dropdown. */
export const DATE_FILTERS = [
  { value: "any", label: "Any date" },
  { value: "today", label: "Today" },
  { value: "weekend", label: "This weekend" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
] as const;

export type DateFilter = (typeof DATE_FILTERS)[number]["value"];

/** Everything the bar knows. `island: "all"` means "no island filter". */
export type SearchValues = {
  q: string;
  date: DateFilter;
  island: Island | "all";
};

const EMPTY: SearchValues = { q: "", date: "any", island: "all" };

/**
 * Turn the values into a Discover URL, leaving out anything still at its
 * default so the URL stays clean (`/discover` rather than
 * `/discover?q=&date=any&island=all`).
 */
export function buildDiscoverHref(values: SearchValues): string {
  const params = new URLSearchParams();
  if (values.q.trim()) params.set("q", values.q.trim());
  if (values.date !== "any") params.set("date", values.date);
  if (values.island !== "all") params.set("island", values.island);
  const query = params.toString();
  return query ? `/discover?${query}` : "/discover";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SearchBar({
  size = "compact",
  defaultValues,
  onSubmit,
  className,
}: {
  /** "compact" = Discover page top bar. "large" = hero-sized, if we ever want it. */
  size?: "compact" | "large";
  /** Pre-fill the bar (e.g. from the URL when landing on Discover). */
  defaultValues?: Partial<SearchValues>;
  /** If given, we call this instead of navigating (for live filtering). */
  onSubmit?: (values: SearchValues) => void;
  className?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<SearchValues>({
    ...EMPTY,
    ...defaultValues,
  });

  const large = size === "large";
  /** Height of each field — the whole bar lines up on this. */
  const fieldHeight = large ? "h-14" : "h-12";
  const fieldText = large ? "text-base" : "text-sm";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(values);
      return;
    }
    router.push(buildDiscoverHref(values));
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search events"
      className={cn(
        // The bar: one white card on desktop, a stack of fields on mobile.
        "flex w-full flex-col gap-2 rounded-card border border-sand-200 bg-white p-2 shadow-soft",
        "md:flex-row md:items-center md:gap-0",
        className,
      )}
    >
      {/* ---- Free-text search ---- */}
      <div className={cn("relative flex-1", fieldHeight)}>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-600"
          aria-hidden
        />
        <label htmlFor="search-q" className="sr-only">
          Search events
        </label>
        <input
          id="search-q"
          type="search"
          value={values.q}
          onChange={(e) => setValues({ ...values, q: e.target.value })}
          placeholder="Search events, venues, organizers…"
          className={cn(
            "h-full w-full rounded-control bg-transparent pl-9 pr-3 text-ink-900 placeholder:text-ink-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400",
            fieldText,
          )}
        />
      </div>

      {/* On mobile the two dropdowns sit side by side under the search box. */}
      <div className="flex gap-2 md:contents">
        {/* ---- Date preset ---- */}
        <SelectField
          id="search-date"
          label="Date"
          icon={<CalendarDays className="h-4 w-4 text-ocean-600" aria-hidden />}
          value={values.date}
          onChange={(v) => setValues({ ...values, date: v as DateFilter })}
          heightClass={fieldHeight}
          textClass={fieldText}
          widthClass="md:w-44"
        >
          {DATE_FILTERS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </SelectField>

        {/* ---- Island ---- */}
        <SelectField
          id="search-island"
          label="Island"
          icon={<MapPin className="h-4 w-4 text-ocean-600" aria-hidden />}
          value={values.island}
          onChange={(v) => setValues({ ...values, island: v as Island | "all" })}
          heightClass={fieldHeight}
          textClass={fieldText}
          widthClass="md:w-52"
        >
          <option value="all">All islands</option>
          {ISLANDS.map((island) => (
            <option key={island} value={island}>
              {island}
            </option>
          ))}
        </SelectField>
      </div>

      {/* ---- Go ---- */}
      <button
        type="submit"
        className={cn(
          "shrink-0 rounded-control bg-ocean-600 font-semibold text-white transition hover:bg-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-2",
          fieldHeight,
          fieldText,
          large ? "px-8 md:ml-2" : "px-6 md:ml-2",
        )}
      >
        Go
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// One dropdown field (icon + native <select> + our own chevron)
// ---------------------------------------------------------------------------

/**
 * We use a **native** `<select>` on purpose: it gives us the proper mobile
 * wheel picker and full keyboard/screen-reader support for free. Browsers style
 * its arrow inconsistently, so we hide it (`appearance-none`) and draw our own
 * ChevronDown to match the design.
 *
 * The vertical divider (`md:border-l`) only appears on desktop, where the
 * fields sit in one bar; on mobile each field is its own bordered box.
 */
function SelectField({
  id,
  label,
  icon,
  value,
  onChange,
  heightClass,
  textClass,
  widthClass,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  heightClass: string;
  textClass: string;
  /** Fixed width on desktop so the bar's segments don't jitter. */
  widthClass: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex-1 rounded-control border border-sand-200 md:flex-none md:rounded-none md:border-0 md:border-l md:border-sand-200",
        heightClass,
        widthClass,
      )}
    >
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        {icon}
      </span>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-full w-full cursor-pointer appearance-none rounded-control bg-transparent pl-9 pr-8 font-medium text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400",
          textClass,
        )}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
        aria-hidden
      />
    </div>
  );
}
