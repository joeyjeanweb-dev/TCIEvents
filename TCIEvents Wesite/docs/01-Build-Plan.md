# TCIEvents.com — Build Plan (Public Website, Phase 1)

> **Read this first.** This is the simple, plain-language plan for what we are
> building *right now*. It is deliberately small. We are building the
> **look and feel** of the website only — the part visitors see and click
> through. No money, no logins, no databases yet.

---

## 1. What we are building (in one sentence)

A **beautiful, fast, mobile-friendly website** for discovering events in
Turks & Caicos, filled with **realistic sample events**, so you can see and feel
exactly how the finished product will look before we build the "engine" behind it.

---

## 2. What's IN scope (Phase 1)

These are the pages and pieces we will build:

| # | Page / Piece | What it is |
|---|---|---|
| 1 | **Homepage** | The front door — hero, search bar, categories, featured & upcoming events |
| 2 | **Discover / Browse page** | A grid of all events with filters (category, date, price, island) |
| 3 | **Event Details page** | One event in full — photos, description, map, ticket options |
| 4 | **Organizer Landing page** | The "Host an event? Reach thousands." sales pitch page |
| 5 | **Navigation & Footer** | The sticky top menu and the bottom footer, on every page |
| 6 | **Sample data** | ~12–18 realistic fake events (concerts, boat parties, dinners, etc.) |
| 7 | **Responsive design** | Everything works on phone, tablet, and desktop |

We will also build the **checkout screens as *visuals only*** — a fake "Get Tickets"
flow (tickets → your details → payment → confirmation) that looks completely real
but **charges nobody**. ✅ *Confirmed: we are building this.*

---

## 3. What's OUT of scope (on purpose — for later)

We are **not** building any of this yet. It is parked for a future phase:

- ❌ Real payments / Stripe / checkout that charges money
- ❌ Refunds, payouts to organizers
- ❌ User accounts / login / sign-up
- ❌ Organizer dashboard (create/edit real events)
- ❌ Admin dashboard (approvals, money)
- ❌ QR code tickets & the door-scanning app
- ❌ Database, emails, SMS
- ❌ Legal pages content (we'll add simple placeholder pages only)

> **Why leave these out?** They are the hard, slow, expensive parts. By building
> the *visible* site first with fake data, you get something real to look at and
> share in days, not weeks — and we lock the design before wiring up the engine.

---

## 4. The technology we'll use

This matches the main architecture plan so nothing gets thrown away later.

| Piece | Choice | Why (plain English) |
|---|---|---|
| **Framework** | **Next.js (App Router)** | The industry-standard React framework; grows into the full product later |
| **Language** | **TypeScript** | Catches mistakes as we type; safer as the site grows |
| **Styling** | **Tailwind CSS** | Fast way to build a custom, premium look |
| **Components** | **shadcn/ui** | Ready-made, good-looking buttons/cards/inputs we can restyle |
| **Icons** | **lucide-react** | Clean, consistent icon set |
| **Fonts** | **Fraunces** (headings) + **Inter** (body) | Luxury-resort feel + clean readability |
| **Images** | **next/image** + free stock photos | Fast-loading, optimized images |
| **Sample data** | **A local TypeScript file** | Fake events live in one file we can edit easily |

No database, no server, no accounts needed to run any of this.

---

## 5. The look & feel — "Tropical Luxury"

Think **boutique resort website**, not a busy ticket site. Generous whitespace,
big beautiful imagery, confident typography, calm ocean colors with sparing gold
accents.

**Colors** (from the master plan):
- Deep ocean `#0B3C5D`, brand ocean `#1B7FA8`, bright turquoise `#36C2CE`
- Warm sand `#F7F1E6` for section backgrounds
- Gold `#C9A227` for "Featured" and premium touches (used sparingly)
- Ink `#0E1726` for text

Full details live in **`02-Spec.md`**.

---

## 6. How the project folder will be organized

```
TCIEvents Wesite/
├── docs/                     ← these planning documents (you are here)
└── web/                      ← the Next.js website (created in build step)
    ├── app/                  ← the pages
    │   ├── page.tsx              (Homepage)
    │   ├── discover/page.tsx     (Browse page)
    │   ├── events/[slug]/page.tsx(Event details)
    │   ├── host/page.tsx         (Organizer landing)
    │   └── layout.tsx            (wraps every page: nav + footer)
    ├── components/           ← reusable pieces (EventCard, SearchBar, etc.)
    ├── lib/
    │   └── sample-events.ts     (our fake event data)
    └── public/               ← images
```

---

## 7. How we'll work (milestones)

We'll build in small, reviewable steps. After each one, you look and give feedback.

| Milestone | You'll be able to see... |
|---|---|
| **M0 — Setup** | A blank Next.js site running locally with fonts + colors ready |
| **M1 — Nav, Footer, Homepage** | The full front page with hero, categories, event cards |
| **M2 — Discover page** | The browse grid with working filters |
| **M3 — Event Details page** | A full single-event page (click a card → see it) |
| **M4 — Checkout flow (visual only)** | The fake tickets → details → payment → confirmation screens |
| **M5 — Organizer Landing** | The "host an event" pitch page |
| **M6 — Polish & responsive pass** | Everything smooth on phone/tablet/desktop |

---

## 8. How you'll preview it

Once built, you'll run one command (`npm run dev`) and open
`http://localhost:3000` in your browser. I'll give you exact steps when we get there.

---

## 9. The companion documents

- **`02-Spec.md`** — the detailed spec: every page, every component, the sample
  events, and the exact design tokens (colors, fonts, spacing).
- **`03-Wireframes.md`** — quick visual sketches of each page (desktop + mobile).
- **`04-Checklist.md`** — the tick-box to-do list we'll work through together.

---

## 10. Decisions (confirmed)

| Decision | Choice |
|---|---|
| **Logo** | ✅ **You will provide a logo file.** Until then, a clean "TCIEvents" text wordmark is used as a placeholder (easy to swap). |
| **Checkout** | ✅ **Build the visual-only checkout flow** (tickets → details → fake payment → confirmation). Looks real, charges nobody. |
| **Kickoff style** | ✅ **Milestone by milestone** — build, show you, get feedback, continue. |

Still to confirm (won't block the start):
- **Islands to feature** — assuming Providenciales (Provo), Grand Turk, North
  Caicos, Salt Cay unless you say otherwise.
- **Real event names/organizers** — assuming all invented (but believable) for now.
