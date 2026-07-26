/**
 * PhotoGallery — the photo strip on the Event Details page, plus the full-screen
 * viewer ("lightbox") you get when you click one (Step 3.4).
 *
 * `docs/03-Wireframes.md` §4 sketches it as "GALLERY ▢ ▢ ▢ ▢" under the map.
 * The photos come from `gallery` on each event in `lib/sample-events.ts` (3 per
 * event today) and live in `/public/events/`.
 *
 * ---------------------------------------------------------------------------
 * Two pieces in one file
 * ---------------------------------------------------------------------------
 * 1. **The thumbnail grid** — a plain list of buttons. Buttons, not clickable
 *    `<div>`s, so the keyboard and screen readers get them for free.
 * 2. **The lightbox** — a modal that covers the page with one big photo, with
 *    ← / → to move between shots and Escape to leave.
 *
 * ---------------------------------------------------------------------------
 * What a modal has to get right (same checklist as `FilterDrawer`)
 * ---------------------------------------------------------------------------
 * - **Escape closes it**, and so does clicking the dark backdrop.
 * - **← / →** step through the photos, wrapping around at either end.
 * - **The page behind can't scroll** while it's open.
 * - **Focus moves in and comes back out**: opening focuses the close button,
 *   closing returns focus to the exact thumbnail you clicked, so the keyboard
 *   doesn't lose its place. Tab cycles inside the modal (a "focus trap").
 * - `role="dialog"` + `aria-modal` tell assistive tech this is a window on top
 *   of the page, not more page.
 *
 * Unlike `FilterDrawer`, the lightbox is only in the page while it's open —
 * a full-screen black overlay is not something to leave lying around switched
 * off. It fades in via `.animate-fade-in` (defined in `app/globals.css`), and
 * `prefers-reduced-motion` already cuts that globally for anyone who asked for
 * less animation.
 *
 * ---------------------------------------------------------------------------
 * Honest alt text
 * ---------------------------------------------------------------------------
 * These are sample photos, so we can't truthfully describe what's in each one.
 * The alt text says what it honestly is — "<event> — photo 2 of 3" — rather
 * than inventing a description of a picture nobody has captioned.
 *
 * "use client": it keeps state (which photo is open), listens for key presses
 * and moves focus — all browser-side work.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function PhotoGallery({
  images,
  eventTitle,
}: {
  /** Paths under /public, e.g. "/events/gallery-party-1.jpg". */
  images: string[];
  /** Used in the alt text and the viewer's caption. */
  eventTitle: string;
}) {
  /** Which photo is showing full-screen — `null` means the viewer is closed. */
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  /** The modal box, used by the focus trap to find what's inside it. */
  const panelRef = useRef<HTMLDivElement>(null);
  /** The thumbnail that opened the viewer, so focus can go back to it. */
  const openerRef = useRef<HTMLElement | null>(null);

  // An event with no gallery photos simply gets no gallery section — better an
  // absent section than an empty heading over a blank space.
  const hasImages = images.length > 0;

  function open(index: number) {
    // Remember what was focused (the thumbnail) before the modal takes over.
    openerRef.current = document.activeElement as HTMLElement | null;
    setOpenIndex(index);
  }

  // `useCallback` keeps these functions stable between renders so the keyboard
  // effect below doesn't tear down and re-attach its listener on every render.
  const close = useCallback(() => setOpenIndex(null), []);

  /** Move `step` photos along, wrapping around past either end. */
  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        // Adding `images.length` first keeps the result positive, because in
        // JavaScript `-1 % 3` is `-1`, not `2`.
        return (current + delta + images.length) % images.length;
      });
    },
    [images.length],
  );

  // ---- Escape / arrow keys, while the viewer is open ----
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, close, step]);

  // ---- Freeze the page behind the viewer ----
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // ---- Focus in on open, back to the thumbnail on close ----
  useEffect(() => {
    if (!isOpen) return;
    const first = panelRef.current?.querySelector<HTMLElement>("button");
    (first ?? panelRef.current)?.focus();
    return () => openerRef.current?.focus?.();
  }, [isOpen]);

  /**
   * The focus trap. Everything inside the viewer is a `<button>` (close, prev,
   * next), so we can simply collect the buttons rather than testing for every
   * kind of focusable element.
   */
  function handleTab(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !panelRef.current) return;

    const items = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>("button"),
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

  if (!hasImages) return null;

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-display text-2xl font-semibold text-ink-900">
          Photos
        </h2>
        <p className="text-sm text-ink-500">
          {images.length} {images.length === 1 ? "photo" : "photos"} · click to
          enlarge
        </p>
      </div>

      {/* ---- Thumbnail grid ---- */}
      {/* Two across on phones, three from `sm` up. `aspect-[4/3]` keeps every
          tile the same shape whatever the photo's real proportions are. */}
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, index) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => open(index)}
              /* `group` lets the hover effects below react to a hover on this
                 button rather than on themselves. */
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-card border border-sand-200 bg-sand-100 shadow-soft transition-shadow hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-2"
            >
              <Image
                src={src}
                /* Empty alt on purpose: the photo *is* the button's face, and
                   the button already has a name (the `sr-only` text below).
                   Describing it twice would make a screen reader say it twice. */
                alt=""
                fill
                /* Tells the browser roughly how wide the tile will be so it can
                   download a right-sized copy instead of the full photo. */
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
              {/* Ocean wash + expand icon, faded in on hover/focus so the tile
                  visibly says "I open". */}
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center bg-ocean-900/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ocean-900 shadow-soft">
                  <Expand className="h-4.5 w-4.5" />
                </span>
              </span>
              {/* The button's accessible name: what pressing it does. */}
              <span className="sr-only">
                Enlarge photo {index + 1} of {images.length}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* ---- Full-screen viewer ---- */}
      {isOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-[80] flex flex-col bg-ocean-900/95 backdrop-blur-sm"
          /* Clicking the dark space around the photo closes. The photo and the
             buttons sit in their own boxes and stop the click from reaching
             here, so only genuine backdrop clicks count. */
          onClick={close}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${eventTitle} — photo ${openIndex + 1} of ${
              images.length
            }`}
            tabIndex={-1}
            onKeyDown={handleTab}
            className="flex h-full flex-col focus:outline-none"
          >
            {/* ---- Top bar: counter + close ---- */}
            <div className="flex shrink-0 items-center justify-between gap-4 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3 text-white">
              <p className="text-sm font-medium tabular-nums text-white/80">
                {openIndex + 1} / {images.length}
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="Close photo viewer"
                className="-mr-2 rounded-control p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>

            {/* ---- The photo + the arrows ---- */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4">
              {/* `stopPropagation` — a click on the photo shouldn't close. */}
              <div
                onClick={(event) => event.stopPropagation()}
                className="relative h-full w-full max-w-5xl"
              >
                <Image
                  key={images[openIndex]}
                  src={images[openIndex]}
                  alt={`${eventTitle} — photo ${openIndex + 1} of ${
                    images.length
                  }`}
                  fill
                  sizes="100vw"
                  /* `object-contain`, not cover: show the whole photo, letterboxed,
                     rather than cropping it to fill the screen. */
                  className="object-contain"
                />
              </div>

              {images.length > 1 && (
                <>
                  <ViewerArrow
                    side="left"
                    label="Previous photo"
                    onClick={() => step(-1)}
                  />
                  <ViewerArrow
                    side="right"
                    label="Next photo"
                    onClick={() => step(1)}
                  />
                </>
              )}
            </div>

            {/* ---- Caption ---- */}
            <p className="shrink-0 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-sm text-white/70">
              {eventTitle}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

/** One round ← / → button, floated over the left or right edge of the photo. */
function ViewerArrow({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        // Don't let the click reach the backdrop, which would close the viewer.
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:h-12 sm:w-12",
        side === "left" ? "left-2 sm:left-4" : "right-2 sm:right-4",
      )}
    >
      <Icon className="h-6 w-6" aria-hidden />
    </button>
  );
}
