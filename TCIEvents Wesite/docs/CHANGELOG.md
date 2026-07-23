# Changelog

> **What this document is:** a running history of every meaningful change we make to
> the TCIEvents website, **newest first**. We update this **every time** we add,
> change, or remove something. It answers "what changed, when, and why" without
> having to read git history.
>
> **Format:** each entry has a date, a short summary, and a bulleted list of changes.
> Types we tag changes with: `Added` (new thing), `Changed` (modified existing),
> `Fixed` (bug fix), `Removed` (deleted), `Docs` (documentation only).
>
> Each entry carries a **"Verified by Joey"** line, left unchecked (`[ ]`) until Joey
> confirms he tested it — Joey flips a step to done, not the assistant.

---

## [Unreleased]

_Work in progress that hasn't been grouped into a finished milestone yet appears here._

### 2026-07-23 — Milestone 1, Step 1.4: EventCard

> The reusable "workhorse" event card used in every grid across the site
> (homepage upcoming, Discover, "more from this organizer"). Follows the spec
> (docs/02-Spec.md Part B) and wireframes: 16:9 cover, category chip, title,
> date, venue, price, hover lift + image zoom.
>
> - **Added** (`web/components/EventCard.tsx`): the `EventCard` component.
>   - 16:9 `next/image` cover with a gentle zoom-on-hover; the whole card is one
>     link to `/events/[slug]` (that details page is Milestone 3, so the link
>     404s for now — expected, same accepted pattern as the header/footer links).
>   - Frosted **category chip** (emoji + label) top-left; a **status pill**
>     top-right shown only when tickets are low ("Almost gone", `warn`) or gone
>     ("Sold out", `danger`); sold-out cards also dim + desaturate the image.
>   - Body: date · time (in fixed America/Grand_Turk zone), 2-line-clamped title,
>     venue · island, and a "from $XX" / "Free" price with a "View →" affordance.
>   - Plain server component — all motion is pure CSS, ships zero JS. Card lifts
>     on hover **and** on keyboard focus, with a visible focus ring (a11y).
> - **Added** (`web/lib/sample-events.ts`): `formatEventDate` + `formatEventTime`
>   helpers, both pinned to the `America/Grand_Turk` zone so server and browser
>   render identical strings (no hydration mismatch).
> - **Added** (`web/app/preview/cards/page.tsx`): a **temporary** preview route,
>   `/preview/cards`, rendering all 15 events so every card state is visible for
>   verification. Gets deleted once the real homepage/Discover grids exist.
>
> - **Verified by Joey:** [x] 2026-07-23 — preview at `http://localhost:3000/preview/cards`.

### 2026-07-23 — Milestone 1, Step 1.3: Footer

> The deep-ocean footer, shown on every page beneath the content. Follows the
> wireframe (docs/03-Wireframes.md §6): brand blurb, link columns, a newsletter
> box, social icons, and a legal bar — styled in the "Tropical Luxury" palette
> (`ocean-900` background, light text, gold accent on the subscribe button).
>
> - **Added** (`web/components/SiteFooter.tsx`, `"use client"`): the site footer.
>   - Brand blurb + three link columns — **Explore** (Browse events, Categories →
>     `/discover`; Host an event → `/host`), **Company** (About → `/about`;
>     Contact → `/help`), **Support** (Help → `/help`; Terms → `/terms`;
>     Privacy → `/privacy`). Some of these pages arrive in later milestones, so
>     they 404 for now — the same accepted pattern as the header.
>   - **Newsletter box** — visual only: on submit it shows an honest
>     "You're on the list! (Demo only — nothing is stored yet.)" confirmation and
>     posts nowhere (data-honesty policy; no backend in Phase 1).
>   - **Social icons** (Instagram / Facebook / WhatsApp) — hand-drawn inline SVG
>     brand marks (lucide dropped brand icons). Rendered as buttons labelled
>     "coming soon" rather than links to invented profiles (no real accounts yet).
>   - **Legal bar** — "© 2026 TCIEvents." + a "Demo site — sample events, no real
>     ticket sales yet." honesty note.
> - **Changed** (`web/app/layout.tsx`): render `<SiteFooter />` below `{children}`
>   so it appears on every page; its `mt-auto` pins it to the bottom on short pages
>   (the body is already `min-h-screen flex flex-col`).
> - **Note:** "Careers" from the rough wireframe was dropped — no careers page is
>   planned, and a phantom/dead link would break the data-honesty policy.
>
> **Verified by Joey:** [x] 2026-07-23

