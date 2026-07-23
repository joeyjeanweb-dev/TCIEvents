# TCIEvents.com — Design & Build Spec (Public Website, Phase 1)

> The detailed reference for the build. If **`01-Build-Plan.md`** is the "what &
> why," this is the "exactly how." It covers the design tokens, every page's
> contents, every reusable component, and the shape of our sample data.

---

## Part A — Design Tokens (the visual rules)

These are the exact values we'll load into Tailwind so the whole site is consistent.

### A.1 Colors

| Token name | Hex | Where it's used |
|---|---|---|
| `ocean-900` | `#0B3C5D` | Footer background, deep headings |
| `ocean-700` | `#125E80` | Header text, dark buttons |
| `ocean-600` | `#1B7FA8` | **Primary brand** — main buttons, links |
| `ocean-400` | `#3FB6D3` | Accents, hovers |
| `turquoise` | `#36C2CE` | Hero gradient, highlights |
| `sand-100` | `#F7F1E6` | Section background bands |
| `sand-200` | `#EFE6D3` | Card borders, subtle dividers |
| `gold-500` | `#C9A227` | "Featured" badges, premium accents (use sparingly) |
| `white` | `#FFFFFF` | Base surface / cards |
| `ink-900` | `#0E1726` | Primary text |
| `ink-500` | `#5B6675` | Secondary / muted text |
| `success` | `#1FA971` | "Tickets available", success states |
| `warn` | `#E8A33D` | "Almost sold out" |
| `danger` | `#D64545` | "Sold out", errors |

**Primary button** = `ocean-600` background, white text, hover `ocean-700`.
**Premium button** ("List Your Event") = gold gradient, used rarely.

### A.2 Typography

- **Headings / display:** `Fraunces` (a refined serif → luxury-resort tone)
- **Body / UI:** `Inter` (clean, highly legible)
- **Type scale (px):** 12 · 14 · 16 · 18 · 20 · 24 · 32 · 40 · 56 · 72
- **Line height:** 1.5 for body, 1.1–1.2 for headings
- **Weights:** headings 500–700; body 400–500

### A.3 Spacing, corners, shadows

- **Spacing grid:** multiples of 4px (4, 8, 12, 16, 24, 32, 48, 64, 96)
- **Corner radius:** cards `16px`, buttons/inputs `10px`, chips/pills `full`
- **Shadows:** soft and low — e.g. `0 8px 24px rgba(11,60,93,0.08)`. Never harsh.
- **Max content width:** `1200px`, centered, with `24px` side padding on mobile.

### A.4 Responsive breakpoints

| Name | Width | Layout behavior |
|---|---|---|
| Mobile | `< 640px` | Single column; hamburger menu; filters in a drawer |
| Tablet | `640–1024px` | 2-column event grids; condensed nav |
| Desktop | `> 1024px` | 3-column grids; full nav; sticky ticket sidebar |

### A.5 Motion

Subtle only: cards lift slightly on hover, images gently zoom on hover, fade-in
on scroll for sections. Nothing flashy. Respect "reduce motion" settings.

---

## Part B — Reusable Components

Small building blocks used across pages. Built on shadcn/ui, restyled to our tokens.

| Component | What it shows | Key details |
|---|---|---|
| **Header / Nav** | Logo, Browse, Categories, "List Your Event" button | Sticky; transparent over hero, solid after scroll; hamburger on mobile |
| **Footer** | Links (About, Legal, Help), social icons, newsletter box | `ocean-900` background |
| **SearchBar** | Search input + Date dropdown + Island dropdown + Go | Big and prominent on homepage; compact on Discover |
| **CategoryChip** | Icon + label (🎵 Music, ⛵ Boat, 🍴 Food…) | Horizontal scroll row; clickable filter |
| **EventCard** | Cover image, category chip, title, date, venue, "from $XX", View | The workhorse — used in every grid. Hover: lift + image zoom |
| **FeaturedEventCard** | Larger EventCard with gold "★ Featured" badge | Used in the homepage featured carousel |
| **Badge / Chip** | Category or status pill | Colors from status tokens (available/almost/sold out) |
| **TicketOption** | Ticket name, price, quantity −/+ stepper | On event page; visual only (no real payment) |
| **FilterPanel** | Category, date range, price, island, "free only" toggle | Sidebar on desktop, drawer on mobile |
| **Button** | primary / secondary / ghost / premium | From tokens above |
| **Breadcrumb** | Home / Discover / Event name | On detail pages |
| **EmptyState** | Friendly "no events match" message | For filtered-to-nothing states |

