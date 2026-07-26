# TCIEvents.com — Wireframes (Public Website, Phase 1)

> Quick, low-fidelity sketches of each page so we agree on the *layout* before
> building. These show **where things go**, not the final visual polish.
>
> **Legend:** `[ Button ]` · `____` input · `▢` image · `▾` dropdown · `☰` menu

---

## 1. Header (on every page)

**Desktop**
```
┌──────────────────────────────────────────────────────────────┐
│  TCIEvents        Browse   Categories ▾        [ List Event ] │  ← sticky
└──────────────────────────────────────────────────────────────┘
```
**Mobile**
```
┌───────────────────────────────┐
│  TCIEvents               ☰    │
└───────────────────────────────┘
```

---

## 2. Homepage (`/`)

**Desktop**
```
┌──────────────────────────────────────────────────────────────┐
│  TCIEvents     Browse   Categories ▾          [ List Event ]  │
├──────────────────────────────────────────────────────────────┤
│ ▢▢▢▢▢▢▢▢▢▢  HERO IMAGE (beach) w/ ocean overlay ▢▢▢▢▢▢▢▢▢▢▢  │
│                                                              │
│        Discover the best events in Turks & Caicos            │
│        Concerts, boat parties, dining & more.                │
│   ┌────────────────────────────────────────────────────┐    │
│   │ 🔍 Search events ____   📅 Date ▾   📍 Island ▾  [Go]│    │
│   └────────────────────────────────────────────────────┘    │
├──────────────────────────────────────────────────────────────┤
│  🎵 Music  🎉 Nightlife  ⛵ Boat  🍴 Food  🎪 Festival  … →   │  ← scroll
├──────────────────────────────────────────────────────────────┤
│  ★ FEATURED EVENTS                                           │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│   │ ▢ ★     │ │ ▢ ★     │ │ ▢ ★     │ │ ▢ ★     │    →      │
│   │ Title   │ │ Title   │ │ Title   │ │ Title   │           │
│   │ date·$$ │ │ date·$$ │ │ date·$$ │ │ date·$$ │           │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├──────────────────────────────────────────────────────────────┤
│  UPCOMING EVENTS                                             │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│   │ ▢       │ │ ▢       │ │ ▢       │                       │
│   │ Title   │ │ Title   │ │ Title   │                       │
│   └─────────┘ └─────────┘ └─────────┘                       │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│   │ ▢       │ │ ▢       │ │ ▢       │      [ See all → ]     │
│   └─────────┘ └─────────┘ └─────────┘                       │
├──────────────────────────────────────────────────────────────┤
│  ▢  "Hosting an event? Reach thousands."   [ List Your Event]│  ← gold CTA
├──────────────────────────────────────────────────────────────┤
│  FOOTER:  About · Help · Terms · Privacy      🔗 social       │
└──────────────────────────────────────────────────────────────┘
```

**Mobile** (single column)
```
┌───────────────────────────┐
│ TCIEvents            ☰    │
├───────────────────────────┤
│ ▢▢ HERO ▢▢                │
│  Discover the best        │
│  events in T&C            │
│  ┌─────────────────────┐  │
│  │ 🔍 Search ____      │  │
│  │ 📅 Date ▾ 📍 Island▾│  │
│  │        [ Go ]       │  │
│  └─────────────────────┘  │
├───────────────────────────┤
│ 🎵 🎉 ⛵ 🍴 🎪  →         │
├───────────────────────────┤
│ ★ Featured                │
│ ┌───────────────────────┐ │
│ │ ▢ ★  Title  date · $$ │ │
│ └───────────────────────┘ │
│ (swipe →)                 │
├───────────────────────────┤
│ Upcoming                  │
│ ┌───────────────────────┐ │
│ │ ▢  Title  date · $$   │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ ▢  Title  date · $$   │ │
│ └───────────────────────┘ │
│        [ See all → ]      │
├───────────────────────────┤
│ ▢ Host an event?          │
│    [ List Your Event ]    │
├───────────────────────────┤
│ FOOTER                    │
└───────────────────────────┘
```

---

## 3. Discover / Browse (`/discover`)

