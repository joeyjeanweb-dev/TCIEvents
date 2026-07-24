# TCIEvents.com — Build Checklist (Public Website, Phase 1)

> The simple tick-box to-do list. We'll work top to bottom. Check items off as we
> go. Each **Milestone** ends with something you can look at and give feedback on.
>
> `[ ]` = to do · `[x]` = done. A step is only `[x]` once **Joey has verified it** —
> tag it `_(verified by Joey <date>)_`. Built-but-not-yet-verified stays `[ ]` with a
> `_(built — awaiting verify)_` note. Every change is also logged in `CHANGELOG.md`.

---

## Milestone 0 — Project setup ✅ DONE

- [x] Create the `web/` Next.js app (Next 16, TypeScript, App Router, Tailwind v4)
- [x] Add fonts: **Fraunces** (headings) + **Inter** (body)
- [x] Add color tokens to Tailwind (ocean, sand, gold, ink — see `02-Spec.md`)
- [x] Install **lucide-react** icons + `cn()` class helper *(building custom
      Tailwind components instead of shadcn for tighter control of the premium look)*
- [x] Set up base layout, page container width, and global styles
- [x] Confirm the site runs locally (`npm run dev` → verified HTTP 200)

**✅ You'll see:** a styled setup-check page confirming fonts + colors work.

---

## Milestone 1 — Navigation, Footer & Homepage

- [x] 1.1 **Sample events data file** (`lib/sample-events.ts`, ~15 events) + event **images** in `public/events/`  _(verified by Joey 2026-07-23)_
- [x] 1.2 Build **Header / Nav** (sticky, frosted-over-hero → solid on scroll, mobile hamburger)  _(verified by Joey 2026-07-23)_
  - [x] Fix — **ad-hoc, outside the numbered sequence**: the mobile drawer
    collapsed to a sliver because the header's `backdrop-blur` was acting as the
    containing block for its `fixed` child; drawer moved outside `<header>`
    _(verified by Joey 2026-07-24)_
- [x] 1.3 Build **Footer** (links + newsletter box + social)  _(verified by Joey 2026-07-23)_
- [x] 1.4 Build reusable **EventCard** component  _(verified by Joey 2026-07-23)_
- [x] 1.5 Build **FeaturedEventCard** (with gold ★ badge)  _(verified by Joey 2026-07-23)_
- [x] 1.6 Build **CategoryChip** row (horizontal scroll)  _(verified by Joey 2026-07-23)_
- [x] 1.7 Build **SearchBar** (search + date + island + Go) — _now targets the **Discover** page top, not the hero (decided 2026-07-23)_  _(verified by Joey 2026-07-24)_
- [ ] 1.8 Assemble **Homepage** (hero → categories → featured → upcoming → organizer CTA) + wire "See all events" → Discover, "List Your Event" → Host
  - [x] 1.8a **Hero** + **Explore by Category** section _(verified by Joey 2026-07-23)_ — built ahead of 1.7 by Joey's request
  - [x] 1.8b Featured events row _(verified by Joey 2026-07-23)_
    - [x] Fix — **ad-hoc, outside the numbered sequence**: added prev/next arrow
      buttons (`components/FeaturedCarousel.tsx`) so the row can be scrolled with a
      mouse; it previously relied on swipe only _(verified by Joey 2026-07-24)_
  - [ ] 1.8c Upcoming grid + "See all events →" link
  - [ ] 1.8d Organizer CTA banner

**✅ You'll see:** the full homepage with real-looking events.

---

## Milestone 2 — Discover / Browse page

- [ ] Build the **Discover page** layout (search bar + count + sort)
- [ ] Build **FilterPanel** (category, date, price, island, free-only)
- [ ] Make filters work **live** (client-side filtering of sample events)
- [ ] Add **Sort** (date / price / popularity)
- [ ] Add **EmptyState** ("no events match your filters")
- [ ] Make filters a **drawer** on mobile

**✅ You'll see:** a working browse grid you can filter and sort.

---

## Milestone 3 — Event Details page

- [ ] Build the **Event Details** layout (cover, title, meta, breadcrumb)
- [ ] Build the **Tickets card** with **TicketOption** −/+ steppers
- [ ] Live **subtotal + 5% fee + total** calculation (visual only, no charge)
- [ ] Add **map** (static/embedded) and **photo gallery**
- [ ] Add **"More from this organizer"** row
- [ ] Make ticket card **sticky** on desktop; **bottom buy-bar** on mobile
- [ ] **[Get Tickets]** → goes to the checkout flow (Milestone 4)
- [ ] Add **Open Graph tags** so shared links look great
- [ ] Link every EventCard → its details page (`/events/[slug]`)

**✅ You'll see:** click any event card → a full, beautiful event page.

---

## Milestone 4 — Checkout flow (VISUAL ONLY — charges nobody)

- [ ] Build the **stepper** (① Tickets → ② Details → ③ Payment → ④ Done)
- [ ] **Step 1 — Tickets:** review/edit quantities, subtotal + 5% fee + total
- [ ] **Step 2 — Details:** buyer + per-ticket attendee-name inputs, validation
- [ ] **Step 3 — Payment:** realistic **fake** card form (Stripe-like), "demo only" note
- [ ] **Step 4 — Confirmation:** success screen, order #, sample QR, download button
- [ ] Keep the **order summary** visible throughout; responsive on mobile
- [ ] Ensure the fake form **posts nowhere** — purely client-side

**✅ You'll see:** a convincing end-to-end "buy a ticket" demo that takes no money.

---

## Milestone 5 — Organizer Landing page

- [ ] Build **Host page** hero + [Get Started]
- [ ] Build **value-prop cards** (reach / easy / secure / scan)
- [ ] Build **"How it works"** 3-step section
- [ ] Add **pricing line** + **social-proof** placeholder + final CTA

**✅ You'll see:** the "host an event" pitch page.

---

## Milestone 6 — Supporting pages & polish

- [ ] Add placeholder pages: **/about, /help, /terms, /privacy** (on-brand stubs)
- [ ] Full **responsive pass**: phone / tablet / desktop, fix any broken layouts
- [ ] **Accessibility pass**: alt text, focus states, contrast, keyboard nav
- [ ] **Motion pass**: subtle hover lifts, image zoom, scroll fade-ins
- [ ] **Image optimization** with `next/image`
- [ ] Final review against the "Definition of Done" in `02-Spec.md`

**✅ You'll see:** a polished, responsive, launch-quality prototype.

---

## Decisions (confirmed)

- [x] **Logo:** you will provide a logo file → text wordmark placeholder until then
- [x] **"Get Tickets":** build the **visual-only checkout flow** (Milestone 4)
- [x] **Kickoff:** milestone by milestone, review after each
- [x] Islands to feature — **Providenciales-heavy** (Provo ×12, Grand Turk ×2, North Caicos ×1, **no Salt Cay**), confirmed by Joey 2026-07-23
- [x] Real event names/organizers — **all invented but believable**, confirmed by Joey 2026-07-23

---

## Out of scope (Phase 1) — do NOT build yet

- [ ] ~~Real payments / Stripe / charging cards~~
- [ ] ~~Refunds & organizer payouts~~
- [ ] ~~Accounts / login / sign-up~~
- [ ] ~~Organizer & admin dashboards~~
- [ ] ~~QR tickets & door-scanning app~~
- [ ] ~~Database, emails, SMS~~
- [ ] ~~Real legal content~~

*(These come in later phases — see the master architecture plan.)*
