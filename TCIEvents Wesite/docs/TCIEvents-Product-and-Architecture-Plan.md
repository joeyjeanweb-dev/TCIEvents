# TCIEvents.com — Product, Design & Architecture Plan

> The event discovery + ticketing marketplace for Turks and Caicos.
> Prepared as a founder/PM/architect/UX brief. Version 1.0.

---

## 0. The Decision That Shapes Everything: Payment Rails

Your business model is an **aggregator marketplace**: TCIEvents collects 100% of the
customer's money, holds it, then pays organizers on a delay. This is identical in shape to
how Eventbrite, Airbnb, and Uber handle money. The tool built for this is **Stripe Connect**
(specifically *Separate Charges & Transfers* or *Destination Charges with on_behalf_of*).

**The problem:** Stripe does **not** onboard businesses legally domiciled in Turks and Caicos.
TCI is also not supported by most modern processors (Square, Adyen self-serve, etc.).

You have three realistic paths. **You must pick one before development starts** because it
changes your legal structure, your KYC flow, and your payout code.

### Option A — Incorporate a US entity, use Stripe Connect (RECOMMENDED)
- Form a **US LLC or Delaware C-Corp** (and a US business bank account, e.g. Mercury).
  This is extremely common for Caribbean-operating startups.
- Unlocks **Stripe Connect** → the marketplace model works out of the box: held funds,
  application fees (your 5%), scheduled payouts, refunds, chargeback handling, KYC of
  organizers via Stripe-hosted onboarding.
- Organizers can be paid out to local TCI bank accounts via Stripe cross-border payouts,
  or you do manual local bank transfers and just use Stripe to *hold + charge*.
- **Downside:** US tax/compliance footprint, need a registered agent.
- **Why recommended:** It is the only path where the "collect first, pay out later, take a
  fee, manage refunds/chargebacks programmatically" model is a *solved problem* instead of
  something you hand-build.

### Option B — Caribbean payment gateway + manual payouts
- Use a regional processor that supports TCI merchants, e.g. **WiPay** (Caribbean-wide),
  **First Atlantic Commerce (FAC)**, or a merchant account via a local bank
  (Scotiabank TCI / RBC / CIBC FirstCaribbean), often fronted by a gateway.
- You collect all money into **your own** TCI merchant/bank account.
- **Payouts to organizers become a manual/internal process** (bank transfer, tracked in your
  own ledger inside the admin dashboard) rather than automated processor transfers.
- **Downside:** You are now a money custodian doing manual reconciliation; refunds and
  chargebacks are handled through the gateway's slower tooling; more fraud/AML responsibility
  falls on you directly.

### Option C — PayPal Commerce Platform / PayPal Payouts
- PayPal operates in TCI. PayPal Commerce Platform supports marketplace splits and
  **PayPal Payouts** can send money to organizers.
- **Downside:** Higher fees, more checkout friction, weaker dispute tooling than Stripe,
  payout coverage to local bank accounts can be limited.

> **Architectural safeguard:** Build a **`PaymentProvider` abstraction layer** in code from
> day one (a single interface: `createCheckout`, `capture`, `refund`, `payout`,
> `handleWebhook`). Then Stripe vs WiPay vs PayPal is a swappable adapter, not a rewrite.
> The rest of this document assumes **Option A (Stripe Connect via a US entity)** as the
> primary, with the abstraction making B/C possible.

---

## 1. Full Website Architecture

### 1.1 High-level system diagram (logical)

```
                         ┌────────────────────────────────────────┐
                         │              CLIENTS                     │
                         │  Web (Next.js, mobile-first)             │
                         │  Organizer Scanner (PWA / mobile web)    │
                         └───────────────┬────────────────────────┘
                                         │ HTTPS
                                         ▼
            ┌─────────────────────────────────────────────────────┐
            │            APPLICATION LAYER (Next.js)               │
            │  • Public site (SSR/ISR for SEO)                     │
            │  • Customer dashboard                                │
            │  • Organizer dashboard                               │
            │  • Admin dashboard (RBAC-gated route group)          │
            │  • API routes / Route Handlers (REST-ish)           │
            │  • Webhook handlers (Stripe)                         │
            │  • Background jobs (payouts, emails) via queue       │
            └───┬───────────────┬─────────────┬──────────────┬────┘
                │               │             │              │
                ▼               ▼             ▼              ▼
        ┌────────────┐   ┌────────────┐  ┌──────────┐  ┌──────────────┐
        │ PostgreSQL │   │  Object    │  │  Stripe  │  │ Email/SMS    │
        │ (core data)│   │  Storage   │  │ Connect  │  │ (Resend/     │
        │            │   │ (images,   │  │ (payments│  │  Postmark +  │
        │            │   │  ID docs)  │  │  payouts)│  │  Twilio)     │
        └────────────┘   └────────────┘  └──────────┘  └──────────────┘
                │
                ▼
        ┌────────────┐
        │ Redis      │  caching, rate limiting, job queue, scan idempotency
        └────────────┘
```