**Desktop** (filters left, grid right)
```
┌──────────────────────────────────────────────────────────────┐
│  🔍 Search ____            42 events        Sort: Date ▾       │
├───────────────┬──────────────────────────────────────────────┤
│ FILTERS       │  ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│               │  │ ▢ Title │ │ ▢ Title │ │ ▢ Title │          │
│ Category      │  │ date·$$ │ │ date·$$ │ │ date·$$ │          │
│  ☑ Music      │  └─────────┘ └─────────┘ └─────────┘          │
│  ☐ Nightlife  │  ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  ☐ Boat       │  │ ▢ Title │ │ ▢ Title │ │ ▢ Title │          │
│  …            │  │ date·$$ │ │ date·$$ │ │ date·$$ │          │
│               │  └─────────┘ └─────────┘ └─────────┘          │
│ Date range    │  ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  ____ – ____  │  │ ▢ Title │ │ ▢ Title │ │ ▢ Title │          │
│               │  └─────────┘ └─────────┘ └─────────┘          │
│ Price ___──── │                                              │
│ Island ▾      │            … more / pagination                │
│ ☐ Free only   │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

**Mobile** (filters in a drawer)
```
┌───────────────────────────┐
│ 🔍 Search ____            │
│ [ ⚙ Filters ]  Sort ▾     │  ← Filters opens a slide-up drawer
├───────────────────────────┤
│ ┌───────────────────────┐ │
│ │ ▢ Title  date · $$    │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ ▢ Title  date · $$    │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ ▢ Title  date · $$    │ │
│ └───────────────────────┘ │
│         … more            │
└───────────────────────────┘
```

---

## 4. Event Details (`/events/[slug]`)

**Desktop** (content left, sticky ticket card right)
```
┌──────────────────────────────────────────────────────────────┐
│  Home / Discover / Full Moon Beach Party                      │
├──────────────────────────────────────────────────────────────┤
│ ▢▢▢▢▢▢▢▢▢  COVER IMAGE  ▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢    │
│  🎉 Nightlife   ★ Featured                                    │
│  FULL MOON BEACH PARTY                                        │
│  📅 Sat Aug 9, 8:00 PM   📍 Grace Bay, Providenciales         │
│  by Ocean Club Events  ✔ verified                            │
├────────────────────────────────────┬─────────────────────────┤
│ ABOUT THIS EVENT                    │  TICKETS                │
│ Lorem ipsum description paragraphs  │ ┌─────────────────────┐ │
│ about the party, the DJ, the vibe…  │ │ General Adm.  $45   │ │
│                                     │ │            [− 1 +]  │ │
│ 📍 MAP (Google embed)               │ │ VIP Table    $150   │ │
│ ▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢▢                    │ │            [− 0 +]  │ │
│                                     │ ├─────────────────────┤ │
│ GALLERY                             │ │ Subtotal      $45   │ │  ← sticky
│ ▢ ▢ ▢ ▢                             │ │ Fee (5%)     $2.25  │ │
│                                     │ │ Total       $47.25  │ │
│ MORE FROM THIS ORGANIZER            │ │   [ Get Tickets ]   │ │
│ ┌────┐ ┌────┐ ┌────┐                │ └─────────────────────┘ │
│ │ ▢  │ │ ▢  │ │ ▢  │                │  🔒 Secure checkout     │
│ └────┘ └────┘ └────┘                │                         │
└────────────────────────────────────┴─────────────────────────┘
```

> **As built (Step 3.5, verified by Joey 2026-07-26):** "More from this organizer"
> ended up **full width below both columns**, not inside the left column as drawn
> above. `.container-page` caps the page at 1200px, so in the left column the three
> cards would share ~720px (~220px each) instead of getting ~360px each. It also
> gives the sticky ticket card a natural place to stop.
>
> The heading is **not always** "More from this organizer": only one of our 14
> sample organizers runs more than one event, so the row widens to the same
> category, then the same island, and **renames itself** to match what it's
> actually showing. See `04-Checklist.md` 3.5.

**Mobile** (single column + sticky bottom buy bar)
```
┌───────────────────────────┐
│ ▢▢ COVER ▢▢               │
│ 🎉 Nightlife  ★ Featured  │
│ FULL MOON BEACH PARTY     │
│ 📅 Sat Aug 9 · 8:00 PM    │
│ 📍 Grace Bay, Provo       │
│ by Ocean Club ✔           │
├───────────────────────────┤
│ About this event…         │
│ 📍 Map                     │
│ Gallery ▢ ▢ ▢             │
│ Tickets:                  │
│  General Adm. $45 [−1+]   │
│  VIP        $150 [−0+]    │
├───────────────────────────┤
│ from $45      [Get Tickets]│  ← sticky bottom bar
└───────────────────────────┘
```

---

## 4b. Checkout — visual only (`/events/[slug]/checkout`)

> Looks real, **charges nobody**. No Stripe, no real order.

```
┌──────────────────────────────────────────────────────────────┐
│  ① Tickets ──── ② Details ──── ③ Payment ──── ④ Done          │  ← stepper
├──────────────────────────────────────────────────────────────┤
│  STEP 3 — PAYMENT                            ORDER SUMMARY     │
│  ┌────────────────────────────────┐          Full Moon Party  │
│  │ Card number ____ ____ ____ ____│          2 × GA     $90   │
│  │ Expiry __/__      CVC ___       │          1 × VIP   $150   │
│  │ Name on card ________________   │          Subtotal $240    │
│  └────────────────────────────────┘          Fee (5%)  $12    │
│  🔒 Demo only — no payment is taken           Total    $252    │
│                                    [ Pay $252.00 ]            │
└──────────────────────────────────────────────────────────────┘

