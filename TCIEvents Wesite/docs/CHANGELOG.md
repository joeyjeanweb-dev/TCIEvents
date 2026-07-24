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

### 2026-07-24 — Milestone 1, Step 1.8d: Organizer CTA banner

> The homepage now ends the way the spec describes it: a dark, full-width band
> aimed at *organizers* rather than ticket buyers, with the gold
> **List Your Event** button. This completes the homepage section list.

- **Added** (`web/components/OrganizerCTA.tsx`): a new **OrganizerCTA** component
  — a full-bleed photo band (`public/events/gallery-celebrate.jpg`) under a deep
  ocean gradient wash, with a small "For organizers" pill, the headline
  *"Hosting an event?"*, a line of subtext, and the gold gradient
  **List Your Event** button.
- **Added** (same file): responsive layout — text and button side-by-side from
  `md` (768px) up, stacked and centred on phones.
- **Added** (`web/app/page.tsx`): the banner is rendered as the last section of
  the homepage, below the Upcoming Events grid.
- **Changed** (same file): updated the file's top comment — the homepage now
  covers every section in `docs/02-Spec.md` §C.1.
- **Note:** the button links to `/host`, which arrives in Milestone 5, so it
  currently 404s — expected at this stage, same as the `/discover` links.
- **Note:** no invented statistics in the copy (no "1,000+ organizers" etc.),
  per the data-honesty policy.
- **Note:** while testing, a dev server left running from an earlier session was
  serving a **stale** page — it never picked up the new component. File watching
  is unreliable on the `/mnt/c` Windows drive under WSL. Restarting `npm run dev`
  fixed it; worth remembering if an edit ever "doesn't show up".

> **Verified by Joey:** [x] 2026-07-24
>
> **This completes Milestone 1** — header, footer, EventCard, FeaturedEventCard,
> CategoryChip row, SearchBar, and the full homepage (hero → categories →
> featured → upcoming → organizer CTA) are all built and verified.
> Next up: Milestone 2, the Discover / Browse page.

---

### 2026-07-24 — Milestone 1, Step 1.8c: Upcoming events grid + "See all events →"

> The homepage now continues past the Featured carousel with a responsive grid of
> the six soonest events, followed by a link through to the Discover page.

