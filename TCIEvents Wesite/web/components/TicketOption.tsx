/**
 * TicketOption — one row inside the Tickets card (Milestone 3, Step 3.2).
 *
 * `docs/02-Spec.md` §C.3 lists **TicketOption** as its own component: a ticket
 * type ("General Admission", "VIP Cabana") with its price and a **−/+ stepper**
 * for choosing how many you want.
 *
 * It is deliberately "dumb" (a *controlled* component): it does not remember
 * the quantity itself. The parent (`TicketsCard`) owns the numbers and passes
 * `quantity` down plus an `onChange` callback up. That's the standard React
 * pattern — one owner of the truth — and it's what lets the card add up a
 * subtotal across every row in Step 3.3.
 *
 * No "use client" here. This file has no state and no browser APIs of its own;
 * it only *renders* the props it is handed, and the `onChange` it calls belongs
 * to TicketsCard, which is the client component. (Being imported by a client
 * component is what puts this in the browser bundle.)
 *
 * Accessibility notes:
 *   - the stepper is wrapped in a `role="group"` labelled with the ticket name,
 *     so a screen reader announces "General Admission quantity, group",
 *   - each button has a full sentence label ("Add one General Admission
 *     ticket") instead of just "+", which on its own means nothing out loud,
 *   - the number is `aria-live="polite"`, so changing it is read out without
 *     the user having to go hunting for it,
 *   - the − button is disabled at 0 and the + button at `max`, rather than the
 *     buttons silently doing nothing.
 */

import { Minus, Plus } from "lucide-react";
import { formatUSD, type TicketType } from "@/lib/sample-events";
import { cn } from "@/lib/utils";

export function TicketOption({
  ticket,
  quantity,
  max,
  soldOut = false,
  onChange,
}: {
  ticket: TicketType;
  /** How many of this ticket are currently chosen. Owned by the parent. */
  quantity: number;
  /** Most you can pick of this one type (the card passes 8). */
  max: number;
  /**
   * Force the row into its sold-out look. The card passes `true` when either
   * this ticket type or the whole event is sold out.
   */
  soldOut?: boolean;
  /** Called with the NEW quantity whenever − or + is pressed. */
  onChange: (nextQuantity: number) => void;
}) {
  const isFree = ticket.priceUSD === 0;
  const chosen = quantity > 0;

  return (
    <li
      className={cn(
        "rounded-control border p-4 transition-colors",
        soldOut
          ? "border-sand-200 bg-sand-100/50"
          : chosen
            ? // A chosen row gets a faint ocean wash + ring so you can see at a
              // glance which tickets are in your order.
              "border-ocean-400 bg-ocean-600/[0.04] ring-1 ring-ocean-400/40"
            : "border-sand-200 bg-white hover:border-ocean-400/60",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {/* ---- Name + price ---- */}
        <div className="min-w-0">
          <p
            className={cn(
              "font-medium leading-snug",
              soldOut ? "text-ink-500" : "text-ink-900",
            )}
          >
            {ticket.name}
          </p>

          {soldOut ? (
            <p className="mt-1 text-sm font-medium text-danger">Sold out</p>
          ) : (
            <p className="mt-1 text-sm text-ink-500">
              <span
                className={cn(
                  "font-semibold",
                  isFree ? "text-success" : "text-ink-900",
                )}
              >
                {isFree ? "Free" : formatUSD(ticket.priceUSD)}
              </span>
              {!isFree && " each"}
            </p>
          )}
        </div>

        {/* ---- The −/+ stepper ---- */}
        {soldOut ? (
          // Nothing to press on a sold-out row — a dash keeps the row's height
          // and the column alignment without pretending to be a control.
          <span className="pt-1 text-ink-500" aria-hidden>
            —
          </span>
        ) : (
          <div
            role="group"
            aria-label={`${ticket.name} quantity`}
            className="flex shrink-0 items-center gap-1 rounded-full border border-sand-200 bg-white p-1"
          >
            <StepperButton
              label={`Remove one ${ticket.name} ticket`}
              disabled={quantity === 0}
              onClick={() => onChange(quantity - 1)}
            >
              <Minus className="h-4 w-4" aria-hidden />
            </StepperButton>

            {/* `tabular-nums` keeps 1 and 8 the same width so the buttons don't
                shuffle sideways as the number changes. */}
            <span
              aria-live="polite"
              aria-atomic="true"
              className="w-7 text-center text-base font-semibold tabular-nums text-ink-900"
            >
              <span className="sr-only">{ticket.name} quantity: </span>
              {quantity}
            </span>

            <StepperButton
              label={`Add one ${ticket.name} ticket`}
              disabled={quantity >= max}
              onClick={() => onChange(quantity + 1)}
            >
              <Plus className="h-4 w-4" aria-hidden />
            </StepperButton>
          </div>
        )}
      </div>
    </li>
  );
}

/**
 * The round − / + button. Split out only so the two of them can't drift apart
 * visually; `type="button"` matters because a bare <button> inside a form would
 * try to submit it.
 */
function StepperButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400",
        disabled
          ? "cursor-not-allowed text-ink-500/35"
          : "cursor-pointer bg-sand-100 text-ocean-700 hover:bg-ocean-600 hover:text-white active:scale-[0.96]",
      )}
    >
      {children}
    </button>
  );
}