### 1.2 Application surfaces (apps within one platform)

| Surface | Audience | Rendering | Notes |
|---|---|---|---|
| Public marketing + discovery | Everyone | SSR + ISR (SEO critical) | Events must rank on Google |
| Checkout | Customers | Client + secure server actions | PCI handled by Stripe Elements |
| Customer account | Logged-in attendees | CSR/SSR mix | Tickets, refunds |
| Organizer dashboard | Verified organizers | SSR + CSR | Events, sales, payouts, scanning |
| Scanner | Organizer staff at door | PWA (offline-capable) | Camera QR scan |
| Admin console | You / TCIEvents staff | SSR, RBAC-locked | Approvals, money, fraud |

### 1.3 Trust boundaries / security zones
- **Public zone:** discovery pages, event detail (cached, no auth).
- **Customer zone:** requires customer auth.
- **Organizer zone:** requires organizer auth **+ approved verification status**.
- **Admin zone:** requires admin role + ideally IP allowlist + mandatory 2FA.
- **Money zone:** all Stripe operations server-side only; secrets never reach the browser.

---

## 2. Recommended Tech Stack

The guiding principle: **a small team should be able to ship and operate this.** Favor
managed services so you spend time on product, not infrastructure.

| Layer | Recommendation | Why |
|---|---|---|
| **Frontend** | **Next.js 14+ (App Router) + React + TypeScript** | SSR/ISR for SEO (events need to be Google-discoverable), one framework for site + dashboards, huge ecosystem |
| **Styling/UI** | **Tailwind CSS + shadcn/ui + Radix** | Fast to build a premium custom look, accessible primitives, consistent design system |
| **Backend** | **Next.js Route Handlers / Server Actions** (monolith first), extract to **NestJS** service only if needed | Avoid premature microservices; one deployable unit is faster and cheaper at MVP |
| **Database** | **PostgreSQL** | Relational integrity for money/tickets; transactions are non-negotiable for ticketing |
| **ORM** | **Prisma** (or Drizzle) | Type-safe schema + migrations |
| **Auth** | **Clerk** (fastest) or **Supabase Auth / Auth.js** | Roles, 2FA, social login, email verification out of the box |
| **Payments** | **Stripe Connect** (behind a provider abstraction) | Marketplace splits, payouts, refunds, disputes, KYC |
| **File/Image storage** | **Supabase Storage / Cloudflare R2 / AWS S3** + **Cloudflare Images** | Cheap, fast image delivery; private bucket for ID docs |
| **QR generation** | `qrcode` (server) + **signed JWT tokens** | Tickets are cryptographically signed, not guessable |
| **Email** | **Resend** or **Postmark** + **React Email** | Transactional ticket/refund emails with good deliverability |
| **SMS (optional)** | **Twilio** | Ticket delivery / 2FA |
| **Maps** | **Google Maps Embed + Places API** | Event location + autocomplete |
| **Cache / queue / rate limit** | **Redis (Upstash)** | Scan idempotency, payout jobs, abuse protection |
| **Background jobs** | **Inngest** or **BullMQ** | Scheduled payouts, retries, email sending |
| **Hosting** | **Vercel** (app) + **Supabase/Neon** (Postgres) | Zero-ops scaling, preview deploys; migrate to AWS only at large scale |
| **Observability** | **Sentry** (errors) + **PostHog** (analytics) + **Better Stack** (uptime) | See failures and funnel drop-off |
| **Search (later)** | **Postgres full-text** → **Typesense/Algolia** | Start simple, upgrade when catalog grows |

> **Single biggest stack call:** Next.js + Postgres + Stripe Connect + Vercel/Supabase.
> It's modern, scalable, secure-by-default, and operable by 1–3 engineers.

---

## 3. Database Schema

All money stored as **integer cents** (`amount_cents`) + a `currency` column (USD).
Never use floats for money. Times stored as UTC `timestamptz`.

### 3.1 Entity overview

