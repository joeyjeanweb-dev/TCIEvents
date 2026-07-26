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

### 2026-07-26 — Milestone 3, Step 3.3: live subtotal + 5% fee + total

> The Tickets card now does the maths. Press **+** and the footer instantly shows
> **Subtotal**, **Fee (5%)** and a big **Total** — e.g. one $45 General Admission
> reads $45 / $2.25 / **$47.25**, exactly the numbers sketched in
> `docs/03-Wireframes.md` §4. The "coming in the next build step" placeholder is
> gone. These are display figures only: there is still no payment code, no form
> and no network call anywhere on the site.

- **Added** (`web/lib/pricing.ts`): a small module holding the order arithmetic —
  `SERVICE_FEE_RATE` (0.05), `SERVICE_FEE_LABEL` ("Fee (5%)") and
  `calculateOrder(lines)`, which returns `{ ticketCount, subtotalUSD, feeUSD,
  totalUSD }`.
  - It's its own file because **Milestone 4's checkout has to show the identical
    three numbers**; one shared function can't drift out of sync the way two
    copies of the same formula would.
  - **Adds up in whole cents**, not dollars, then divides by 100 at the end —
    the standard way to dodge binary floating-point errors like
    `0.1 + 0.2 = 0.30000000000000004`. The 5% fee is rounded to a whole cent.
  - Rows with quantity 0 (or a stray negative/fractional one) are ignored, so
    callers can pass every ticket type an event sells without filtering first.
- **Changed** (`web/components/TicketsCard.tsx`): the footer placeholder is
  replaced by the live summary — **Selected — N tickets**, **Subtotal**,
  **Fee (5%)**, a rule, then **Total** in the large Fraunces display face.
  - The numbers are derived during render from the stepper quantities, so they
    can never fall out of step with the rows above them.
  - **Free orders** (free-entry events, or picking only $0 ticket types) show
    **Total: Free** plus "Free tickets — nothing to pay" rather than "$0".
  - **Accessibility**: the three figures sit inside a single `aria-live` region,
    so a screen reader announces the whole updated summary once per press
    instead of interrupting three times.
  - **Alignment**: `tabular-nums` on every figure keeps the digits in a straight
    column instead of jittering as the amounts change.
- **Data-honesty**: unchanged from 3.2 — **Get Tickets** still pops the
  "Checkout coming soon … no payment is ever taken" note, and the
  "Secure checkout · demo only, no card charged" footnote still sits under it.
  The 5% fee shown is TCIEvents' real published rate (`docs/02-Spec.md` §C.4),
  not an invented number.
- **Note — still to come in this milestone**: map + gallery (3.4), "More from
  this organizer" (3.5), sticky card / mobile buy-bar (3.6), the real checkout
  link (3.7), Open Graph tags (3.8).
- **Pre-existing lint error, untouched**: `npm run lint` still reports the one
  error in `components/SiteHeader.tsx:42` described under Step 3.2.
  `npm run build` passes (all 15 event pages pre-rendered).
- **Verified by Joey:** [x] 2026-07-26

---

### 2026-07-26 — Milestone 3, Step 3.2: the Tickets card + −/+ ticket steppers

> The placeholder in the event page's right-hand column is now a real **Tickets**
> card. Every ticket type an event sells gets its own row — name, price, and a
> round **− 0 +** stepper — and the rows you've picked from light up in ocean
> blue. The **[Get Tickets]** button stays switched off until you've chosen at
> least one ticket. The money maths (subtotal, 5% fee, total) is the *next* step,
> so the footer says so plainly rather than showing a made-up number.

- **Added** (`web/components/TicketOption.tsx`): one ticket row, listed as its
  own component in `docs/02-Spec.md` §C.3. Shows the ticket name, "**$45** each"
  (or a green **Free** for $0 tickets), and the −/+ stepper.
  - It's a **controlled** component — it holds no quantity of its own, it's
    handed `quantity` and calls `onChange` with the new number. The card above it
    owns the truth, which is what lets Step 3.3 add up a subtotal across rows.
  - **Sold-out rows** (e.g. *Fine Dining on the Beach*) render greyed with a red
    "Sold out" label and no stepper at all — nothing to press that does nothing.
  - **Accessibility**: the stepper is a labelled `role="group"`, each button has
    a full spoken label ("Add one General Admission ticket") instead of "+", the
    number is `aria-live` so changes are read out, and − is disabled at 0 / + at
    the maximum instead of failing silently.
