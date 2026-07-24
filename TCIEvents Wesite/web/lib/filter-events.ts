/**
 * Filtering for the Discover page (Milestone 2).
 *
 * All of this is plain, dependency-free TypeScript that takes a list of events
 * plus a set of filter choices and hands back the events that match. Keeping it
 * in `lib/` (rather than inside the React component) means:
 *   - the page component stays about *layout*, not logic,
 *   - the same functions run on the server (first paint) and in the browser
 *     (when you change a filter) and give identical answers.
 *
 * Step 2.1 supports: free-text search, date preset, island, category.
 * Price range and "free only" arrive with the FilterPanel in Steps 2.2–2.3.
 */

import {
  CATEGORY_MAP,
  ISLANDS,
  TCI_TIME_ZONE,
  type Category,
  type Island,
  type SampleEvent,
} from "@/lib/sample-events";

// ---------------------------------------------------------------------------
// The date presets offered in the Date dropdown
// ---------------------------------------------------------------------------

/**
 * These live here (not in SearchBar) so that server code can read them without
 * pulling in a browser-only component. SearchBar re-exports them, so existing
 * imports from "@/components/SearchBar" keep working.
 */
export const DATE_FILTERS = [
  { value: "any", label: "Any date" },
  { value: "today", label: "Today" },
  { value: "weekend", label: "This weekend" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
] as const;

export type DateFilter = (typeof DATE_FILTERS)[number]["value"];

// ---------------------------------------------------------------------------
// The shape of "what the user has chosen"
// ---------------------------------------------------------------------------

export type DiscoverFilters = {
  /** Free text typed into the search box. */
  q: string;
  /** One of the presets in the Date dropdown ("any" = no date limit). */
  date: DateFilter;
  /** A single island, or "all". */
  island: Island | "all";
  /** A single category, or "all". */
  category: Category | "all";
};

/** Nothing selected — every event passes. */
export const DEFAULT_FILTERS: DiscoverFilters = {
  q: "",
  date: "any",
  island: "all",
  category: "all",
};

/** True when the user has narrowed anything down (used for "Clear filters"). */
export function hasActiveFilters(filters: DiscoverFilters): boolean {
  return (
    filters.q.trim() !== "" ||
    filters.date !== "any" ||
    filters.island !== "all" ||
    filters.category !== "all"
  );
}

// ---------------------------------------------------------------------------
// Reading filters out of the URL (?q=…&date=…&island=…&category=…)
// ---------------------------------------------------------------------------

/** A query string can hand us a string, a repeated string[], or nothing. */
type RawParam = string | string[] | undefined;

function firstValue(raw: RawParam): string {
  return (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
}

/**
 * Turn `?q=jazz&category=music` into a DiscoverFilters object.
 *
 * Anything unrecognised (a typo'd category, a made-up island) quietly falls
 * back to "all" — a hand-edited URL should never crash the page.
 */
export function parseDiscoverFilters(
  searchParams: Record<string, RawParam>,
): DiscoverFilters {
  const date = firstValue(searchParams.date) as DateFilter;
  const island = firstValue(searchParams.island);
  const category = firstValue(searchParams.category);

  return {
    q: firstValue(searchParams.q),
    date: DATE_FILTERS.some((d) => d.value === date) ? date : "any",
    island: (ISLANDS as string[]).includes(island)
      ? (island as Island)
      : "all",
    category:
      category in CATEGORY_MAP ? (category as Category) : "all",
  };
}

/**
 * The reverse: build a shareable `/discover?…` URL from the current filters.
 * Defaults are left out so the URL stays short and readable.
 */
export function discoverHref(filters: DiscoverFilters): string {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.date !== "any") params.set("date", filters.date);
  if (filters.island !== "all") params.set("island", filters.island);
  if (filters.category !== "all") params.set("category", filters.category);
  const query = params.toString();
  return query ? `/discover?${query}` : "/discover";
}

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

/**
 * The calendar day an instant falls on **in Turks & Caicos time**, as a sortable
 * "YYYY-MM-DD" string (e.g. "2026-08-29").
 *
 * Why strings? Because "is this event in the next 7 days?" is really a question
 * about *calendar days in TCI*, not about milliseconds. Comparing "2026-08-29"
 * with "2026-09-04" alphabetically gives the right answer, and — crucially — the
 * result is identical whether this runs on the server (usually UTC) or in a
 * visitor's browser in another time zone. That keeps React's server HTML and
 * client HTML in sync (no hydration warnings).
 */
export function tciDayKey(iso: string): string {
  // "en-CA" formats dates as YYYY-MM-DD, which is exactly the key we want.
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: TCI_TIME_ZONE });
}