```
users ──1:1── organizer_profiles
  │                  │
  │                  └──1:N── events ──1:N── ticket_types
  │                              │                 │
  │                              │                 │
  └──1:N── orders ──1:N── tickets ────────────────┘
              │              │
              │              └──1:N── scan_logs
              │
              └──1:N── refunds
organizer_profiles ──1:N── payouts
events ──N:1── categories
* ──── audit_logs (admin actions), disputes, payment_events (webhook log)
```

### 3.2 Tables

**users**
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| email | citext unique | |
| phone | text | |
| full_name | text | |
| role | enum(`customer`,`organizer`,`admin`) | a user can later be both customer+organizer; see note |
| auth_provider_id | text | from Clerk/Supabase |
| status | enum(`active`,`suspended`,`banned`) | |
| email_verified_at | timestamptz | |
| created_at / updated_at | timestamptz | |

> *Note:* allow a single user to act as both attendee and organizer. Either keep `role` as the
> highest privilege and gate organizer features on an existing `organizer_profile`, or use a
> `user_roles` join table for true multi-role. Recommended: `user_roles` join table.

**organizer_profiles**
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | |
| business_name | text | |
| business_type | enum(resort, restaurant, bar, club, charter, promoter, sports, church, individual, other) | |
| description | text | |
| contact_email / contact_phone | text | |
| website / social_links | jsonb | |
| gov_id_doc_url | text (private bucket) | KYC |
| business_doc_url | text (private bucket) | license/registration |
| stripe_account_id | text | Stripe Connect connected account |
| verification_status | enum(`pending`,`approved`,`rejected`,`needs_more_info`) | |
| verification_notes | text | admin only |
| payout_tier | enum(`new`,`trusted`) | drives payout timing |
| payout_method | jsonb | bank details (tokenized/last4 only) |
| created_at / updated_at | timestamptz | |

> **Security:** Never store raw bank numbers or full government ID numbers. Store documents
> in a **private** object-storage bucket with signed, time-limited URLs; store only Stripe
> tokens / last-4 for bank info. KYC is ideally delegated to **Stripe Connect onboarding**.

**categories**
| id uuid PK | name text | slug text unique | icon text | sort_order int |

**events**
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| organizer_id | uuid FK → organizer_profiles | |
| category_id | uuid FK → categories | |
| title | text | |
| slug | text unique | SEO URL |
| description | text (rich) | |
| cover_image_url | text | |
| gallery | jsonb (urls) | |
| venue_name | text | |
| address | text | |
| latitude / longitude | numeric | Google Maps |
| start_at / end_at | timestamptz | |
| timezone | text | `America/Grand_Turk` |
| status | enum(`draft`,`pending_review`,`approved`,`rejected`,`cancelled`,`completed`) | |
| rejection_reason | text | |
| is_featured | boolean | admin-controlled homepage placement |
| published_at | timestamptz | |
| created_at / updated_at | timestamptz | |

**ticket_types**
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| event_id | uuid FK → events | |
| name | text | "General Admission", "VIP", "Early Bird" |
| description | text | |
| price_cents | int | base price (0 allowed for free) |
| currency | text | USD |
| quantity_total | int | inventory |
| quantity_sold | int | maintained transactionally |
| max_per_order | int | anti-scalping |
| sales_start_at / sales_end_at | timestamptz | e.g. Early Bird window |
| status | enum(`active`,`paused`,`sold_out`) | |

**orders**
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| order_number | text unique | human-readable |
| customer_id | uuid FK → users | (nullable for guest checkout) |
| guest_email / guest_name | text | guest checkout support |
| event_id | uuid FK → events | denormalized for reporting |
| subtotal_cents | int | sum of tickets |
| platform_fee_cents | int | your 5% |
| total_cents | int | what customer paid |
| currency | text | |
| status | enum(`pending`,`paid`,`failed`,`refunded`,`partially_refunded`,`cancelled`) | |
| stripe_payment_intent_id | text | |
| created_at / updated_at | timestamptz | |

**tickets** (one row per individual admission)
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| order_id | uuid FK → orders | |
| ticket_type_id | uuid FK → ticket_types | |
| event_id | uuid FK → events | denormalized |
| attendee_name | text | |
| ticket_code | text unique | the signed token / public ID |
| qr_payload | text | signed JWT (or hash) embedded in QR |
| status | enum(`valid`,`used`,`refunded`,`void`,`transferred`) | |
| checked_in_at | timestamptz | |
| checked_in_by | uuid FK → users | scanner identity |
| created_at | timestamptz | |

**scan_logs** (audit every scan attempt, even failures)
| id | ticket_id FK | scanned_by FK | result enum(`accepted`,`already_used`,`invalid`,`wrong_event`,`refunded`) | device_info | scanned_at |