- **Added** (`web/components/TicketsCard.tsx`): the card itself — the first
  interactive piece of the details page (`"use client"`; the page around it stays
  a server component). Header with the honest "from $X" price, the list of
  `TicketOption` rows, a **Clear selection** link once something's picked, a
  live "**Selected** — 3 tickets" line, the **Get Tickets** button and a
  "Secure checkout · demo only, no card charged" footnote.
  - **Cap of 8 per ticket type** (`MAX_PER_TICKET_TYPE`), the way real ticketing
    sites limit bulk-buying; the note appears under multi-type events.
  - **Sold-out events** show no button at all — just "This event is sold out."
  - **Data-honesty**: pressing **Get Tickets** pops a plain "**Checkout coming
    soon** — this is a preview site … no payment is ever taken" note inside the
    card, which is exactly the Phase 1 behaviour `docs/02-Spec.md` §C.3 allows.
    There is no form, no network call and no payment code anywhere in this step.
- **Changed** (`web/app/events/[slug]/page.tsx`): the right-hand column now
  renders `<TicketsCard event={event} />` in place of the Step 3.1 placeholder.
- **Note — still to come in this milestone** (each its own checklist item): the
  live subtotal + 5% fee + total (3.3), map + gallery (3.4), "More from this
  organizer" (3.5), desktop **sticky** card / mobile bottom buy-bar (3.6), the
  real checkout link (3.7) and Open Graph tags (3.8).