---

## Part C — Page Specs

### C.1 Homepage (`/`)

**Goal:** wow on arrival; make search and browsing obvious.

Sections top to bottom:
1. **Hero** — full-width beach/event image with soft ocean gradient overlay.
   Headline: *"Discover the best events in Turks & Caicos."* Subtext + the big
   **SearchBar** floating over it.
2. **Category row** — horizontal scroll of CategoryChips.
3. **Featured events** — heading "★ Featured", a row/carousel of FeaturedEventCards.
4. **Upcoming events** — a responsive grid (3 across desktop) of EventCards, with
   a **"See all events →"** link to Discover.
5. **Island highlight band** (optional) — short "Events across Providenciales,
   Grand Turk & beyond" strip with imagery.
6. **Organizer CTA banner** — *"Hosting an event? Reach thousands of visitors and
   locals."* with a **[List Your Event]** button → Organizer Landing.
7. **Footer.**

### C.2 Discover / Browse (`/discover`)

**Goal:** find events fast with filters.

- **Top bar:** compact SearchBar + result count ("42 events") + Sort dropdown
  (Date, Price, Popularity).
- **Left (desktop) / drawer (mobile):** **FilterPanel** — Category checkboxes,
  Date range, Price range, Island, "Free only" toggle.
- **Main:** responsive grid of **EventCards**. Filters update the grid live.
- **Empty state** when filters match nothing.
- (Map view is a *later* nice-to-have — not Phase 1.)

### C.3 Event Details (`/events/[slug]`)

**Goal:** everything about one event; drive the "Get Tickets" click.

- **Cover image** (large), category chip, optional gold ★ Featured.
- **Title**, date/time, venue + island, "by [Organizer] ✔ verified".
- **Two-column (desktop):**
  - **Left:** About (rich text), a **Google Maps embed** (static map image is
    fine for Phase 1), photo **gallery** thumbnails, "More from this organizer".
  - **Right (sticky):** **Tickets card** — list of **TicketOption**s (GA, VIP,
    Early Bird) with −/+ steppers, a live subtotal + "Fee (5%)" + total, and a
    **[Get Tickets]** button.
    - *Phase 1 behavior:* button opens a simple "Checkout coming soon" note **or**
      the visual-only checkout screens (your call — see Build Plan Q3).
- **Mobile:** single column; the Tickets card collapses into a sticky bottom bar
  ("from $50 · Get Tickets").
- **Breadcrumb** at top.

### C.4 Organizer Landing (`/host`)

**Goal:** convince event hosts to list with TCIEvents.

- **Hero:** *"Sell out your next event in Turks & Caicos."* + [Get Started] button.
- **Value props** (3–4 cards): Reach thousands · Easy setup · Secure payments ·
  Scan tickets at the door. *(These describe the future product — fine to show.)*
- **How it works** (3 steps): Create your event → Get approved → Start selling.
- **Simple pricing line:** "Just 5% per ticket. No monthly fees."
- **Social proof placeholder:** logos/quotes area (can be tasteful placeholders).
- **Final CTA** + Footer.

### C.4b Checkout flow (`/events/[slug]/checkout`) — VISUAL ONLY

> **Important:** these screens *look* like a real checkout but **charge nobody**.
> No Stripe, no card processing, no real order is created. It's a convincing demo.

A multi-step flow (a stepper across the top: ① Tickets → ② Details → ③ Payment → ④ Done):

1. **Step 1 — Your tickets:** review chosen ticket types & quantities, edit
   amounts, see subtotal + 5% fee + total. **[Continue]**.
2. **Step 2 — Your details:** buyer name / email / phone inputs, plus an
   attendee-name field per ticket. Basic validation (required fields). **[Continue]**.
3. **Step 3 — Payment:** a **realistic but fake** card form (card number, expiry,
   CVC, name) — styled to look like Stripe Elements. **No real charge.** A subtle
   "Demo only — no payment is taken" note. **[Pay $XX.XX]**.