**refunds**
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| order_id | uuid FK → orders | |
| ticket_id | uuid FK → tickets | nullable (partial = specific tickets) |
| amount_cents | int | partial or full |
| reason | enum(`event_cancelled`,`event_postponed`,`duplicate`,`fraud`,`admin_exception`,`customer_request`) | |
| reason_note | text | |
| status | enum(`requested`,`approved`,`rejected`,`processing`,`completed`,`failed`) | |
| requested_by | uuid FK → users | |
| processed_by | uuid FK → users (admin) | |
| stripe_refund_id | text | |
| created_at / updated_at | timestamptz | |

**payouts**
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| organizer_id | uuid FK | |
| event_id | uuid FK | payout typically per-event for new organizers |
| gross_cents | int | ticket revenue |
| platform_fee_cents | int | your cut withheld |
| refunds_cents | int | deducted |
| net_cents | int | what organizer receives |
| status | enum(`scheduled`,`on_hold`,`processing`,`paid`,`failed`,`reversed`) | |
| hold_reason | text | fraud/chargeback/dispute |
| scheduled_for | timestamptz | event_end + 2–3 business days (new) |
| paid_at | timestamptz | |
| stripe_transfer_id | text | |
| created_at / updated_at | timestamptz | |

**disputes / chargebacks**
| id | order_id FK | stripe_dispute_id | amount_cents | status enum(`open`,`under_review`,`won`,`lost`) | evidence jsonb | due_by | created_at |

**audit_logs** (immutable admin/staff action trail)
| id | actor_id FK | action text | entity_type | entity_id | metadata jsonb | ip | created_at |

**payment_events** (raw webhook log for idempotency + debugging)
| id | provider | event_type | external_id unique | payload jsonb | processed_at |

### 3.3 Critical integrity rules
- **Inventory:** decrement `quantity_sold` inside the **same DB transaction** that creates the
  order, with a row lock / check `quantity_sold + qty <= quantity_total`. Prevents overselling.
- **Idempotency:** every Stripe webhook keyed by `external_id` (unique) → never double-process.
- **Money invariant:** `total_cents = subtotal_cents + platform_fee_cents` always.
- **Refund invariant:** sum of refunds for an order ≤ order total.
- **Ticket codes:** signed (HMAC/JWT) so a scanner can validate offline-ish and codes can't be forged.

---

## 4. Page-by-Page Wireframes (low-fidelity)

Notation: `[ ]` = button, `___` = input, `▢` = image.

### 4.1 Home
```
┌───────────────────────────────────────────────┐
│ LOGO        Browse  Categories  [List Event] ☰ │  ← sticky nav
├───────────────────────────────────────────────┤
│  ▢▢▢ HERO (beach/event video or image) ▢▢▢      │
│     "Discover the best events in                │
│      Turks & Caicos"                            │
│   ┌─────────────────────────────────────────┐  │
│   │ 🔍 Search ___  📅 Date ▾  📍 Island ▾ [Go]│  │  ← prominent search
│   └─────────────────────────────────────────┘  │
├───────────────────────────────────────────────┤
│  CATEGORIES  🎵 🎉 ⛵ 🎪 🍴 🏆 👨‍👩‍👧 💼 🎭         │  ← horizontal scroll
├───────────────────────────────────────────────┤
│  ★ FEATURED EVENTS                              │
│  [card][card][card][card]  →                    │
├───────────────────────────────────────────────┤
│  UPCOMING EVENTS (grid)                         │
│  [card][card][card]                             │
│  [card][card][card]            [See all →]      │
├───────────────────────────────────────────────┤
│  ORGANIZER CTA banner                           │
│  "Hosting an event? Reach thousands."           │
│  [List Your Event]                              │
├───────────────────────────────────────────────┤
│  FOOTER: About | Legal | Help | Social          │
└───────────────────────────────────────────────┘
```
**Event card:** ▢ cover · category chip · title · date · venue · "from $XX" · [View].

### 4.2 Browse / Search results
```
┌───────────────────────────────────────────────┐
│ Filters (left, collapsible on mobile)          │
│  Category ☑  Date range  Price  Island/area    │
│  Free only ☐                                    │
├───────────────────────────────────────────────┤
│ Sort: [Date ▾]   Results: 42    [Map view ⊞]   │
│ [card] [card] [card]                            │
│ [card] [card] [card]                            │
│ ... pagination / infinite scroll                │
└───────────────────────────────────────────────┘
```