Step 4 (confirmation):
┌──────────────────────────────────────────────────────────────┐
│              ✅  You're going!                                │
│     Order #TCI-8F3A2 · tickets emailed (demo)                │
│   ┌───────────┐  General Admission — Jane Doe                 │
│   │ ███ QR ███│  Full Moon Beach Party · Sat Aug 9           │
│   └───────────┘                                              │
│        [ Download tickets ]   [ Back to events ]             │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. Organizer Landing (`/host`)

**Desktop**
```
┌──────────────────────────────────────────────────────────────┐
│ ▢▢▢▢  HERO  ▢▢▢▢                                             │
│   Sell out your next event in Turks & Caicos                 │
│   List in minutes. Reach thousands of locals & visitors.     │
│                     [ Get Started ]                          │
├──────────────────────────────────────────────────────────────┤
│  WHY TCIEVENTS                                               │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                │
│  │ 📣     │ │ ⚡     │ │ 🔒     │ │ 🎟     │                │
│  │ Reach  │ │ Easy   │ │ Secure │ │ Scan   │                │
│  │ 1000s  │ │ setup  │ │ pay    │ │ @ door │                │
│  └────────┘ └────────┘ └────────┘ └────────┘                │
├──────────────────────────────────────────────────────────────┤
│  HOW IT WORKS                                               │
│   1 Create event  →   2 Get approved  →   3 Start selling    │
├──────────────────────────────────────────────────────────────┤
│  Simple pricing:  Just 5% per ticket. No monthly fees.       │
├──────────────────────────────────────────────────────────────┤
│  "Loved by organizers"  ▢ ▢ ▢  (logos / quotes)              │
├──────────────────────────────────────────────────────────────┤
│              Ready to host?   [ Get Started ]                │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

**Mobile:** same sections stacked in one column; value-prop cards go 1-per-row
(or 2-up), "How it works" steps stack vertically with down-arrows.

---

## 6. Footer (on every page)

```
┌──────────────────────────────────────────────────────────────┐
│  TCIEvents                                                   │
│  Discover events across Turks & Caicos.                      │
│                                                              │
│  EXPLORE        COMPANY        SUPPORT       FOLLOW           │
│  Browse         About          Help          Instagram        │
│  Categories     Contact        Terms         Facebook         │
│  Host an event  Careers        Privacy       WhatsApp         │
│                                                              │
│  ┌────────────────────────────┐                              │
│  │ Get event updates  ____ [→]│                              │
│  └────────────────────────────┘                              │
│  © 2026 TCIEvents. All rights reserved.                      │
└──────────────────────────────────────────────────────────────┘
```

---

> These wireframes are intentionally rough. The real pages will use the
> "Tropical Luxury" styling from **`02-Spec.md`** — big imagery, ocean colors,
> Fraunces headings, generous whitespace.