- **Added** (`web/app/page.tsx`): an **Upcoming Events** section on the sand
  background — centred heading (calendar icon + gold rule, matching the "Explore
  by Category" treatment), a subtitle, and a grid of six **EventCard**s
  (Step 1.4's component, reused as-is).
- **Added** (same file): the grid is responsive — **1 column** on phones,
  **2** from `sm` (640px), **3** from `lg` (1024px).
- **Added** (same file): a centred **"See all events →"** outline button linking
  to `/discover`. That page arrives in Milestone 2, so the link currently 404s —
  expected at this stage, not a bug.
- **Changed** (same file): the upcoming list is `getUpcomingEvents()` (soonest
  first) with featured events filtered out, so no card appears twice on one
  screen; capped at six by the `UPCOMING_COUNT` constant.

> **Verified by Joey:** [x] 2026-07-24

### 2026-07-24 — Fix (ad-hoc — outside the numbered sequence): mobile menu drawer collapsed to a sliver

> Joey opened the hamburger menu at phone width and the drawer rendered as a
> short transparent strip: the nav links were squashed to nothing and the gold
> "List Your Event" button floated outside the panel over the page.
>
> **Cause — a CSS containing-block trap, not a markup mistake.** The drawer was a
> child of `<header>`, and the header carries `backdrop-blur-md`. An element with
> a `backdrop-filter` (like `transform` and `filter`) becomes the **containing
> block for its `position: fixed` descendants**. So the drawer's `fixed inset-0`
> measured itself against the 64px-tall header bar instead of the viewport — the
> panel's `h-full` resolved to ~64px, the scrolling nav collapsed, and the footer
> button overflowed visibly below.
>
> - **Fixed** (`web/components/SiteHeader.tsx`): the drawer + backdrop now render
>   as a **sibling** of `<header>` (component returns a fragment), outside the
>   blur's containing block, so `fixed inset-0` is viewport-relative again. A
>   comment in the file records why it must stay there.
> - **Changed** (same file): panel uses `inset-y-0` instead of `h-full`; the
>   drawer header/footer get `shrink-0` and the nav `min-h-0` so only the link
>   list scrolls; drawer `z-[60]` sits above the `z-50` header; every drawer link
>   now closes the menu on click (previously only the route-change effect did).
> - `npm run build` passes.
>
> **Verified by Joey:** [x] 2026-07-24

### 2026-07-24 — Milestone 1, Step 1.7: SearchBar component

> The search + date + island + Go control bar. Per the 2026-07-23 decision it
> targets the **top of the Discover page** (Milestone 2), not the homepage hero —
> the hero stays clean with its single gold CTA, matching the approved mockup.
>
> - **Added** (`web/components/SearchBar.tsx`): the `SearchBar` client component.
>   - A free-text search box, a **Date** dropdown of friendly presets (Any date /
>     Today / This weekend / This week / This month) instead of a calendar picker,
>     an **Island** dropdown built from `ISLANDS` in `lib/sample-events.ts`, and a
>     `Go` submit button.
>   - Two behaviours: by default submitting navigates to
>     `/discover?q=…&date=…&island=…` (defaults are left out so the URL stays
>     clean); pass an `onSubmit` prop and it hands the values back instead, which
>     is how Discover will filter its grid live in Milestone 2.
>   - `defaultValues` pre-fills the bar (for landing on Discover from a category
>     chip or a shared link). `size="compact" | "large"` switches field height.
>   - Responsive: one white divided bar from `md` up; below that it stacks —
>     search on top, the two dropdowns side by side, full-width Go button.
>   - Accessibility: native `<select>`s (real mobile pickers + keyboard/screen
>     reader support) with our own chevron drawn over them, `sr-only` labels on
>     every field, and visible focus rings.
>   - Also exports `DATE_FILTERS`, the `SearchValues` / `DateFilter` types, and
>     `buildDiscoverHref()` so Milestone 2 can reuse them.
> - **Added** (`web/app/preview/search/`): a temporary `/preview/search` route
>   showing the compact, large, pre-filled and on-sand versions, plus a small
>   demo that prints the submitted values rather than navigating. Deleted once
>   the Discover page is live.
> - `npm run build` passes (TypeScript clean, 4 static routes).
>
> **Honest-link note:** `/discover` doesn't exist until Milestone 2, so pressing
> Go 404s for now — intentional, same as the category chips.
>
> **Pre-existing, not introduced here:** `npm run lint` reports one error in
> `components/SiteHeader.tsx:42` (`setState` inside an effect, from Step 1.2).
> Left alone — flag it if you want it fixed as an ad-hoc item.
>
> **Verified by Joey:** [x] 2026-07-24

### 2026-07-24 — Fix (ad-hoc — outside the numbered sequence): featured row wouldn't scroll right on desktop

> Joey reported he couldn't move right through the Featured Events row. The row
> was a plain `overflow-x-auto` div with the `.no-scrollbar` helper — swiping
> works on a phone/touchpad, but with a normal mouse there was no scrollbar and
> no buttons, so the off-screen cards were unreachable.
>
> - **Added** (`web/components/FeaturedCarousel.tsx`): a small client component
>   that wraps the scrolling row and adds circular **prev/next arrow buttons**.
>   Each click scrolls by exactly one card width + gap, with smooth scrolling.
>   Arrows fade out when there's nothing further in that direction, are hidden
>   below `md` (swipe is the natural gesture on touch), and are real `<button>`s
>   with `aria-label`s + focus rings for keyboard/screen-reader users.
> - **Changed** (`web/app/page.tsx`): the Featured Events row now renders inside
>   `<FeaturedCarousel>`; the cards themselves are unchanged.
> - TypeScript passes; homepage renders 200 in dev.
>
> **Note (environment, not code):** the change didn't appear at first because the
> project lives on the Windows drive (`/mnt/c/...`) mounted into WSL. File-change
> events don't cross that mount, so Turbopack never recompiled — the dev server
> was serving the pre-edit page. Restarting the dev server picked it up. Expect
> to restart after edits until/unless the repo is moved into the WSL filesystem.
>
> **Verified by Joey:** [x] 2026-07-24

### 2026-07-23 — Milestone 1, Step 1.8b: Homepage featured events row

> Added the next slice of the homepage below the category section, matching the
> mockup (the featured cards you scroll down to see).
>
> - **Changed** (`web/app/page.tsx`): added a **"Featured Events"** section — a
>   heading with a **"View all events →"** link (→ `/discover`) and a horizontal,
>   snap-scrolling row of the 5 `featured: true` events rendered with the existing
>   (Step 1.5) `FeaturedEventCard`. Each card is a fixed width so several peek in
>   and the row scrolls sideways (uses the `.no-scrollbar` helper). No new card
>   code — reuses the verified component.
> - Note: the mockup shows a little heart/save icon on these cards; saving needs
>   accounts (out of Phase-1 scope), so it's intentionally left off rather than
>   faked. Cards still link to `/events/[slug]` (404 until Milestone 3, expected).
> - Production build + TypeScript pass.
>
> **Verified by Joey:** [x] 2026-07-23

### 2026-07-23 — Milestone 1, Step 1.8a: Homepage hero + category section

> First slice of the homepage assembly (Step 1.8 split into sub-steps), matching
> the approved mockup. Built ahead of Step 1.7 by Joey's request ("what about the
> hero?"); 1.7's SearchBar now belongs to the Discover page, so the order doesn't
> conflict.
>
> - **Added** (`web/components/Hero.tsx`): reusable `Hero` component — full-bleed
>   `next/image` background (`priority`), a left-weighted light scrim for headline
>   legibility, and a headline + subtext + single gold CTA button. Pulls up under
>   the sticky frosted header (negative top margin) so the photo shows through the
>   bar, per the mockup. Reusable so the `/host` landing (Milestone 5) can share it.
> - **Changed** (`web/app/page.tsx`): replaced the Milestone 0 setup-check
>   placeholder with the real homepage top — the `Hero` (headline "Discover
>   Events. / Experience Paradise.", **"Browse Events"** button → `/discover`, over
>   `public/events/hero-beach.jpg`) followed by an **"Explore by Category"** section
>   (palm accent + gold underline + subtitle) that reuses the Step 1.6
>   `CategoryChipRow` with "All Events" active.
> - Remaining homepage sections (Featured row, Upcoming grid + "See all events",
>   organizer CTA banner) come in later sub-steps (1.8b+). Production build +
>   TypeScript pass.
>
> **Verified by Joey:** [x] 2026-07-23

### 2026-07-23 — Design direction: homepage target mockup + chip restyle

> Joey approved a concrete homepage mockup and asked the site to match it (and to
> reuse a similar hero on the `/host` landing page later).
>
> - **Added** (`docs/design/homepage-target-mockup.png`): the approved homepage
>   mockup, now the checked-in visual target for Step 1.8. Decisions locked from
>   it: hero uses a gold **"Browse Events"** button (no search bar in the hero —
>   the **SearchBar** in Step 1.7 will live on the **Discover** page instead); the
>   category section is titled **"Explore by Category"** with a palm accent.
> - **Changed** (`web/components/CategoryChip.tsx`): restyled the chips to match
>   the mockup — swapped the emoji for coloured `lucide-react` line-icons (one
>   accent colour per category) and changed the active/selected state from a solid
>   ocean fill to an **ocean outline** (white fill + ocean border/ring). The plain
>   emoji on `CATEGORIES` are untouched and still used by EventCard /
>   FeaturedEventCard. Label "All events" → **"All Events"** to match the mockup.
>   Production build + TypeScript pass; all icon colours confirmed in the compiled
>   CSS.
>
> **Verified by Joey:** [x] 2026-07-23

### 2026-07-23 — Milestone 1, Step 1.6: CategoryChip row

> The "browse by category" pill row that sits under the homepage hero
> (docs/02-Spec.md Part B + C.1 §2). Horizontal-scroll on phones, wraps + centers
> on wider screens.
>
> - **Added** (`web/components/CategoryChip.tsx`): two exports.
>   - `CategoryChip` — one rounded pill (emoji + label) that links somewhere; has
>     an `active` prop that styles it as the selected filter (ocean fill) for
>     later use on Discover. Pure-CSS hover lift + colour shift, visible focus
>     ring (a11y).
>   - `CategoryChipRow` — the full row: a leading **"All events"** chip then one
>     chip per entry in `CATEGORIES`, each linking to
>     `/discover?category=<key>`. On small screens it scrolls sideways using the
>     existing `.no-scrollbar` helper; from `sm` up it wraps and centers.
>   - Honest links: the Discover page is Milestone 2, so these 404 for now —
>     intentional, same pattern as EventCard linking to unbuilt `/events/[slug]`.
>   - Plain server component — no `"use client"`, ships zero JS.
> - **Changed** (`web/app/preview/cards/page.tsx`): added a top **Step 1.6**
>   section showing the row plus a second copy with `activeCategory="music"` so
>   the selected state is visible. Demoted the old Step 1.5 heading from `<h1>` to
>   `<h2>` so the page keeps a single `<h1>`.
>
> **Verified by Joey:** [x] 2026-07-23

### 2026-07-23 — Milestone 1, Step 1.5: FeaturedEventCard

> The larger, premium "hero" card for hand-picked events, used in the homepage
> **★ Featured** row (docs/02-Spec.md Part B + C.1 §3). Same DNA as EventCard but
> deliberately bigger and richer so featured events stand out.
>
> - **Added** (`web/components/FeaturedEventCard.tsx`): the `FeaturedEventCard`
>   component.
>   - Taller **4:3** `next/image` cover (vs. the workhorse card's 16:9) with the
>     same gentle zoom-on-hover; whole card is one link to `/events/[slug]` (that
>     details page is Milestone 3, so the link 404s for now — expected).
>   - Gold **"★ Featured" badge** (top-left) — our one sparing use of the gold
>     accent, with dark ink text on gold for accessible contrast. Frosted
>     **category chip** moved to the bottom-left; **status pill** (Almost gone /
>     Sold out) top-right; sold-out cards dim + desaturate the image.
>   - Body carries extras the compact card doesn't: a 2-line **description
>     snippet** and the **organizer** name (with a verified check when
>     applicable), plus date · time, venue · island, and price.
>   - Soft **gold ring/border** so it reads as "special" even before the badge.
>   - Plain server component — all motion is pure CSS, ships zero JS. Lifts on
>     hover **and** keyboard focus, with a visible focus ring (a11y).
> - **Changed** (`web/app/preview/cards/page.tsx`): added a top **Step 1.5**
>   section rendering the `featured: true` events with `FeaturedEventCard`, above
>   the existing EventCard grid, so both cards can be compared side by side. Still
>   a temporary route — it goes away once the homepage grid (Step 1.8) is built.
>
> **Verified by Joey:** [x] _(verified 2026-07-23)_

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
