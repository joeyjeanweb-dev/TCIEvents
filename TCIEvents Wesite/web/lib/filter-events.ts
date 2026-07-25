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
 * Step 2.2 turns category into a **multi-select** (the FilterPanel shows a
 * checkbox per category, so you can tick Music *and* Food at once).
 * Step 2.3 adds the last two: a **maximum price** and a **free-only** switch.
 * Step 2.4 adds **sorting** (date / price / popularity) — see the bottom of the
 * file. Sorting is kept separate from filtering on purpose: filters decide
 * *which* events you see, sort decides *what order* they come in.
 */

import {
  CATEGORIES,
  CATEGORY_MAP,
  ISLANDS,
  TCI_TIME_ZONE,
  lowestPrice,
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
// Price (Step 2.3)
// ---------------------------------------------------------------------------

/**
 * The price slider moves in $25 jumps. Whole-dollar steps would give the slider
 * hundreds of positions that all look the same, and would put ugly numbers like
 * "$137" in the URL; $25 is coarse enough to feel decisive and fine enough to
 * separate a $20 beach party from a $180 chef's table.
 */
export const PRICE_STEP = 25;

/**
 * How far right the slider can go, worked out from the events themselves rather
 * than hard-coded: the priciest event's cheapest ticket, rounded **up** to the
 * next $25. Deriving it means the slider can always reach every event — if a
 * $500 gala is added to `sample-events.ts` tomorrow, the slider grows to fit it
 * instead of quietly making that event unreachable.
 *
 * The far-right position means "Any price" (stored as `null`), not "$250".
 */
export function priceCeiling(events: SampleEvent[]): number {
  const dearest = events.reduce(
    (highest, event) => Math.max(highest, lowestPrice(event)),
    0,
  );
  return Math.max(PRICE_STEP, Math.ceil(dearest / PRICE_STEP) * PRICE_STEP);
}

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
  /**
   * The ticked category checkboxes. An **empty array means "all categories"** —
   * i.e. no narrowing at all. (Step 2.2: this used to be a single category.)
   */
  categories: Category[];
  /**
   * The most someone wants to pay, compared against an event's **cheapest**
   * ticket. `null` = "Any price" (the slider pushed all the way right).
   */
  maxPrice: number | null;
  /** Only show events with a $0 ticket. */
  freeOnly: boolean;
};

/** Nothing selected — every event passes. */
export const DEFAULT_FILTERS: DiscoverFilters = {
  q: "",
  date: "any",
  island: "all",
  categories: [],
  maxPrice: null,
  freeOnly: false,
};

/** True when the user has narrowed anything down (used for "Clear filters"). */
export function hasActiveFilters(filters: DiscoverFilters): boolean {
  return (
    filters.q.trim() !== "" ||
    filters.date !== "any" ||
    filters.island !== "all" ||
    filters.categories.length > 0 ||
    filters.maxPrice !== null ||
    filters.freeOnly
  );
}

/**
 * Tick / untick one category checkbox and hand back a fresh filters object.
 *
 * The result is kept in `CATEGORIES` order (Music, Nightlife, Boat…) rather than
 * click order, so the URL reads the same however you got there.
 */
export function toggleCategory(
  filters: DiscoverFilters,
  category: Category,
): DiscoverFilters {
  const on = filters.categories.includes(category);
  const next = on
    ? filters.categories.filter((c) => c !== category)
    : [...filters.categories, category];

  return {
    ...filters,
    categories: CATEGORIES.map((c) => c.key).filter((key) => next.includes(key)),
  };
}

// ---------------------------------------------------------------------------
// Reading filters out of the URL (?q=…&date=…&island=…&category=…&max=…&free=1)
// ---------------------------------------------------------------------------

/** A query string can hand us a string, a repeated string[], or nothing. */
type RawParam = string | string[] | undefined;