- **Pre-existing lint error, untouched**: `npm run lint` reports one error in
  `components/SiteHeader.tsx:42` (React's new "don't call setState inside an
  effect" rule, about closing the mobile drawer on route change). It predates
  this step and `npm run build` passes; worth cleaning up in the Milestone 6
  polish pass.
- **Verified by Joey:** [x] 2026-07-26

---

### 2026-07-25 — Milestone 3, Step 3.1: the Event Details page exists (cover, title, meta, breadcrumb)

> Every event card on the site has been linking to `/events/[slug]` since
> Milestone 1, and every one of those links 404'd. They work now. Click any card
> and you land on a full-bleed cover photo with the event's name over it, a
> breadcrumb back to Discover, the About text, and a "When & where" panel.
> The ticket steppers and totals are **not** here yet — that's Step 3.2 — so the
> right-hand column holds a plainly-labelled placeholder instead of fake
> controls.

- **Added** (`web/app/events/[slug]/page.tsx`): the Event Details page.
  - **Breadcrumb** — Home / Discover / *event name*, laid over the top of the
    cover photo (`docs/03-Wireframes.md` §4).
  - **Cover section** — the event's photo running edge-to-edge behind the sticky
    header, darkened with the same ocean scrim `PageHero` uses, with the
    category chip, the gold ★ **Featured** badge (only on featured events), the
    title, a date · time · venue line and "by [Organizer] ✔ verified".
  - **Left column** — a ticket-status pill ("Tickets available" / "Almost sold
    out" / "Sold out"), **About this event** (the description's paragraphs), and
    a **When & where** panel with the long date, the start–end time, the venue +
    street address and the organizer.
  - **Right column** — the slot the sticky Tickets card will occupy, currently
    showing the honest "from $X" price, the number of ticket types, and a note
    that ticket selection arrives in the next step.
- **Added** (`web/lib/sample-events.ts`): two date helpers for this page —
  `formatEventDateLong()` ("Saturday, August 29, 2026") and
  `formatEventTimeRange()` ("8:00 PM – 1:00 AM"). The range appends the end date
  when an event runs past midnight, so the Full Moon Beach Party reads
  "8:00 PM – 1:00 AM (Sun, Aug 30)" instead of looking like it ends before it
  starts. Both format in `America/Grand_Turk`, like the existing helpers.
- **Added**: `generateStaticParams()` — all 15 event pages are now pre-rendered
  at build time (confirmed in the build output) rather than built on first
  visit, and an unknown slug like `/events/nope` renders the normal 404 page.
- **Added**: a per-event browser-tab title and description via
  `generateMetadata()`. Full Open Graph / social-share tags are still a separate
  checklist item later in this milestone.
- **Note — not built yet in this step** (each is its own checklist item): ticket
  steppers + live totals, the map, the photo gallery, "More from this
  organizer", the desktop sticky card / mobile bottom buy-bar, and OG tags.
- **Gotcha worth remembering** (cost us a few minutes here): a `npm run dev`
  server that was already running kept returning **404** for the brand-new
  `/events/...` route. Next.js normally notices new files, but this project
  lives on the Windows `/mnt/c` drive and WSL's file watcher misses
  *newly created* files there. **Fix: restart the dev server** whenever a new
  page/file 404s. (Editing an existing file hot-reloads fine.) Also note the
  second server refuses to start and tells you the port + PID of the first one —
  `Run kill <PID> to stop it`.
- **Verified by Joey:** [x] 2026-07-25

---

### 2026-07-25 — Milestone 2, Step 2.6: filters become a slide-up drawer on mobile

> On phones the filter panel no longer pushes the results down the page. The
> **Filters** button now sits beside **Sort** exactly as the wireframe draws it,
> and opens a sheet that slides up over the grid — tick as many boxes as you
> like, watch the live count on **"Show 12 events"**, then close it.

- **Added** (`web/components/FilterDrawer.tsx`): a reusable **bottom-sheet**
  component — dimmed backdrop, grab handle, header with a close ✕, scrolling
  body and a sticky action row. It knows nothing about events or filters
  (everything inside comes from `children`), so Milestone 3 can reuse it.
  Behaviour it handles for you: slide in *and* out, **Escape** closes, tapping
  the backdrop closes, the page behind can't scroll while it's open, keyboard
  focus moves into the sheet and returns to the Filters button afterwards, and
  Tab cycles inside the sheet instead of wandering off behind it.
- **Added** (`web/lib/filter-events.ts`): `activeFilterCount()` — the small
  ocean-blue number on the Filters button ("Filters ②"). It counts what's
  actually *inside* the drawer, so the search box (which lives in the bar above,
  not in the drawer) is deliberately not counted.
- **Changed** (`web/components/DiscoverBrowser.tsx`): the **Filters** button
  moved out of the results area and into the results bar next to **Sort**,
  matching `docs/03-Wireframes.md` §3 ("`[ ⚙ Filters ]  Sort ▾`"). Below `sm`
  the two share their own full-width row under the event count.
- **Changed** (`web/components/DiscoverBrowser.tsx`): while the drawer is open,
  filter changes update the grid but **not** the address bar; the URL is brought
  up to date once, when the drawer closes. Rewriting the URL re-runs the server
  page and remounts the browser component, which would otherwise slam the drawer
  shut on every tick.
- **Changed** (`web/components/FilterPanel.tsx`): gained two props so the same
  panel can serve both places — `variant="plain"` (drops the white card and its
  own heading, since the drawer supplies both) and `idPrefix` (the sidebar and
  the drawer copy are both in the page at once, and two radio groups sharing a
  `name` would fight each other).
- **Changed** (`web/app/discover/page.tsx`): the "float the search card onto the
  photo banner" wrapper (`relative z-10 -mt-14`) moved from around the whole
  browser to around the search bar alone. A `z-index` on a wrapper traps
  everything inside it in one layer, which would have pinned the drawer
  underneath the sticky site header.
- **Removed** (`web/components/DiscoverBrowser.tsx`): the old mobile
  "Filters / Hide filters" expander that pushed the results down the page.
- **Accessibility:** the sheet is a real `role="dialog"` with `aria-modal`, is
  switched off with `inert` while closed (so you can't Tab into an invisible
  panel), and the badge's count is also spoken as "3 filters applied". The
  `prefers-reduced-motion` rule already in `globals.css` removes the slide for
  anyone who's asked for less animation.
- **Verified by Joey:** [x] 2026-07-25 — **completes Milestone 2.**

---

### 2026-07-25 — Milestone 2, Step 2.5: designed EmptyState with "loosen one filter" suggestions

> The bare "no events match your search" placeholder from Step 2.1 becomes the
> real **EmptyState** component from the spec — and instead of only offering
> "clear everything", it now tells you which *single* filter to loosen and how
> many events that would bring back.

- **Added** (`web/components/EmptyState.tsx`): the **EmptyState** component
  listed in `docs/02-Spec.md` Part B ("friendly 'no events match' message").
  Built as a general-purpose panel — icon + heading + description + whatever
  buttons the caller passes as children — because Milestone 3+ needs the same
  panel elsewhere (an organizer with no events yet, a quiet category month).
  Only the wording will change; the look stays consistent. It has no state and
  no `"use client"`, so it also works inside server components.
- **Added** (`web/lib/filter-events.ts`): `relaxationSuggestions()` — the brains
  behind the new empty state. It tries switching **one** active filter off at a
  time, really re-runs the filter for each, and keeps only the ones that would
  actually show something. Best-first, so the suggestion that brings back the
  most events is listed first. Because a suggestion is only offered when it
  genuinely leads somewhere, pressing one can never drop you onto another empty
  grid.
- **Changed** (`web/components/DiscoverBrowser.tsx`): the empty grid now renders
  the EmptyState in one of three shapes, depending on *why* it's empty:
  1. **filters on, something can be loosened** — e.g. searching "jazz" on Grand
     Turk offers `Drop "jazz" (2)` and `All islands (1)` as one-tap buttons,
     plus **Clear all filters**;
  2. **filters on, nothing helps** — no buttons but "Clear all filters", with
     copy that says so plainly rather than implying a fix exists;
  3. **no filters at all** — "No events listed yet". Impossible with today's
     sample data, but it's the state a real database hits on a quiet week, so it
     says something honest instead of blaming filters that aren't set.
- **Changed** (`web/components/DiscoverBrowser.tsx`): the heading now quotes what
  you typed — *No events match "jazz"* — instead of the generic line, so it's
  obvious the search box is what's narrowing things.
- **Honest-data note** (CLAUDE.md §5): every number on those suggestion buttons
  is measured by re-running the real filter over the real sample data — none of
  them are estimates, and the suggestions list is empty rather than padded when
  nothing would help.
- **Accessibility:** each suggestion button carries an `aria-label` spelling out
  the bare count ("All islands — 1 event"), since a floating "1" beside a label
  means nothing read aloud. The heading is an `<h2>`, one level under the
  Discover hero's `<h1>`.
- **Verified by Joey:** [x] 2026-07-25

---

### 2026-07-25 — Milestone 2, Step 2.4: Sort dropdown (date / price / popularity)

> The results bar gains the **Sort ▾** control from the wireframe. The grid can
> now be re-ordered by date, by price, or by how popular an event is — and the
> choice rides along in the URL like the filters do.

- **Added** (`web/components/SortSelect.tsx`): the **Sort dropdown**, sitting at
  the right-hand end of the results bar opposite the event count, exactly as
  `docs/03-Wireframes.md` §3 draws it ("42 events … Sort: Date ▾"). It's a
  native `<select>` with our own chevron drawn over it — same approach as the
  SearchBar's dropdowns, so phones get their proper wheel picker and keyboard /
  screen-reader users get it working for free. The visible "Sort" text is a real
  `<label>`, so clicking the word opens the menu.
- **Added** (`web/lib/filter-events.ts`): `SORT_OPTIONS`, `sortEvents()` and
  `parseSortOption()`. Three orders, with the direction spelled out in the label
  so you're never guessing:
  - **Date — soonest first** (the default),
  - **Price — low to high**, judged on an event's *cheapest* ticket, so the free
    events lead and the $250 fishing tournament brings up the rear,
  - **Most popular** (see the honesty note below).
  Every order falls back to "soonest first" to break ties, so two $0 events or
  two equally popular ones still read as a sensible calendar.
- **Added** (`web/lib/filter-events.ts`): the URL now carries the sort too —
  `/discover?sort=price`, `?sort=popularity`. Date order is the default, so it's
  left out of the URL entirely. An unrecognised value (`?sort=banana`) quietly
  falls back to date order instead of breaking the page.
- **Changed** (`web/components/DiscoverBrowser.tsx`): filters and sort are kept
  as **separate** pieces of state on purpose — sorting doesn't hide any events,
  so it must not light up "Clear filters", and pressing "Clear filters" must not
  throw away the order you picked. The grid now filters first and sorts the
  survivors, in two separate `useMemo`s, so changing the sort doesn't re-run the
  filtering.
- **Changed** (`web/components/DiscoverBrowser.tsx`): the results bar is now two
  rows — count and Sort on the first, the active-filter pills and "Clear
  filters" on a second row underneath. Previously the pills shared a row with
  the count, and a handful of them would have shoved the new dropdown off the
  end on a narrow screen.
- **Honest-data note** (CLAUDE.md §Data-honesty): Phase 1 has no ticket sales,
  so there is no real popularity figure — and we won't invent one ("1,284 sold"
  would be a lie). **Most popular** is worked out from two signals the sample
  data genuinely carries: whether an event is **featured** (+2) and how its
  tickets are moving — *Almost sold out* (+2), *Sold out* (+1). Sold-out events
  score lower than almost-sold-out ones on purpose: they were clearly popular,
  but you can't buy them, so they shouldn't crowd out the things you can still
  get into. Today that puts the Sunset Catamaran Cruise and the New Year's Eve
  Gala at the top. When real sales data arrives in a later phase, one small
  function (`popularityScore`) is the only thing that has to change.
- **Note:** `npm run lint` still reports the same one **pre-existing** error in
  `SiteHeader.tsx` (setState inside an effect, from Milestone 1). Untouched by
  this step; `npm run build` passes clean.
- **Note (environment, no code change):** the new dropdown appeared to be
  missing when Joey first looked. The cause was the **dev server**, not the
  code: the `next dev` process had been running for ~13½ hours and had stopped
  noticing file changes. The project sits on the Windows drive (`/mnt/c/…`) and
  file-change events don't reliably reach a long-running watcher in WSL2.
  Restarting `npm run dev` fixed it. **If a future change doesn't show up,
  suspect this first** — stop the dev server, start it again, and hard-refresh
  (Ctrl+Shift+R).

> **Verified by Joey:** [x] 2026-07-25

---

### 2026-07-24 — Milestone 2, Step 2.3: price + free-only filters go live

> The last two filter controls stop being decorative. The **price slider** and
> **Free events only** checkbox now filter the grid, show up as pills, and ride
> along in the URL like every other filter.

- **Added** (`web/lib/filter-events.ts`): two new fields on `DiscoverFilters` —
  `maxPrice` (a number, or `null` for "Any price") and `freeOnly` (true/false).
  `filterEvents()` judges both against an event's **cheapest** ticket, so a
  festival with free entry and a $15 VIP pass still counts as free, and the
  Chef's Table (cheapest seat $150) drops out as soon as the slider goes below
  $150.
- **Added** (`web/lib/filter-events.ts`): `priceCeiling()` — works the slider's
  far-right end out from the event data (priciest event's cheapest ticket,
  rounded up to the next $25 → **$250** today) instead of hard-coding it, so
  adding a dearer event later can never make it unreachable. `PRICE_STEP` fixes
  the slider's jumps at $25.
- **Added** (`web/lib/filter-events.ts`): `countFree()` — the number beside
  "Free events only", counted with the *other* filters applied but this one
  switched off, so it answers "what would ticking this give me?".
- **Changed** (`web/components/FilterPanel.tsx`): the Price slider and "Free
  events only" checkbox are **no longer disabled**. The slider reads live ("Any"
  → "$150"), and ticking **Free only** greys the slider out, since free is just
  a stricter version of the same question. The "switches on in Step 2.3" caption
  is gone.
