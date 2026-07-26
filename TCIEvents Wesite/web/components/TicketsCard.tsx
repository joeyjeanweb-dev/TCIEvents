/**
 * TicketsCard — the right-hand "TICKETS" panel on the event details page
 * (Milestone 3, Step 3.2).
 *
 * Matches the wireframe in `docs/03-Wireframes.md` §4: a card listing every
 * ticket type with a −/+ stepper, then a divider, then the Get Tickets button.
 *
 * What this step does and doesn't do:
 *   - 3.2 — the card, the list of `TicketOption` rows, and the quantity state
 *     behind the steppers.
 *   - 3.3 (this step) — the live **Subtotal / Fee (5%) / Total** rows in the
 *     footer, recalculated on every − or + press. The arithmetic itself lives in
 *     `lib/pricing.ts` so Milestone 4's checkout shows the identical numbers.
 *     These are display figures only — no payment code exists anywhere here.
 *   - 3.6 — makes this card **sticky** on desktop and gives mobile a bottom
 *     buy-bar. For now it just sits in the page's right-hand column.
 *   - 3.7 — points [Get Tickets] at the visual-only checkout of Milestone 4.
 *     Today the button pops a plain "Checkout coming soon" note in the card,
 *     which `docs/02-Spec.md` §C.3 explicitly allows for Phase 1. Nothing here
 *     can charge anybody: there is no form, no network call, no payment code.
 *
 * "use client" — this is the first interactive piece of the details page. The
 * page itself stays a server component; only this card (and the TicketOption
 * rows it renders) ships JavaScript to the browser.
 *
 * Why quantities are keyed by array index and not by ticket name: names are
 * free text in `lib/sample-events.ts`, so two rows could in principle share
 * one. The index is guaranteed unique for a given event.
 */

"use client";

import { useState } from "react";
import { Lock, Ticket } from "lucide-react";
import {
  formatUSD,
  priceLabel,
  type SampleEvent,
} from "@/lib/sample-events";
import { calculateOrder, SERVICE_FEE_LABEL } from "@/lib/pricing";
import { TicketOption } from "@/components/TicketOption";
import { cn } from "@/lib/utils";

/**
 * Most of any single ticket type one person can pick. Real ticketing sites cap
 * this to stop bulk-buying; 8 comfortably covers a family or a table.
 */
export const MAX_PER_TICKET_TYPE = 8;

