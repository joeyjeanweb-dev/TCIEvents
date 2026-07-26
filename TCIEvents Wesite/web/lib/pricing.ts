/**
 * pricing.ts — the one place the money maths lives (Milestone 3, Step 3.3).
 *
 * TCIEvents' business model is "just 5% per ticket, no monthly fees"
 * (`docs/02-Spec.md` §C.4), so an order is always:
 *
 *     subtotal  =  sum of (ticket price × how many)
 *     fee       =  5% of the subtotal
 *     total     =  subtotal + fee
 *
 * This file is deliberately separate from the Tickets card because Milestone 4's
 * checkout has to show the *exact same* three numbers. Two copies of the maths
 * would eventually drift apart and the checkout would disagree with the event
 * page — so both import from here instead.
 *
 * ⚠️ Nothing in this file charges anybody. It is arithmetic for display only:
 * no Stripe, no network call, no order record. Phase 1 is a preview site.
 *
 * ── Why the maths is done in whole cents ──────────────────────────────────
 * Computers store decimals in binary, so `0.1 + 0.2` famously comes out as
 * `0.30000000000000004`. Money is exactly where that bites. The fix used
 * everywhere in the payments world: never hold dollars in a running total —
 * convert to whole cents (4500 instead of $45.00), add up integers, and divide
 * by 100 only at the very end, when you're ready to show the number.
 */

/** TCIEvents' service fee: 5% of the subtotal. */
export const SERVICE_FEE_RATE = 0.05;

/**
 * How the fee is labelled on screen. Kept here so the event page and the
 * Milestone 4 checkout can't word it differently.
 * (`docs/03-Wireframes.md` §4 spells it "Fee (5%)".)
 */
export const SERVICE_FEE_LABEL = `Fee (${Math.round(SERVICE_FEE_RATE * 100)}%)`;

/** One chosen ticket type: its price and how many the buyer picked. */
export type OrderLine = {
  priceUSD: number;
  quantity: number;
};

/** The three numbers the Tickets card and the checkout both display. */
export type OrderTotals = {
  /** Tickets chosen across every row. */
  ticketCount: number;
  subtotalUSD: number;
  feeUSD: number;
  totalUSD: number;
};

/** Dollars → whole cents, e.g. 45 → 4500 and 2.25 → 225. */
function toCents(usd: number): number {
  return Math.round(usd * 100);
}

/**
 * Add up an order.
 *
 * Lines with a quantity of 0 (or a stray negative/fractional one) are ignored,
 * so callers can hand over every ticket type an event sells without filtering
 * first.
 */
export function calculateOrder(lines: OrderLine[]): OrderTotals {
  let ticketCount = 0;
  let subtotalCents = 0;

  for (const line of lines) {
    const quantity = Math.max(0, Math.floor(line.quantity));
    if (quantity === 0) continue;

    ticketCount += quantity;
    subtotalCents += toCents(line.priceUSD) * quantity;
  }

  // Round the fee to a whole cent — you can't charge a third of a penny.
  // $45 × 5% = 225 cents ($2.25); $30 × 5% = 150 cents ($1.50).
  const feeCents = Math.round(subtotalCents * SERVICE_FEE_RATE);

  return {
    ticketCount,
    subtotalUSD: subtotalCents / 100,
    feeUSD: feeCents / 100,
    totalUSD: (subtotalCents + feeCents) / 100,
  };
}