function firstValue(raw: RawParam): string {
  return (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
}

/**
 * Split a param into a list, accepting both `?category=music,food` (what we
 * write) and `?category=music&category=food` (what a hand-typed URL might use).
 */
function listValue(raw: RawParam): string[] {
  const parts = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return parts
    .flatMap((part) => part.split(","))
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * Turn `?q=jazz&category=music,food` into a DiscoverFilters object.
 *
 * Anything unrecognised (a typo'd category, a made-up island) is quietly
 * dropped — a hand-edited URL should never crash the page. A single
 * `?category=music` (what the homepage category chips link to) still works: it
 * just parses to a one-item list.
 */
export function parseDiscoverFilters(
  searchParams: Record<string, RawParam>,
): DiscoverFilters {
  const date = firstValue(searchParams.date) as DateFilter;
  const island = firstValue(searchParams.island);
  const categories = listValue(searchParams.category).filter(
    (value): value is Category => value in CATEGORY_MAP,
  );

  // `?max=100` → 100. Anything that isn't a sensible number ("abc", "-5") falls
  // back to null, i.e. "Any price". Note `max=0` is a *real* value — the slider
  // dragged fully left — so it has to survive, which is why the empty string is
  // rejected separately rather than leaning on Number("") being 0.
  const rawMax = firstValue(searchParams.max);
  const parsedMax = Number(rawMax);
  const maxPrice =
    rawMax !== "" && Number.isFinite(parsedMax) && parsedMax >= 0
      ? Math.round(parsedMax)
      : null;

  return {
    q: firstValue(searchParams.q),
    date: DATE_FILTERS.some((d) => d.value === date) ? date : "any",
    island: (ISLANDS as string[]).includes(island)
      ? (island as Island)
      : "all",
    // De-duplicated and put back into CATEGORIES order.
    categories: CATEGORIES.map((c) => c.key).filter((key) =>
      categories.includes(key),
    ),
    maxPrice,
    freeOnly: firstValue(searchParams.free) === "1",
  };
}

/**
 * The reverse: build a shareable `/discover?…` URL from the current filters
 * (and, since Step 2.4, the chosen sort order).
 * Defaults are left out so the URL stays short and readable.
 */
export function discoverHref(
  filters: DiscoverFilters,
  sort: SortOption = DEFAULT_SORT,
): string {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.date !== "any") params.set("date", filters.date);
  if (filters.island !== "all") params.set("island", filters.island);
  if (filters.categories.length) {
    params.set("category", filters.categories.join(","));
  }
  // "Free only" already implies $0, so there's no point carrying a max price
  // alongside it — leaving it out keeps the URL honest about what's applied.
  if (filters.freeOnly) {
    params.set("free", "1");
  } else if (filters.maxPrice !== null) {
    params.set("max", String(filters.maxPrice));
  }
  // Date order is the default, so it never needs to appear in the URL.
  if (sort !== DEFAULT_SORT) params.set("sort", sort);
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
    // Empty list = "all categories", so only narrow when something is ticked.
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(event.category)
    ) {
      return false;
    }
    if (filters.island !== "all" && event.island !== filters.island) {
      return false;
    }
    if (window) {
      const day = tciDayKey(event.startAt);
      if (day < window.start || day > window.end) return false;
    }
    // Price is judged on the event's CHEAPEST ticket, so a $0-entry festival
    // with a $15 VIP pass still counts as free, and a gala whose cheapest seat
    // is $150 disappears once you drag the slider below $150.
    const from = lowestPrice(event);
    if (filters.freeOnly && from !== 0) {
      return false;
    }
    if (filters.maxPrice !== null && from > filters.maxPrice) {
      return false;
    }
    if (query && !searchHaystack(event).includes(query)) {
      return false;
    }
    return true;
  });
}

/**
 * How many events each category would show — used for the "(3)" numbers beside
 * the FilterPanel checkboxes.
 *
 * The counts deliberately ignore the *category* filter itself but respect every
 * other one. That's what makes them useful: with "Grand Turk" selected you can
 * see at a glance that Music has 2 events there and Business has none, instead
 * of every row reading 0 the moment you tick one box.
 */
export function countByCategory(
  events: SampleEvent[],
  filters: DiscoverFilters,
  nowISO: string,
): Record<Category, number> {
  const matching = filterEvents(
    events,
    { ...filters, categories: [] },
    nowISO,
  );

  const counts = Object.fromEntries(
    CATEGORIES.map((c) => [c.key, 0]),
  ) as Record<Category, number>;

  for (const event of matching) counts[event.category] += 1;
  return counts;
}

/**
 * How many free events the *other* filters currently allow — the number shown
 * beside "Free events only".
 *
 * Same trick as `countByCategory`: switch off the filter the number belongs to
 * (here `freeOnly`, plus the price slider, which can only ever hide free events
 * by accident) so the count answers "what would ticking this give me?" rather
 * than "what am I already looking at?".
 */
export function countFree(
  events: SampleEvent[],
  filters: DiscoverFilters,
  nowISO: string,
): number {
  return filterEvents(
    events,
    { ...filters, freeOnly: true, maxPrice: null },
    nowISO,
  ).length;
}

// ---------------------------------------------------------------------------
// "Nothing matched" suggestions (Step 2.5)
// ---------------------------------------------------------------------------

/**
 * One suggested way out of an empty results grid: "Any date — 5 events".
 *
 * `filters` is the *whole* filter object with that single choice reset, ready to
 * hand straight to the page's `apply()`, so the EmptyState buttons don't need to
 * know anything about how filters are shaped.
 */
export type FilterRelaxation = {
  /** Stable key for React lists ("date", "island", …). */
  key: string;
  /** Button text — matches the wording used in the FilterPanel. */
  label: string;
  /** How many events this would actually bring back. Always 1 or more. */
  count: number;
  /** The filters to apply if the visitor takes this suggestion. */
  filters: DiscoverFilters;
};

/**
 * Work out which *single* filter, if loosened, would bring some events back.
 *
 * This is what makes the empty state useful rather than just apologetic. Instead
 * of only offering "Clear filters" — which throws away everything the visitor
 * carefully picked — we try relaxing each active filter on its own and keep the
 * ones that would actually show something.
 *
 * **Honest-data note (CLAUDE.md §5):** every count here is measured by really
 * re-running `filterEvents`, not estimated. A suggestion is only offered if it
 * genuinely leads somewhere, so pressing one can never land you back on another
 * empty grid.
 *
 * Best-first: the suggestion that brings back the most events is listed first.
 * `Array.sort` is stable in modern JavaScript, so equal counts stay in the order
 * they're declared below (which follows the FilterPanel top-to-bottom).
 */