- **Changed** (`web/components/DiscoverBrowser.tsx`): passes the new
  `priceMax` / `freeCount` values to the panel, and shows an **"Up to $150"** or
  **"Free only"** pill in the active-filter row beside the result count.
- **Changed** (`web/lib/filter-events.ts`): the URL now carries price too —
  `/discover?max=100` and `/discover?free=1`. `free=1` wins on its own (no
  pointless `max` alongside it), and a nonsense value like `?max=abc` quietly
  falls back to "Any price" rather than breaking the page.
- **Fixed** (`web/lib/filter-events.ts`, caught while testing): `?max=0` — the
  slider dragged fully left — was reading back as "Any price" on reload, because
  `Number("")` is also `0` and the check couldn't tell an empty parameter from a
  deliberate zero. The empty string is now rejected separately, so `max=0`
  survives a refresh and a shared link.
- **Note:** `npm run lint` still reports the same one **pre-existing** error in
  `SiteHeader.tsx` (setState inside an effect, from Milestone 1). Untouched by
  this step; still worth a small ad-hoc fix of its own.

> **Verified by Joey:** [x] 2026-07-24

---

### 2026-07-24 — Milestone 2, Step 2.2: FilterPanel sidebar on Discover

> The Discover page grows a proper filter sidebar: **Category** checkboxes,
> **Date** and **Island** radio buttons, and the **Price** / **Free only**
> controls (built but deliberately switched off until Step 2.3).