export function TicketsCard({
  event,
  className,
}: {
  event: SampleEvent;
  className?: string;
}) {
  /**
   * The chosen quantities: `{ 0: 2, 1: 0 }` means "2 of the first ticket type".
   * `useState` is React's memory for a component — calling `setQuantities`
   * re-renders the card with the new numbers.
   */
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  /** Flipped on by the Get Tickets button until Milestone 4 exists. */
  const [showComingSoon, setShowComingSoon] = useState(false);

  const eventSoldOut = event.status === "sold_out";

  /**
   * The live order maths (Step 3.3). Every ticket type is handed to
   * `calculateOrder` along with however many are currently chosen — untouched
   * rows are quantity 0 and simply don't count. Because this runs during the
   * render, the numbers below are recomputed automatically on every − or +
   * press; there is no separate "update the total" code to forget to call.
   */
  const { ticketCount: totalTickets, subtotalUSD, feeUSD, totalUSD } =
    calculateOrder(
      event.ticketTypes.map((ticket, index) => ({
        priceUSD: ticket.priceUSD,
        quantity: quantities[index] ?? 0,
      })),
    );

  /** A $0 order (free events, or only free ticket types chosen). */
  const isFreeOrder = totalTickets > 0 && totalUSD === 0;

  function setQuantity(index: number, next: number) {
    // Clamp defensively so the state can never hold a silly number even if a
    // caller gets the maths wrong.
    const clamped = Math.max(0, Math.min(MAX_PER_TICKET_TYPE, next));
    setQuantities((current) => ({ ...current, [index]: clamped }));
    setShowComingSoon(false);
  }

  return (
    <div
      className={cn(
        "rounded-card border border-sand-200 bg-white p-6 shadow-soft",
        className,
      )}
    >
      {/* ================= Header ================= */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-500">
            Tickets
          </p>
          <p className="mt-1 font-display text-3xl font-semibold text-ink-900">
            {priceLabel(event)}
          </p>
        </div>
        <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ocean-600/10 text-ocean-700">
          <Ticket className="h-5 w-5" aria-hidden />
        </span>
      </div>

      {/* ================= The ticket rows ================= */}
      <ul className="mt-5 space-y-3">
        {event.ticketTypes.map((ticket, index) => (
          <TicketOption
            key={index}
            ticket={ticket}
            quantity={quantities[index] ?? 0}
            max={MAX_PER_TICKET_TYPE}
            // A sold-out *event* closes every row, even if the individual
            // ticket types aren't flagged.
            soldOut={eventSoldOut || ticket.soldOut === true}
            onChange={(next) => setQuantity(index, next)}
          />
        ))}
      </ul>

      {event.ticketTypes.length > 1 && !eventSoldOut && (
        <p className="mt-3 text-xs text-ink-500">
          Up to {MAX_PER_TICKET_TYPE} of each ticket type per order.
        </p>
      )}

      {/* ================= Footer ================= */}
      <div className="mt-5 border-t border-sand-200 pt-5">
        {eventSoldOut ? (
          // Honest dead end — no button that pretends tickets exist.
          <div>
            <p className="text-sm font-medium text-ink-900">
              This event is sold out.
            </p>
            <p className="mt-1 text-sm text-ink-500">
              No tickets are available for {event.title}.
            </p>
          </div>
        ) : (
          <>
            {/* ---------- Order summary (Step 3.3) ----------
                One `aria-live` region around all three numbers: a screen reader
                hears the whole updated summary once after a stepper press,
                instead of three separate interruptions. */}
            <div aria-live="polite" aria-atomic="true">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-ink-500">Selected</span>
                <span className="text-sm font-semibold tabular-nums text-ink-900">
                  {totalTickets === 0
                    ? "No tickets yet"
                    : `${totalTickets} ticket${totalTickets === 1 ? "" : "s"}`}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <SummaryRow label="Subtotal" value={formatUSD(subtotalUSD)} />
                <SummaryRow label={SERVICE_FEE_LABEL} value={formatUSD(feeUSD)} />
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-sand-200 pt-3">
                <span className="text-base font-semibold text-ink-900">
                  Total
                </span>
                <span className="font-display text-2xl font-semibold tabular-nums text-ink-900">
                  {isFreeOrder ? "Free" : formatUSD(totalUSD)}
                </span>
              </div>
            </div>

            {isFreeOrder && (
              <p className="mt-2 text-right text-xs text-ink-500">
                Free tickets — nothing to pay.
              </p>
            )}

            {totalTickets > 0 && (
              <button
                type="button"
                onClick={() => {
                  setQuantities({});
                  setShowComingSoon(false);
                }}
                className="mt-3 cursor-pointer rounded-sm text-xs font-medium text-ocean-600 underline-offset-2 transition-colors hover:text-ocean-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400"
              >
                Clear selection
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowComingSoon(true)}
              disabled={totalTickets === 0}
              className={cn(
                "mt-4 flex h-12 w-full items-center justify-center rounded-control text-base font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-2",
                totalTickets === 0
                  ? "cursor-not-allowed bg-sand-200 text-ink-500"
                  : "cursor-pointer bg-ocean-600 text-white shadow-soft hover:bg-ocean-700 hover:shadow-lift active:translate-y-px",
              )}
            >
              Get Tickets
            </button>

            {/* Screen readers get told *why* the button is off, since a disabled
                button gives no hint on its own. */}
            {totalTickets === 0 && (
              <p className="mt-2 text-center text-xs text-ink-500">
                Choose at least one ticket to continue.
              </p>
            )}

            {showComingSoon && (
              <p
                role="status"
                className="mt-3 rounded-control border border-ocean-400/40 bg-ocean-600/[0.06] px-3 py-2 text-sm leading-relaxed text-ink-900"
              >
                <span className="font-semibold">Checkout coming soon.</span>{" "}
                This is a preview site — the visual-only checkout is built in the
                next milestone, and no payment is ever taken.
              </p>
            )}

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-500">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              Secure checkout · demo only, no card charged
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * One "label ………… $value" line in the order summary.
 *
 * `tabular-nums` makes every digit the same width, so $2.25 and $12.50 line up
 * in a neat column instead of shifting as you press +.
 */
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-sm text-ink-500">{label}</span>
      <span className="text-sm font-medium tabular-nums text-ink-900">
        {value}
      </span>
    </div>
  );
}