4. **Step 4 — Confirmation:** ✅ big success screen — order number, event summary,
   a **sample QR image** per ticket, **[Download tickets]** (can be a no-op/print),
   "tickets have been emailed" copy (no real email). **[Back to events]**.

- Guest checkout only (no account needed).
- On mobile, steps stack; the running total stays visible.
- The fake card form must never post real data anywhere — purely client-side.

### C.5 Supporting pages (light placeholders)

- `/about`, `/help`, `/terms`, `/privacy` — simple, on-brand placeholder pages so
  footer links don't break. Real legal content comes much later.

---

## Part D — Sample Data Spec

All fake events live in **one file**: `web/lib/sample-events.ts`. Easy to edit.

### D.1 The shape of one event (TypeScript type)

```ts
type SampleEvent = {
  id: string;
  slug: string;               // used in the URL, e.g. "full-moon-beach-party"
  title: string;
  category: Category;         // "music" | "boat" | "food" | "nightlife" | ...
  coverImage: string;         // path in /public or a stock URL
  gallery: string[];          // 2–5 more images
  organizer: string;          // display name
  organizerVerified: boolean;
  venueName: string;
  island: "Providenciales" | "Grand Turk" | "North Caicos" | "Salt Cay";
  address: string;
  lat: number; lng: number;   // for the map
  startAt: string;            // ISO datetime
  endAt: string;
  description: string;        // a few rich paragraphs
  featured: boolean;
  ticketTypes: {
    name: string;             // "General Admission", "VIP"
    priceUSD: number;         // 0 = free
    soldOut?: boolean;
  }[];
  status: "available" | "almost_sold_out" | "sold_out";
};
```

### D.2 Categories

🎵 Music · 🎉 Nightlife · ⛵ Boat & Water · 🍴 Food & Dining · 🎪 Festival ·
🏆 Sports · 👨‍👩‍👧 Family · 🎭 Arts & Culture · 💼 Business

### D.3 Realistic sample events to create (~15)

A believable spread across islands, categories, and price points:

1. **Full Moon Beach Party** — Nightlife, Provo, Grace Bay, from $45
2. **Sunset Catamaran Cruise** — Boat & Water, Provo, from $95
3. **Island Reggae Nights** — Music, Provo, from $30
4. **Conch Festival** — Festival, Blue Hills, free / $15 VIP
5. **Fine Dining on the Beach (5-course)** — Food, Provo, $180
6. **Grand Turk Cruise Port Live Band** — Music, Grand Turk, from $25
7. **Kite Surfing Championship** — Sports, Long Bay, from $20 spectator
8. **Kids' Ocean Day Festival** — Family, Provo, free
9. **New Year's Eve Gala** — Nightlife, Grace Bay resort, from $150
10. **Local Art & Craft Market** — Arts & Culture, Provo, free
11. **Deep Sea Fishing Tournament** — Sports, Provo, from $250 (team)
12. **Wine & Jazz Evening** — Music/Food, Provo, from $65
13. **Junkanoo Street Parade** — Festival, Grand Turk, free
14. **Yoga & Wellness Retreat Day** — Family/Wellness, North Caicos, from $80
15. **Beach Bonfire & BBQ** — Food/Nightlife, Provo, from $40

Mix of `featured: true` (4–5 of them), a couple `almost_sold_out`, one `sold_out`,
and a few free events so all states are visible in the UI.

### D.4 Images

Use tasteful, license-free tropical/event stock (Unsplash/Pexels) downloaded into
`web/public/events/`, or hotlink for the prototype. Consistent aspect ratio (16:9
for covers) so cards line up cleanly.

---

## Part E — Accessibility & Performance (baseline)

- WCAG AA color contrast; visible focus rings; semantic HTML; alt text on images.
- `next/image` for optimized, lazy-loaded images.
- Every event page gets **Open Graph tags** so shared links look beautiful on
  Instagram/WhatsApp (this is the growth channel — cheap to add now).
- Keyboard-navigable nav, filters, and ticket steppers.

---

## Part F — Definition of "Done" for Phase 1

- All five pages built and linked; nav + footer everywhere.
- ~15 sample events render across home, discover, and detail pages.
- Filters on Discover work (client-side).
- Fully responsive at mobile / tablet / desktop with no broken layouts.
- Looks premium and "Turks & Caicos authentic" — passes the "would a boutique
  resort be proud to link this?" test.