### 4.3 Event detail
```
┌───────────────────────────────────────────────┐
│  ▢▢▢ COVER IMAGE ▢▢▢                            │
│  Category chip · ★ Featured                     │
│  EVENT TITLE                                    │
│  📅 Sat Jul 12, 8:00 PM   📍 Venue, Provo       │
│  by [Organizer name] ✔ verified                 │
├──────────────────────────────┬────────────────┤
│  About this event            │  TICKETS        │
│  (rich description)          │  ┌────────────┐ │
│                              │  │ GA   $50 −1+│ │
│  📍 Map (Google embed)       │  │ VIP  $120−0+│ │
│  ▢ gallery thumbnails        │  │ Early $35  │ │  ← sticky on desktop
│                              │  └────────────┘ │
│  Organizer info / other      │  Subtotal $50   │
│  events                      │  Fee (5%) $2.50 │
│                              │  Total  $52.50  │
│                              │  [Get Tickets]  │
└──────────────────────────────┴────────────────┘
```

### 4.4 Checkout (multi-step)
```
Step 1 Tickets → Step 2 Details → Step 3 Payment → Step 4 Confirmation
┌───────────────────────────────────────────────┐
│ ① Your tickets        2 GA, 1 VIP   $170        │
│ ② Attendee details                              │
│    Buyer: name___ email___ phone___             │
│    Attendee names (per ticket) ___              │
│ ③ Payment (Stripe Elements)                     │
│    Card ____  [Pay $178.50]   🔒 secure          │
│ ④ ✅ Confirmed — tickets emailed + below         │
│    [Download tickets] [View in my account]      │
└───────────────────────────────────────────────┘
```
Guest checkout allowed; offer account creation post-purchase.

### 4.5 Customer dashboard
```
My Tickets (upcoming / past) · QR per ticket · [Request refund]
Order history · Profile/settings
```

### 4.6 Customer ticket view (the QR)
```
┌─────────────────────────┐
│  EVENT NAME             │
│  Sat Jul 12 · 8:00 PM   │
│  General Admission      │
│  Attendee: Jane Doe     │
│   ┌───────────────┐     │
│   │   ███ QR ███  │     │
│   └───────────────┘     │
│  Ticket #TCI-8F3A2      │
│  Status: VALID          │
└─────────────────────────┘
```

### 4.7 Organizer dashboard
```
Overview: tickets sold · gross · net (after fee) · next payout date
[+ Create Event]
Events list (status badges: Draft/Pending/Live/Completed)
  → per event: Sales, Attendees, Edit, [Open Scanner]
Payouts: history + scheduled + on-hold reasons
Settings / verification status
```

### 4.8 Create/Edit event (organizer wizard)
```
Step 1 Basics: title, category, description, cover image
Step 2 When & where: date/time, venue, map pin
Step 3 Tickets: add ticket types (name, price, qty, window, max/order)
Step 4 Review & Submit → status = pending_review
```

### 4.9 Scanner (PWA)
```
┌─────────────────────────┐
│  Scanning: EVENT NAME   │
│   [ camera viewfinder ] │
│   ✅ VALID — Jane Doe    │   (green flash + sound)
│   or ⛔ ALREADY USED     │   (red flash)
│   or ❌ INVALID TICKET   │
│  Scanned: 312 / 500     │
│  [Manual code entry]    │
└─────────────────────────┘
```

### 4.10 Admin dashboard
```
Sidebar: Dashboard · Organizers · Events · Orders · Refunds ·
         Payouts · Disputes · Users · Reports · Settings · Audit log

Dashboard: GMV, platform revenue, pending approvals (badge counts),
           open refunds, on-hold payouts, fraud alerts.

Organizers: queue of pending verifications → [Approve][Reject][Request info]
Events:     queue of pending events → preview → [Approve][Reject + reason][Feature]
Refunds:    queue → view order → [Full][Partial $__][Approve][Reject] + reason
Payouts:    scheduled list → [Release][Hold + reason]
Disputes:   chargebacks → submit evidence
Users:      search → [Suspend][Ban]
```

---

## 5. UI/UX Design System ("Tropical Luxury")

### 5.1 Brand direction
Premium coastal/luxury-tourism feel — think boutique resort website, not a busy ticket site.
Generous whitespace, big imagery, confident typography, restrained accents.