export function relaxationSuggestions(
  events: SampleEvent[],
  filters: DiscoverFilters,
  nowISO: string,
): FilterRelaxation[] {
  /** Each active filter, paired with the version of itself that's switched off. */
  const candidates: { key: string; label: string; patch: Partial<DiscoverFilters> }[] = [];

  if (filters.q.trim()) {
    candidates.push({
      key: "q",
      label: `Drop “${filters.q.trim()}”`,
      patch: { q: "" },
    });
  }
  if (filters.categories.length > 0) {
    candidates.push({
      key: "categories",
      label: "All categories",
      patch: { categories: [] },
    });
  }
  if (filters.date !== "any") {
    candidates.push({ key: "date", label: "Any date", patch: { date: "any" } });
  }
  if (filters.island !== "all") {
    candidates.push({
      key: "island",
      label: "All islands",
      patch: { island: "all" },
    });
  }
  if (filters.maxPrice !== null) {
    candidates.push({
      key: "price",
      label: "Any price",
      patch: { maxPrice: null },
    });
  }
  if (filters.freeOnly) {
    candidates.push({
      key: "free",
      label: "Include paid events",
      patch: { freeOnly: false },
    });
  }

  return candidates
    .map(({ key, label, patch }) => {
      const relaxed = { ...filters, ...patch };
      return {
        key,
        label,
        filters: relaxed,
        count: filterEvents(events, relaxed, nowISO).length,
      };
    })
    .filter((suggestion) => suggestion.count > 0)
    .sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------------
// Sorting (Step 2.4)
// ---------------------------------------------------------------------------

/**
 * The three orders offered in the Sort dropdown (`docs/02-Spec.md` §Discover).
 *
 * The labels spell out the *direction* ("soonest first", "low to high") because
 * a bare "Date" leaves you guessing whether you're about to see next weekend or
 * New Year's Eve.
 */
export const SORT_OPTIONS = [
  { value: "date", label: "Date — soonest first" },
  { value: "price", label: "Price — low to high" },
  { value: "popularity", label: "Most popular" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

/** What the grid shows if you never touch the dropdown. */
export const DEFAULT_SORT: SortOption = "date";

/** `?sort=price` → "price". Anything unrecognised falls back to date order. */
export function parseSortOption(
  searchParams: Record<string, RawParam>,
): SortOption {
  const value = firstValue(searchParams.sort);
  return SORT_OPTIONS.some((option) => option.value === value)
    ? (value as SortOption)
    : DEFAULT_SORT;
}

/**
 * How "popular" an event is, 0–4.
 *
 * **Honest-data note (see CLAUDE.md §Data-honesty).** Phase 1 has no ticket
 * sales, so there is no real popularity number to sort by — and we refuse to
 * invent one ("1,284 sold" would be a lie). Instead the score is worked out from
 * two signals the sample data genuinely carries:
 *
 *   - `featured` — the events the site itself is promoting (+2),
 *   - `status` — how the tickets are moving: "Almost sold out" is the strongest
 *     demand signal we have (+2). "Sold out" scores +1 rather than +2: it was
 *     clearly popular, but you can't buy it, so it shouldn't crowd the top of
 *     the list ahead of things you can still get into.
 *
 * When real sales data arrives in a later phase, this one function is the only
 * thing that has to change.
 */
function popularityScore(event: SampleEvent): number {
  const featured = event.featured ? 2 : 0;
  const demand =
    event.status === "almost_sold_out" ? 2 : event.status === "sold_out" ? 1 : 0;
  return featured + demand;
}

/** Milliseconds since 1970 — used to put events in calendar order. */
function startTime(event: SampleEvent): number {
  return new Date(event.startAt).getTime();
}

/**
 * Put a list of events into the chosen order.
 *
 * Returns a **new array** (`[...events]`) rather than sorting in place, because
 * `Array.prototype.sort` mutates — and the list handed in here is the shared
 * sample-events array. Re-ordering it would quietly change the homepage too.
 *
 * Every order ends with the same tie-breaker, "soonest first": two $40 events
 * or two equally-popular events should still read as a sensible calendar.
 */
export function sortEvents(
  events: SampleEvent[],
  sort: SortOption,
): SampleEvent[] {
  const byDate = (a: SampleEvent, b: SampleEvent) => startTime(a) - startTime(b);

  switch (sort) {
    case "price":
      return [...events].sort(
        (a, b) => lowestPrice(a) - lowestPrice(b) || byDate(a, b),
      );

    case "popularity":
      // Highest score first, hence b − a.
      return [...events].sort(
        (a, b) => popularityScore(b) - popularityScore(a) || byDate(a, b),
      );

    case "date":
    default:
      return [...events].sort(byDate);
  }
}
