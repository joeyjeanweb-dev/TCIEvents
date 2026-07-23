# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**TCIEvents.com** — an event discovery + ticketing marketplace for Turks & Caicos.
The long-term product (payments, dashboards, QR scanning, admin) is specified in
`TCIEvents Wesite/docs/TCIEvents-Product-and-Architecture-Plan.md`.

**Current phase is deliberately narrow: the public-facing website only, with fake
sample data.** Payments, auth, databases, organizer/admin dashboards, and QR
scanning are explicitly OUT of scope for now — do not build them unless asked.
The Phase 1 scope, spec, wireframes, and build checklist live in
`TCIEvents Wesite/docs/` (read `00-README.md` first).

## Repository layout

The project root has an unusual nested folder whose name contains a space:

```
TCIEvents/                      ← working directory (this file lives here)
└── TCIEvents Wesite/           ← note the space + typo in the folder name
    ├── docs/                   ← planning docs (source of truth for scope & design)
    └── web/                    ← the Next.js app — run all npm commands from HERE
```

Always `cd "TCIEvents Wesite/web"` (quote the path — it contains a space) before
running npm/next commands.

## Commands

Run from `TCIEvents Wesite/web`:

- `npm run dev` — start the dev server (Turbopack, default port 3000; falls back to
  3001 etc. if taken — check the startup log for the actual port)
- `npm run build` — production build (Turbopack by default in Next 16)
- `npm start` — serve the production build
- `npm run lint` — ESLint (flat config via `eslint`)

There is no test suite yet.

## Tech stack & key conventions

- **Next.js 16** (App Router) + **React 19** + **TypeScript**. Turbopack is the
  default bundler for both dev and build.
- **Tailwind CSS v4** — configured entirely in CSS, not a JS config file. Design
  tokens (the "Tropical Luxury" palette, fonts, radius, shadows) are defined in the
  `@theme` block of `web/app/globals.css`. Add/change colors there; they become
  utilities automatically (e.g. `--color-ocean-600` → `bg-ocean-600`).
- **Fonts:** Fraunces (headings, `font-display`) + Inter (body, `font-sans`),
  loaded via `next/font/google` in `web/app/layout.tsx` and exposed as CSS vars.
- **Icons:** `lucide-react`. **Class merging:** `cn()` in `web/lib/utils.ts`.
- Components are hand-built with Tailwind (not shadcn/ui) for tighter control of the
  premium visual style.
- **Sample event data** lives in a single file, `web/lib/sample-events.ts` — the
  one place to edit the fake events shown across the site.

### Next.js 16 gotchas (differs from older Next.js)

`web/AGENTS.md` warns that this Next.js has breaking changes vs. training data —
consult `web/node_modules/next/dist/docs/` when unsure. The most important:

- **`params` and `searchParams` are async (Promises).** In dynamic routes like
  `app/events/[slug]/page.tsx` you must `await params` (and `await searchParams`).
  Synchronous access was fully removed in v16.
- Turbopack is default — do not add a `--turbopack` flag; a stray custom `webpack`
  config will fail the build.
- `opengraph-image`/`icon` image functions also receive `params`/`id` as Promises.

## Design direction

"Tropical Luxury" — boutique-resort feel, not a busy ticket site: ocean/turquoise +
sand palette, sparing gold accents, big imagery, generous whitespace, Fraunces
headings. Full tokens and rationale in `docs/02-Spec.md` Part A. Every page must be
responsive (mobile / tablet / desktop) and every event page should carry Open Graph
tags (sharing on Instagram/WhatsApp is the intended growth channel).

## Working style for this project (important)

This project follows the **numbered-step workflow** the user (Joey) uses across his
projects. Work in small, verifiable increments — never chain ahead.

**1. Numbered Steps, one at a time.** Every change is delivered as a numbered
**Step** inside a Milestone — `Milestone 1, Step 1.2`, etc. Go finer when a step is
big: sub-steps like `1.8a` / `1.8b`. **Build ONE step, then STOP** and wait for
Joey's go-ahead before starting the next. Milestones and their order live in
`docs/04-Checklist.md`.

**2. Verify-gate (required) — Joey flips a step to done, not you.** End every step
with an explicit **"verify before we continue"** checklist telling Joey exactly what
to preview and how (URL, what to click, what to look for). Do NOT mark any Step,
Milestone, or `docs/04-Checklist.md` item complete until Joey confirms he checked it.
Tag completed checklist items **"verified by Joey <date>"**, not a bare `[x]`.

**3. Changelog (required).** Every time you add / change / fix / remove anything,
update `docs/CHANGELOG.md` (newest first, tagged **Added / Changed / Fixed /
Removed / Docs**) as part of finishing the change. Each entry carries a
"Verified by Joey" line left unchecked until he confirms.

**4. Beginner-friendly delivery.** Joey is newer to web development. Deliver each
step as: **goal → files touched → the code → a plain-language explanation → how to
test it.** Explain new concepts, libraries, and files in plain terms; don't skip
steps that seem obvious to an experienced developer.

**5. Data-honesty policy.** Never fabricate numbers or fake a feature that isn't
built. Anything out of Phase 1 scope (payments, real checkout data, accounts) is
shown as an honest **"Coming soon"** placeholder or a clearly visual-only demo —
never a dead link or invented data.

**6. Ad-hoc work is labeled.** If Joey requests something outside the numbered
sequence, do it, but label it explicitly as **"ad-hoc — outside the numbered
sequence"** in the changelog/checklist, and still run it through the verify-gate.

> Scope note: this is the *workflow* borrowed from the Travel Itinerary Planner.
> That project's backend patterns (Prisma / Neon / NextAuth / ownership rules) do
> **NOT** apply here — Phase 1 is the public website with fake data only.