### 5.2 Color palette
| Token | Hex | Use |
|---|---|---|
| `--ocean-900` | `#0B3C5D` | deep headers, footer |
| `--ocean-600` | `#1B7FA8` | primary brand |
| `--ocean-400` | `#3FB6D3` | accents, links |
| `--turquoise` | `#36C2CE` | highlights, hero gradient |
| `--sand-100` | `#F7F1E6` | section backgrounds |
| `--gold-500` | `#C9A227` | premium accents, "Featured", CTAs |
| `--white` | `#FFFFFF` | base surface |
| `--ink-900` | `#0E1726` | primary text |
| `--ink-500` | `#5B6675` | secondary text |
| `--success` `--warn` `--danger` | `#1FA971` `#E8A33D` `#D64545` | states |

Primary CTA = ocean gradient or gold for "premium" actions. Use gold sparingly.

### 5.3 Typography
- **Display/headings:** a refined serif or premium sans (e.g. *Fraunces*, *Playfair Display*,
  or *Clash Display*) for that luxury-resort tone.
- **Body/UI:** *Inter* or *Geist* — clean, highly legible, mobile-friendly.
- Scale: 12 / 14 / 16 / 18 / 24 / 32 / 48 / 64. Line-height 1.5 body, 1.1–1.2 headings.

### 5.4 Components (build with shadcn/ui + Tailwind tokens)
Buttons (primary/secondary/ghost/danger), inputs, select, date picker, modal/drawer,
toast, badge/chip (category + status), card (event), stepper, table (admin), tabs,
avatar, file upload, empty states, skeleton loaders, QR display.

### 5.5 Principles
- **Mobile-first** (most discovery is via phone from Instagram/WhatsApp links).
- **Fast:** optimized images (next/image + Cloudflare), ISR for event pages, lazy-load below fold.
- **Accessible:** WCAG AA contrast, focus states, semantic markup, alt text.
- **Trust signals everywhere:** "verified organizer" badges, secure-checkout lock, clear fees.
- **Shareable:** every event page has rich Open Graph tags so Instagram/WhatsApp/FB links
  render a beautiful preview card (this is your primary growth channel).

### 5.6 Spacing/radius/shadow
8px spacing grid; radius `lg`(12px) cards, `full` chips; soft shadows for elevation, never harsh.

---

## 6. Admin Workflow

### 6.1 Organizer verification
```
Organizer signs up → uploads gov ID, business info, bank details, contact
   → status = pending  → admin notified
Admin reviews docs → Approve / Reject / Request more info
   Approve → organizer can publish events; Stripe Connect onboarding triggered
   Reject  → reason logged, organizer notified
```

### 6.2 Event approval
```
Organizer submits event → status = pending_review → admin queue
Admin previews (as it will appear publicly)
   Approve → status = approved → goes live at published_at; optional [Feature]
   Reject  → reason required → organizer notified → can edit & resubmit
```
> *Optional automation:* auto-approve events from `trusted`-tier organizers, manual review
> only for `new` organizers. Reduces your workload as you scale.

### 6.3 Daily admin operating rhythm
1. Clear pending organizer + event approval queues.
2. Review open refund requests.
3. Review/release scheduled payouts; investigate any on-hold.
4. Check fraud alerts & open disputes.
5. Glance at GMV / revenue dashboard.

### 6.4 Fraud & safety controls
- New organizers can't be paid until **after** their event + clearing window.
- Velocity checks: many high-value purchases from one card/IP → flag.
- Mismatched buyer vs card name, disposable emails → flag.
- Manual "suspend account / freeze payout" controls with audit logging.
- All admin actions written to immutable `audit_logs`.

---

## 7. Payment Workflow (Stripe Connect, Option A)

### 7.1 Money flow
```
Customer pays $52.50  ($50 ticket + $2.50 platform fee)
        │
        ▼
Stripe charges card → funds land in TCIEvents Stripe balance
        │  (application_fee / your $2.50 retained by platform)
        ▼
Funds HELD until payout window:
   • New organizer: event_end + 2–3 business days
   • Trusted organizer: weekly schedule
        │
        ▼
Stripe Transfer to organizer's connected account → payout to their bank
   (minus platform fee, minus any refunds, minus holds)
```

### 7.2 Purchase sequence
```
1. Customer selects tickets → server creates `order` (status=pending),
   reserves inventory in a DB transaction.
2. Server creates Stripe PaymentIntent (amount = total, application_fee = platform fee,
   transfer_data → organizer's connected account)  [Destination charge]
   — OR separate charge + later transfer (more control over holds).
3. Stripe Elements collects card → confirm payment client-side.
4. Stripe webhook `payment_intent.succeeded` → server marks order `paid`,
   generates tickets + signed QR, sends confirmation email.  (idempotent)
5. On failure/timeout → release reserved inventory.
```

