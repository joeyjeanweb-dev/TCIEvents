"use client";

/**
 * FeaturedCarousel — the horizontal scrolling row that holds the homepage
 * FeaturedEventCards (Step 1.8b).
 *
 * Why this exists: the row was previously a plain `overflow-x-auto` div with the
 * `.no-scrollbar` helper on it. That works fine with a touchpad or a phone
 * (swipe), but on a desktop with a normal mouse there was *nothing to grab* —
 * no scrollbar and no buttons — so the extra cards off the right edge were
 * unreachable. This adds proper prev/next arrow buttons.
 *
 * This is a **client component** (`"use client"` at the top) because it needs
 * browser-only things: a ref to the scrolling <div>, and React state to know
 * whether we're at the start/end of the row so the arrows can be disabled.
 * The cards themselves are still plain server-rendered markup — they're passed
 * in as `children`, so no extra JavaScript is shipped for them.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeaturedCarousel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  // A direct handle on the scrolling element so we can read/change its scroll position.
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Are there more cards hidden to the left / right? Drives the arrow buttons.
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /** Re-check where we are in the row (called on scroll, on resize, and on mount). */
  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // How far we could still scroll right = total width - visible width - current position.
    const maxScroll = el.scrollWidth - el.clientWidth;
    // 1px of slack: browsers round sub-pixel widths, so an "at the end" scroll
    // position is often 0.5px short of the max.
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    updateArrows();

    // Recalculate if the row itself changes size (window resize, font load, etc.).
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateArrows]);

  /** Scroll by roughly one card, in the given direction. */
  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;

    // Measure the first card so the step always matches the real card width
    // (280px on mobile, 320px on sm+), plus the 24px flex gap.
    const firstCard = el.firstElementChild as HTMLElement | null;
    const step = firstCard ? firstCard.offsetWidth + 24 : el.clientWidth * 0.8;

    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollerRef}
        onScroll={updateArrows}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
      >
        {children}
      </div>

      {/* Arrow buttons — hidden on touch-first small screens (swiping works there),
          shown from md up where a mouse is likely. `aria-hidden` on the wrapper
          isn't used: these are real buttons with labels for screen readers. */}
      <ArrowButton
        side="left"
        disabled={!canScrollLeft}
        onClick={() => scrollByCard(-1)}
      />
      <ArrowButton
        side="right"
        disabled={!canScrollRight}
        onClick={() => scrollByCard(1)}
      />
    </div>
  );
}

function ArrowButton({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const isLeft = side === "left";
  const Icon = isLeft ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isLeft ? "Previous featured events" : "Next featured events"}
      className={cn(
        // Vertically centred on the card's image area rather than the whole card.
        "absolute top-[38%] hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full",
        "border border-sand-200 bg-white/95 text-ocean-700 shadow-lift backdrop-blur-sm",
        "transition hover:bg-white hover:text-ocean-900",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-0",
        // `grid` (not `hidden`) from md up so `place-items-center` applies.
        "md:grid",
        isLeft ? "-left-4" : "-right-4",
      )}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  );
}