/** Plain calendar maths on a day key: addDays("2026-07-31", 1) → "2026-08-01". */
function addDays(dayKey: string, days: number): string {
  const [year, month, day] = dayKey.split("-").map(Number);
  // Date.UTC handles month/year rollover for us. UTC avoids any DST surprises.
  return new Date(Date.UTC(year, month - 1, day + days))
    .toISOString()
    .slice(0, 10);
}

/** 0 = Sunday … 6 = Saturday, for a day key. */
function dayOfWeek(dayKey: string): number {
  return new Date(`${dayKey}T12:00:00Z`).getUTCDay();
}

/**
 * Turn a date preset into an inclusive window of day keys, or `null` for
 * "any date" (no limit).
 *
 * - **today** — just today.
 * - **weekend** — the coming Friday→Sunday. If it's already the weekend, the
 *   window runs from today to Sunday.
 * - **week** — today plus the next 6 days.
 * - **month** — today to the last day of the current calendar month.
 */
export function dateWindow(
  preset: DateFilter,
  nowISO: string,
): { start: string; end: string } | null {
  const today = tciDayKey(nowISO);

  switch (preset) {
    case "today":
      return { start: today, end: today };

    case "weekend": {
      const weekday = dayOfWeek(today); // 0 = Sun … 5 = Fri, 6 = Sat
      if (weekday === 0) return { start: today, end: today }; // Sunday
      if (weekday === 6) return { start: today, end: addDays(today, 1) }; // Sat
      if (weekday === 5) return { start: today, end: addDays(today, 2) }; // Fri
      // Mon–Thu: jump forward to Friday, then run through Sunday.
      const friday = addDays(today, 5 - weekday);
      return { start: friday, end: addDays(friday, 2) };
    }

    case "week":
      return { start: today, end: addDays(today, 6) };

    case "month": {
      const [year, month] = today.split("-").map(Number);
      // Day 0 of next month = the last day of this month.
      const lastDay = new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
      return { start: today, end: lastDay };
    }

    case "any":
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// The filter itself
// ---------------------------------------------------------------------------

/** Everything the free-text box searches over, lowercased once per event. */
function searchHaystack(event: SampleEvent): string {
  return [
    event.title,
    event.venueName,
    event.island,
    event.organizer,
    CATEGORY_MAP[event.category].label,
  ]
    .join(" ")
    .toLowerCase();
}

/**
 * Apply every filter to the event list.
 *
 * @param nowISO "right now" as an ISO string, passed in rather than read from
 *   the clock inside here. The Discover page reads the clock once on the server
 *   and hands the same value to the browser, so both render the same result.
 */
export function filterEvents(
  events: SampleEvent[],
  filters: DiscoverFilters,
  nowISO: string,
): SampleEvent[] {
  const query = filters.q.trim().toLowerCase();
  const window = dateWindow(filters.date, nowISO);

  return events.filter((event) => {
    if (filters.category !== "all" && event.category !== filters.category) {
      return false;
    }
    if (filters.island !== "all" && event.island !== filters.island) {
      return false;
    }
    if (window) {
      const day = tciDayKey(event.startAt);
      if (day < window.start || day > window.end) return false;
    }
    if (query && !searchHaystack(event).includes(query)) {
      return false;
    }
    return true;
  });
}
