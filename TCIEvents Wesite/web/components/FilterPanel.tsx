/**
 * FilterPanel — the filter sidebar on the Discover page (Milestone 2, Step 2.2).
 *
 * Layout (docs/03-Wireframes.md §3): a narrow column down the left on desktop,
 * sitting beside the results grid. On mobile it drops into the normal page flow
 * behind a "Filters" button for now — Step 2.6 turns that into a slide-up
 * drawer. This component doesn't care which: it just renders the controls and
 * calls `onChange` with a brand-new filters object whenever you touch one.
 *
 * Five sections, per the spec:
 *   1. **Category** — a checkbox per category, so you can tick more than one.
 *      The number beside each row is how many events that category would show
 *      given your *other* filters.
 *   2. **Date** — the same five presets as the search bar, as radio buttons.
 *   3. **Island** — "All islands" plus one radio per island.
 *   4. **Price** — a maximum-price slider. **Not wired up yet** (Step 2.3).
 *   5. **Free only** — a checkbox. **Not wired up yet** (Step 2.3).
 *
 * Sections 4 and 5 are rendered `disabled` on purpose rather than left out, so
 * you can see and approve the finished layout now. They do nothing until 2.3 —
 * they're greyed out and captioned so nobody mistakes them for broken controls
 * (the project's data-honesty rule: never fake a feature that isn't built).
 *
 * Why plain `<input type="checkbox">` / `<input type="radio">` instead of custom
 * boxes: real form controls come with keyboard support, screen-reader labels and
 * mobile tap targets for free. Tailwind's `accent-ocean-600` recolours the tick
 * and the dot to our ocean blue, which is all the styling they need.
 *
 * "use client": every control here reports a click back to the Discover page, so
 * it has to run in the browser.
 */

"use client";

import { SlidersHorizontal } from "lucide-react";
import {
  DATE_FILTERS,
  toggleCategory,
  type DiscoverFilters,
} from "@/lib/filter-events";
import {
  CATEGORIES,
  ISLANDS,
  type Category,
  type Island,
} from "@/lib/sample-events";
import { cn } from "@/lib/utils";

export function FilterPanel({
  filters,
  counts,
  onChange,
  onClear,
  showClear,
  className,
}: {
  /** The filters currently applied to the grid. */
  filters: DiscoverFilters;
  /** How many events sit in each category right now (see countByCategory). */
  counts: Record<Category, number>;
  /** Called with the *complete* new filter set whenever a control changes. */
  onChange: (next: DiscoverFilters) => void;
  /** Reset everything (the panel's own "Clear all" button). */
  onClear: () => void;
  /** Only show "Clear all" when there's something to clear. */
  showClear: boolean;
  className?: string;
}) {
  return (
    <aside
      aria-label="Filter events"
      className={cn(
        "rounded-card border border-sand-200 bg-white p-5 shadow-soft",
        className,
      )}
    >
      {/* ---- Panel heading ---- */}
      <div className="flex items-center justify-between gap-3 border-b border-sand-200 pb-4">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ocean-900">
          <SlidersHorizontal className="h-4 w-4 text-ocean-600" aria-hidden />
          Filters
        </h2>
        {showClear && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-control px-2 py-1 text-sm font-semibold text-ocean-600 transition-colors hover:bg-sand-100 hover:text-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ---- 1. Category (multi-select) ---- */}
      <Section title="Category">
        <ul className="space-y-1">
          {CATEGORIES.map((category) => (
            <li key={category.key}>
              <CheckRow
                name="filter-category"
                type="checkbox"
                checked={filters.categories.includes(category.key)}
                onChange={() => onChange(toggleCategory(filters, category.key))}
                label={
                  <>
                    <span aria-hidden>{category.emoji}</span> {category.label}
                  </>
                }
                count={counts[category.key]}
              />
            </li>
          ))}
        </ul>
      </Section>

      {/* ---- 2. Date ---- */}
      <Section title="Date">
        <ul className="space-y-1">
          {DATE_FILTERS.map((preset) => (
            <li key={preset.value}>
              <CheckRow
                name="filter-date"
                type="radio"
                checked={filters.date === preset.value}
                onChange={() => onChange({ ...filters, date: preset.value })}
                label={preset.label}
              />
            </li>
          ))}
        </ul>
      </Section>

      {/* ---- 3. Island ---- */}
      <Section title="Island">
        <ul className="space-y-1">
          <li>
            <CheckRow
              name="filter-island"
              type="radio"
              checked={filters.island === "all"}
              onChange={() => onChange({ ...filters, island: "all" })}
              label="All islands"
            />
          </li>
          {ISLANDS.map((island: Island) => (
            <li key={island}>
              <CheckRow
                name="filter-island"
                type="radio"
                checked={filters.island === island}
                onChange={() => onChange({ ...filters, island })}
                label={island}
              />
            </li>
          ))}
        </ul>
      </Section>

      {/* ---- 4 + 5. Price and Free only — built, not yet wired up ---- */}
      <Section title="Price">
        <label
          htmlFor="filter-price"
          className="flex items-baseline justify-between text-sm text-ink-500"
        >
          <span>Maximum ticket price</span>
          <span className="font-semibold text-ink-900">Any</span>
        </label>
        <input
          id="filter-price"
          type="range"
          min={0}
          max={350}
          step={25}
          defaultValue={350}
          disabled
          className="mt-3 w-full cursor-not-allowed accent-ocean-600 opacity-50"
        />
        <div className="mt-4">
          <CheckRow
            name="filter-free"
            type="checkbox"
            checked={false}
            onChange={() => {}}
            disabled
            label="Free events only"
          />
        </div>
        <p className="mt-3 text-xs italic text-ink-500">
          Price and free-only filtering switch on in Step 2.3.
        </p>
      </Section>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

/** One titled group of controls, with a hairline above it. */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-sand-200 py-5 last:border-b-0 last:pb-0">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
        {title}
      </h3>
      {children}
    </div>
  );
}

/**
 * One tickable row: a real checkbox/radio, its label, and an optional count.
 *
 * The whole row is inside the `<label>`, so clicking anywhere on it — text
 * included — toggles the control. `group-has-[:checked]` is a Tailwind trick
 * that darkens the label text when this row's input is checked, without needing
 * a second piece of React state to track it.
 */
function CheckRow({
  name,
  type,
  checked,
  onChange,
  label,
  count,
  disabled = false,
}: {
  name: string;
  type: "checkbox" | "radio";
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  count?: number;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-control px-2 py-1.5 text-sm transition-colors",
        disabled ? "cursor-not-allowed opacity-50" : "hover:bg-sand-100",
      )}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "h-4 w-4 shrink-0 accent-ocean-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-1",
          type === "checkbox" ? "rounded-sm" : "rounded-full",
        )}
      />
      <span className="flex-1 text-ink-900 group-has-[:checked]:font-semibold group-has-[:checked]:text-ocean-700">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs tabular-nums text-ink-500">{count}</span>
      )}
    </label>
  );
}