### 2026-07-21 — Milestone 1, Step 1.2: Header / Nav (+ logo assets)

> The sticky top navigation, shown on every page — the first on-screen UI. Design
> call by Joey: a **frosted** header (translucent white, solid on scroll) carrying
> the **full logo lockup**, rather than a fully-transparent-over-hero bar (the logo
> is colourful on a white background, so frosted reads cleaner).
>
> - **Added** (`web/public/brand/`): Joey's logo `tci-events-logo.png` (original),
>   plus a background-knockout `…-transparent.png` and a whitespace-cropped
>   `…-trimmed.png` (1032×681) generated with `sharp` — the trimmed transparent one
>   is what the header uses.
> - **Added** (`web/components/SiteHeader.tsx`, `"use client"`): sticky header —
>   frosted at top, solid white + `shadow-soft` after an 8px scroll; logo → home;
>   desktop **Browse** (`/discover`), a **Categories ▾** dropdown built from the
>   `CATEGORIES` data (each → `/discover?category=<key>`, CSS hover + keyboard
>   focus-within, no JS state), and a gold **List Your Event** button (`/host`);
>   mobile hamburger → a full-height slide-in drawer (backdrop, body-scroll lock,
>   auto-closes on route change) listing Browse, the categories, and the CTA.
> - **Changed** (`web/app/layout.tsx`): render `<SiteHeader />` above `{children}`
>   so it appears on every page.
> - Honesty note: `/discover` and `/host` 404 until their milestones — intentional.
> - `npx tsc --noEmit` passes; header + logo + `next/image` optimizer all serve 200.
> - Joey verified the logo, nav, and gold CTA on screen (2026-07-23); the frosted→solid
>   scroll cue is intentionally only obvious once the hero exists in Step 1.8.
>
> - [x] Verified by Joey (2026-07-23)

### 2026-07-21 — Adopt the numbered-step workflow

> **Ad-hoc — outside the numbered sequence.** Adopt the same working style Joey uses
> on the Travel Itinerary Planner: numbered Steps built one at a time behind a
> verify-gate, a changelog updated on every change, "verified by Joey <date>"
> checklist tags, and beginner-friendly step delivery. Only the *workflow* was
> adopted — none of that project's backend (Prisma / Neon / NextAuth) applies to
> Phase 1.
>
> - **Added** (`docs/CHANGELOG.md`): this changelog.
> - **Changed** (`CLAUDE.md`): expanded the "Working style" section with the
>   numbered-step workflow, the verify-gate, changelog discipline, beginner-friendly
>   delivery, the data-honesty policy, and ad-hoc labeling.
> - **Changed** (`docs/04-Checklist.md`): switched the tick convention to
>   "verified by Joey <date>" tags.
>
> - [x] Verified by Joey (2026-07-23) — workflow accepted and in active use.

### 2026-07-21 — Milestone 1, Step 1.1: sample event data + images

> The data foundation the whole site reads from — 15 believable Turks & Caicos
> events plus their images. No pages/UI yet; that starts at Step 1.2.
>
> - **Added** (`web/lib/sample-events.ts`): the single source of truth for the fake
>   events. Types (`SampleEvent`, `Category` ×9, `Island`, `EventStatus`,
>   `TicketType`), **15 events** spanning islands / categories / price points with
>   full state coverage (5 featured, 2 almost-sold-out, 1 sold-out, 4 free), category
>   metadata (`CATEGORIES` with emoji + label) and `ISLANDS`, plus display helpers
>   (`lowestPrice`, `priceLabel`, `formatUSD`, `STATUS_LABEL`, `getEventBySlug`,
>   `getFeaturedEvents`, `getUpcomingEvents`, `getEventsByOrganizer`).
> - **Added** (`web/public/events/`): 28 local images — 15 event covers, one 2400px
>   hero, and a 12-image tropical gallery pool (each event references its cover + 3
>   gallery shots). All 16:9, served locally (no runtime external calls).
> - **Changed** (2026-07-23, Joey's request): swapped the **Full Moon Beach Party**
>   cover — the old shot was an off-brief whitewashed clifftop village; replaced with
>   a golden-hour sunset beach matching the hero's feel.
> - **Decision** (Joey, 2026-07-23): keep the spread **Providenciales-heavy** — no
>   Salt Cay event added; invented-but-believable names kept.
> - `npx tsc --noEmit` passes clean.
>
> - [x] Verified by Joey (2026-07-23)