### 7.3 Why "separate charges & transfers" may beat destination charges here
Because you intentionally **hold funds and pay out on a delay with possible holds**, the
*separate charges + manual transfers* pattern gives you direct control: you charge the customer
to the platform, hold, then create a `Transfer` to the organizer exactly when your payout rules
say so (and skip/partial it if there's a dispute). Destination charges auto-route money, which
fights your hold model. **Recommendation: separate charges + scheduled manual transfers.**

### 7.4 Payout job
A scheduled background job runs daily:
- Find events whose end + clearing window has passed (new) or whose weekly date hit (trusted).
- Compute `net = gross − platform_fee − refunds`.
- Skip/hold if open dispute, fraud flag, or pending refund.
- Create Stripe Transfer; write `payouts` row; notify organizer.

---

## 8. Refund Workflow (TCIEvents-controlled)

```
Customer requests refund (from ticket/order page) → refund row status=requested
        │
        ▼
Admin reviews in dashboard:
   • sees order, event, reason, customer history
   • chooses Full or Partial (amount_cents), or Reject
        │
   Approve ──► Stripe refund created (status=processing)
        │       on webhook `charge.refunded` → status=completed
        │       ticket status → refunded (QR invalidated, can't be scanned)
        │       adjust organizer payout (deduct from net or claw back)
        │
   Reject  ──► reason logged, customer notified
```

### 8.1 Policy automation hooks
- **Event cancelled by organizer / admin** → auto-create full refunds for all tickets,
  reverse any payout, notify all buyers.
- **Event postponed** → offer "keep ticket (new date)" or "refund" choice.
- **Duplicate purchase / fraud** → admin one-click full refund + optional account flag.
- Refund window rules (e.g. "no refunds within 48h of event unless cancelled") enforced in UI +
  surfaced from your Refund Policy page.

### 8.2 Chargeback handling
Stripe dispute webhook → create `disputes` row → admin uploads evidence (ticket purchase
record, scan log, terms acceptance) → outcome recorded → if lost, reconcile against payout.

---

## 9. Ticketing & QR System

### 9.1 Ticket generation (on order paid)
- For each admission: create `tickets` row with unique `ticket_code`.
- `qr_payload` = **signed token**: `JWT{ ticket_id, event_id, iat }` signed with a server secret
  (HMAC). The QR encodes this token — it **cannot be forged or guessed**.
- Render QR via `qrcode` lib; deliver in email (React Email) + customer dashboard + PDF option.

### 9.2 Check-in / scan validation
```
Scanner reads QR → POST /api/scan { token, event_id, device }
Server:
  1. Verify signature → reject if tampered (INVALID)
  2. Look up ticket → reject if not found / wrong event (WRONG EVENT)
  3. If status=refunded/void → reject (REFUNDED/VOID)
  4. If status=used → reject (ALREADY USED) + show original check-in time
  5. Else → set status=used, checked_in_at, checked_in_by → ACCEPTED
  6. Write scan_logs row (every attempt, success or fail)
Use Redis lock / DB row lock to prevent double-scan race at the door.
```
- **Offline tolerance:** scanner PWA can cache valid ticket hashes per event and sync; for MVP,
  require connectivity (Provo has decent coverage) and keep it simple.
- Only the event's organizer/staff can scan that event's tickets (scoped auth).

---

## 10. Security Requirements (implementation)

| Area | Control |
|---|---|
| **Auth** | Managed provider (Clerk/Supabase); email verification; mandatory 2FA for admin + organizers |
| **Authorization** | Server-side RBAC on every protected route; never trust client role |
| **Payments** | All Stripe ops server-side; PCI scope minimized via Stripe Elements; verify webhook signatures |
| **Idempotency** | Webhook event log keyed by external id; payout/refund operations idempotent |
| **PII / KYC** | ID & bank docs in private bucket, signed short-lived URLs; store tokens/last4 not raw numbers; encrypt at rest |
| **Fraud** | Velocity limits, IP/email reputation, buyer/card-name mismatch flags, manual freeze, new-organizer payout hold |
| **Inventory** | Transactional decrement to prevent overselling |
| **Tickets** | Cryptographically signed QR; scan idempotency; per-event scoped scanning |
| **App** | Rate limiting (Redis), input validation (Zod), output encoding, CSRF on mutations, security headers/CSP |
| **Secrets** | In platform secret manager / env, never in repo or client bundle |
| **Audit** | Immutable `audit_logs` for all admin/money actions |
| **Backups** | Automated daily Postgres backups + point-in-time recovery |
| **Compliance** | Privacy Policy, cookie consent, data-deletion process, PCI-DSS SAQ-A via Stripe |

---

## 11. Legal Pages

Have a lawyer review; these are the documents you need and what each must cover:

1. **Terms & Conditions** — platform usage, account rules, liability limits, dispute terms,
   governing law (note your US-entity choice affects this).
2. **Organizer Agreement** — TCIEvents as payment facilitator collecting funds; fee (5%);
   payout schedule (new vs trusted, holds for fraud/chargeback/disputes); organizer
   responsibilities (accurate listings, event delivery); KYC requirements; indemnity.
3. **Privacy Policy** — data collected, payment data handled by Stripe, cookies/analytics,
   storage of ID docs, user rights, retention, deletion.
4. **Refund Policy** — TCIEvents handles all refunds; eligible scenarios; timelines;
   cancelled/postponed event handling; no-refund windows; how to request.

Plus recommended: **Cookie notice**, **Acceptable Use / Content policy**.

---

## 12. Development Roadmap (MVP → Full Product)

### Phase 0 — Foundations (Weeks 1–2)
- Decide payment path (Option A recommended) → **incorporate US entity, open bank, apply for
  Stripe Connect.** (Start this immediately — it has lead time.)
- Set up repo, Next.js + TypeScript + Tailwind + Prisma + Postgres, auth, CI/CD, Sentry.
- Build the design system (tokens, core components).
- Build the `PaymentProvider` abstraction.

### Phase 1 — MVP (Weeks 3–8) — "discover + buy + scan"
Goal: a real customer can find an event and buy a ticket; an organizer can sell and scan.
- Public: home, browse/search, event detail (with map + OG tags).
- Auth + roles (customer, organizer, admin).
- Organizer: signup + verification submission, create event wizard, ticket types.
- Admin: approve organizers, approve events, basic dashboard.
- Checkout: Stripe payment, order + ticket creation, **signed QR**, confirmation email.
- Customer: my tickets + QR view.
- Scanner: PWA scan + validate + mark used + scan logs.
- Legal pages live.
**This is launchable** — even with manual payouts/refunds done by you in Phase 1.

### Phase 2 — Money operations (Weeks 9–12)
- Refund system (customer request → admin approve/partial → Stripe refund → QR invalidate).
- Payout engine (scheduled jobs, new vs trusted tiers, holds).
- Platform revenue + sales reporting dashboards.
- Dispute/chargeback handling.
- Fraud flags + account suspend/freeze.

### Phase 3 — Growth & polish (Weeks 13–20)
- Featured/promoted events, categories landing pages, SEO sitemap.
- Advanced search/filters (upgrade to Typesense/Algolia if needed).
- Email marketing / event reminders / "events near you".
- Organizer analytics, sales widgets, discount/promo codes.
- SMS ticket delivery, Apple/Google Wallet passes.
- Reviews/ratings, favorites/wishlists, guest checkout polish.
- Mobile app (optional — PWA may be enough initially).

### Phase 4 — Scale & moat
- Multi-island / regional expansion, multi-currency.
- Trusted-organizer auto-approval, self-serve payout dashboards.
- Recommendations, abandoned-cart recovery, loyalty.
- Public API / partnerships with resorts & tourism boards.

### Suggested team
MVP: 1–2 full-stack engineers + 1 designer (part-time) + you (PM/ops). Add a second engineer
in Phase 2 for the money-operations surface.

---

## 13. Top Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **Stripe unavailable in TCI** | Incorporate US entity (Option A) or use WiPay/PayPal (B/C) behind the provider abstraction |
| Holding other people's money = regulatory exposure | US entity + Stripe Connect shifts much of KYC/AML to Stripe; get legal advice on money-transmission |
| Chargeback losses | New-organizer payout holds, scan-log evidence, clear terms acceptance at checkout |
| Cold-start (no events) | Manually onboard 10–20 anchor organizers (resorts/clubs) pre-launch; concierge create their first events |
| Discovery depends on social | Beautiful OG share cards, organizer "share kit," QR posters; don't fight Instagram — feed it |
| Overselling / double-entry | DB transactions + signed QR + scan idempotency |
| Admin overload as you grow | Trusted-tier auto-approval, automation hooks |

---

## 14. Immediate Next Actions (this week)
1. **Choose the payment path** (A/B/C above) — this unblocks everything. (Recommend A.)
2. If Option A: start US incorporation + Stripe Connect application (lead time).
3. Lock the brand (logo, the palette/fonts above) and confirm domain/email.
4. Line up 10–20 launch organizers to seed the catalog.
5. Greenlight Phase 0 build.
