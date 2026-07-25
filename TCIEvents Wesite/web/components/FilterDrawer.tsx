/**
 * FilterDrawer — the slide-up sheet that holds the filters on mobile (Step 2.6).
 *
 * `docs/03-Wireframes.md` §3 (Mobile): "[ ⚙ Filters ] Sort ▾ ← Filters opens a
 * slide-up drawer". On phones and tablets there isn't room for a permanent
 * sidebar, so the same FilterPanel slides up from the bottom of the screen over
 * the results, the way filter sheets work in native apps.
 *
 * This component is deliberately **generic**: it knows how to be a bottom sheet
 * (backdrop, slide animation, header, scrolling body, sticky footer) but knows
 * nothing about events or filters. Whatever you pass as `children` is what shows
 * inside, so Milestone 3 can reuse it for another mobile sheet.
 *
 * ---------------------------------------------------------------------------
 * Things a sheet like this has to get right (and how they're done here)
 * ---------------------------------------------------------------------------
 *
 * **It stays in the page, always.** Rather than adding and removing it from the
 * page, the sheet is always rendered and simply slid off the bottom of the
 * screen (`translate-y-full`) when closed. That's what gives us a smooth slide
 * *out* as well as in — an element that's been deleted can't animate.
 *
 * **`inert` while closed.** An off-screen sheet is still real, so without this
 * you could Tab into invisible checkboxes. `inert` is a browser feature that
 * switches a whole subtree off: not clickable, not focusable, skipped by screen
 * readers. One attribute replaces a lot of fiddly `tabIndex={-1}` work.
 *
 * **The page behind it can't scroll** while it's open (`overflow: hidden` on
 * `<body>`), so flicking the sheet's contents doesn't scroll the event grid
 * underneath.
 *
 * **Focus goes in, and comes back out.** Opening moves keyboard focus into the
 * sheet; closing puts it back on the "Filters" button you pressed. While it's
 * open, Tab cycles *within* the sheet (a "focus trap") instead of wandering off
 * behind it — the standard behaviour for anything modal.
 *
 * **Escape closes it**, as does tapping the dimmed backdrop.
 *
 * `role="dialog"` + `aria-modal` tell screen readers this is a window on top of
 * the page rather than just more content.
 *
 * Motion: `prefers-reduced-motion` is already honoured globally in
 * `app/globals.css` (all transitions are cut to 0.01ms), so the sheet appears
 * instantly for anyone who's asked for less animation.
 *
 * "use client": it listens for keys, moves focus and animates — all browser work.
 */

"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Everything a person can Tab to — used by the focus trap below. */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function FilterDrawer({
  open,
  onClose,
  title,
  footer,
  children,
}: {
  /** Is the sheet showing? */
  open: boolean;
  /** Called when the visitor closes it (X, Escape, or the backdrop). */
  onClose: () => void;
  /** Heading at the top of the sheet, also read out by screen readers. */
  title: string;
  /** Sticky action row pinned to the bottom (e.g. "Show 12 events"). */
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // ---- Stop the page behind the sheet from scrolling while it's open ----
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Effect cleanups run when `open` flips back to false (or on unmount), so
    // this puts the page's own scrolling back exactly as it was.
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // ---- Escape closes ----
  // Listening on the window (rather than on the sheet) means it still works if
  // focus has drifted onto the page body after a tap.
  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // ---- Move focus in on open, and hand it back on close ----
  useEffect(() => {
    if (!open) return;
    // Remember whatever was focused (the "Filters" button) before we take over.
    const opener = document.activeElement as HTMLElement | null;
    const first = panelRef.current?.querySelector<HTMLElement>(
      FOCUSABLE_SELECTOR,
    );
    // Focus the first control, or the sheet itself if it somehow has none.
    (first ?? panelRef.current)?.focus();
    return () => opener?.focus?.();
  }, [open]);

  /**
   * The focus trap: when Tab would step off either end of the sheet, send it
   * round to the other end instead of out into the page behind.
   */
  function handleTab(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !panelRef.current) return;

    const items = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );
    if (items.length === 0) return;

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === panelRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    // The whole sheet only exists below `lg`; from `lg` up the FilterPanel is a
    // permanent sidebar, so this is switched off entirely (`display: none`,
    // which also takes its contents out of the tab order).
    <div className="lg:hidden">
      {/* ---- Dimmed backdrop ---- */}
      {/* `pointer-events-none` while closed so an invisible sheet can't swallow
          taps meant for the event grid. */}
      {/* z-[60] / z-[70]: the sticky site header is `z-50` and its own mobile
          menu is `z-[60]`, so a sheet that's meant to cover the whole screen
          has to sit above both. */}
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[60] bg-ocean-900/40 transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* ---- The sheet ---- */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        inert={!open}
        onKeyDown={handleTab}
        className={cn(
          "fixed inset-x-0 bottom-0 z-[70] flex max-h-[85vh] flex-col rounded-t-card bg-white shadow-lift transition-transform duration-300 ease-out focus:outline-none",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* Grab handle — the visual cue that says "this is a sheet". */}
        <div
          aria-hidden
          className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-sand-200"
        />

        {/* ---- Header ---- */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-sand-200 px-5 pb-4 pt-3">
          <h2 className="font-display text-lg font-semibold text-ocean-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="-mr-2 rounded-control p-2 text-ink-500 transition-colors hover:bg-sand-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* ---- Scrolling body ---- */}
        {/* `overscroll-contain` stops a flick at the end of this list from
            carrying on and scrolling the page underneath. */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
          {children}
        </div>

        {/* ---- Sticky action row ---- */}
        {/* The bottom padding leaves room for the iPhone home-bar
            (`env(safe-area-inset-bottom)`), falling back to a normal 1rem. */}
        {footer && (
          <div className="shrink-0 border-t border-sand-200 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