- **Added** (`web/components/FilterPanel.tsx`): the **FilterPanel** — a white
  card holding five titled sections, laid out per `docs/03-Wireframes.md` §3.
  Category is a checkbox per category with a **count** beside it; Date and
  Island are radio lists. Real `<input type="checkbox">` / `type="radio"`
  elements are used (recoloured with Tailwind's `accent-ocean-600`) so keyboard
  and screen-reader support come for free.
- **Changed** (`web/components/DiscoverBrowser.tsx`): the results area is now a
  two-column layout from `lg` up — a 16rem filter column (**sticky**, so it
  stays put while the grid scrolls) beside the cards. Below `lg` the panel is
  hidden behind a **[⚙ Filters]** button that expands it inline; Step 2.6 turns
  that into a slide-up drawer. Card grid is now 1 / 2 / 3 columns at
  mobile / `sm` / `xl` to leave room for the sidebar.
- **Changed** (`web/lib/filter-events.ts`): **category is now multi-select.**
  `DiscoverFilters.category` (one category or `"all"`) became
  `DiscoverFilters.categories` (a list; **empty means all**), because the spec's
  filter panel is a checkbox list — you can now ask for Music *and* Food at
  once. The URL carries them comma-separated (`/discover?category=music,food`),
  and the old single-value links the homepage chips and header menu use
  (`?category=music`) still parse correctly.
- **Added** (`web/lib/filter-events.ts`): `toggleCategory()` (tick/untick one
  box, keeping the list in a stable order) and `countByCategory()` (the numbers
  beside the checkboxes). The counts respect every filter *except* category, so
  they stay useful once a box is ticked.
- **Changed** (`web/components/SearchBar.tsx`): the bar gained an optional
  **controlled mode** (`values` + `onValuesChange`). Discover uses it so the
  sidebar's Date/Island choices show up in the bar's dropdowns too — without it
  the two would drift apart and display different answers. Passing neither prop
  leaves the bar behaving exactly as before.
- **Note — not yet wired up:** the **Price** slider and **Free events only**
  checkbox are rendered greyed out with the caption *"Price and free-only
  filtering switch on in Step 2.3."* They're shown now so the finished panel
  layout can be approved, and they are honestly marked as inactive rather than
  silently doing nothing.
- **Note:** `npm run lint` reports one **pre-existing** error in
  `SiteHeader.tsx` (React's new "don't call setState inside an effect" rule,
  from Milestone 1). Untouched by this step; worth a small fix of its own.

> **Verified by Joey:** [x] 2026-07-24

---

### 2026-07-24 — Ad-hoc (outside the numbered sequence): photo hero on the Discover page

> Joey supplied a sunset beach-concert image and asked for it as the Discover
> page's hero, replacing the plain sand-coloured heading band from Step 2.1.

- **Added** (`web/public/events/discover-hero.jpg`): the supplied image,
  converted from a 2.4 MB PNG to a **236 KB JPEG** (1717×916, quality 82) with
  `sharp` so it matches the other event photos and loads fast.
- **Added** (`web/components/PageHero.tsx`): a new **PageHero** component — the
  short photo banner for inner pages. It's the smaller sibling of `Hero.tsx`
  (the tall homepage banner): about half the height, centred **white** text over
  an ocean-tinted scrim, gold rule above the title, no CTA button. Built generic
  so /about, /help and friends can reuse it in Milestone 6.
- **Changed** (`web/app/discover/page.tsx`): the sand heading band is replaced by
  `PageHero`; the search card is now lifted onto the banner's lower edge
  (`-mt-14 md:-mt-16`) so it floats over the photo, as the spec pictures it.
- **Note:** like the homepage hero, the banner is pulled up under the sticky
  frosted header so the photo runs edge to edge behind it.
- **Note:** image `alt` text describes the photo for screen readers and search
  engines ("Crowd at a beachfront sunset concert beneath palm trees…").
- **Note:** the dev server was found not to be picking up **any** file edits on
  the `/mnt/c` Windows drive (not just new routes) — Turbopack's file watcher
  can't see changes there from WSL, and Next 16 documents no polling fallback.
  **Restart `npm run dev` after every change**, or move the project into the WSL
  filesystem for a permanent fix.

> **Verified by Joey:** [x] 2026-07-24

---

### 2026-07-24 — Milestone 2, Step 2.1: Discover page layout (search + count + grid)

> `/discover` exists at last. Every link that has been 404-ing since Milestone 1 —
> the hero's **Browse Events** button, **See all events →**, **View all events →**
> and all ten category chips — now lands on a real page that shows the events,
> pre-filtered to whatever the link asked for.

- **Added** (`web/app/discover/page.tsx`): the **Discover page** — a server
  component that reads the query string (`?q=`, `?date=`, `?island=`,
  `?category=`), renders the page heading band, and hands the events plus the
  starting filters to the interactive part below.
- **Added** (`web/components/DiscoverBrowser.tsx`): the client component that
  owns the interaction — the compact **SearchBar** (pre-filled from the URL), the
  **result count** ("15 events"), small pills showing the active category/island,
  a **Clear filters** button, and the responsive **EventCard grid**
  (1 column on phones, 2 from 640px, 3 from 1024px).
- **Added** (same file): pressing **Go** filters the grid *and* rewrites the
  address bar, so a filtered view can be bookmarked or shared.
- **Added** (`web/lib/filter-events.ts`): the filtering logic, kept out of the
  components — free-text search (title, venue, island, organizer, category),
  date presets, island and category, plus URL parsing/building helpers.
  Unrecognised values in a hand-typed URL fall back to "all" instead of erroring.
- **Added** (same file): date presets are worked out in **Turks & Caicos calendar
  days** (`"YYYY-MM-DD"` strings), and "right now" is read once on the server and
  passed to the browser, so the server and client always agree — no React
  hydration warnings.
- **Changed** (`web/components/SearchBar.tsx`): `DATE_FILTERS` / `DateFilter`
  moved into `lib/filter-events.ts` so server code can use them without pulling
  in a browser-only component. SearchBar re-exports them, so nothing that
  imported them from there had to change.
- **Changed** (`web/lib/sample-events.ts`): `TCI_TIME_ZONE` is now exported so the
  new date helpers share the same time zone as the card date formatting.
- **Note:** a plain "No events match your search" block appears when a filter
  matches nothing (easy to see with **Date → This week**, since the sample events
  all start in August). Step 2.5 replaces it with the proper designed EmptyState.
- **Note:** still to come in this milestone — FilterPanel sidebar (2.2), its live
  wiring incl. price + free-only (2.3), the **Sort** dropdown (2.4), the designed
  EmptyState (2.5), and the mobile filter drawer (2.6).
- **Note:** event cards still link to `/events/[slug]`, which arrives in
  Milestone 3, so those 404 for now — expected, not a bug.
- **Note:** verified with a production build (`npm run build` → clean, `/discover`
  server-rendered on demand) because a dev server left running from an earlier
  session was serving a stale 404 for the new route — the same `/mnt/c` file
  watching problem noted on 1.8d. **Restart `npm run dev` before previewing.**

> **Verified by Joey:** [x] 2026-07-24

---

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
