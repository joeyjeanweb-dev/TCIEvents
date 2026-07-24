/**
 * TCIEvents — sample event data (Phase 1, fake data only).
 *
 * This is the ONE place to edit the events shown across the whole site
 * (homepage, discover, event details). ~15 believable Turks & Caicos events
 * spread across islands, categories, price points and availability states.
 *
 * All images live in /public/events/ and are referenced by absolute path.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Category =
  | "music"
  | "nightlife"
  | "boat"
  | "food"
  | "festival"
  | "sports"
  | "family"
  | "arts"
  | "business";

export type Island =
  | "Providenciales"
  | "Grand Turk"
  | "North Caicos"
  | "Salt Cay";

export type EventStatus = "available" | "almost_sold_out" | "sold_out";

export type TicketType = {
  name: string; // "General Admission", "VIP"
  priceUSD: number; // 0 = free
  soldOut?: boolean;
};

export type SampleEvent = {
  id: string;
  slug: string; // used in the URL, e.g. "full-moon-beach-party"
  title: string;
  category: Category;
  coverImage: string; // path in /public
  gallery: string[]; // 2–5 more images
  organizer: string; // display name
  organizerVerified: boolean;
  venueName: string;
  island: Island;
  address: string;
  lat: number;
  lng: number;
  startAt: string; // ISO datetime
  endAt: string;
  description: string; // a few short paragraphs
  featured: boolean;
  ticketTypes: TicketType[];
  status: EventStatus;
};

// ---------------------------------------------------------------------------
// Category metadata (label + emoji for chips, used site-wide)
// ---------------------------------------------------------------------------

export type CategoryMeta = {
  key: Category;
  label: string;
  emoji: string;
};

export const CATEGORIES: CategoryMeta[] = [
  { key: "music", label: "Music", emoji: "🎵" },
  { key: "nightlife", label: "Nightlife", emoji: "🎉" },
  { key: "boat", label: "Boat & Water", emoji: "⛵" },
  { key: "food", label: "Food & Dining", emoji: "🍴" },
  { key: "festival", label: "Festival", emoji: "🎪" },
  { key: "sports", label: "Sports", emoji: "🏆" },
  { key: "family", label: "Family", emoji: "👨‍👩‍👧" },
  { key: "arts", label: "Arts & Culture", emoji: "🎭" },
  { key: "business", label: "Business", emoji: "💼" },
];

export const CATEGORY_MAP: Record<Category, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c]),
) as Record<Category, CategoryMeta>;

export const ISLANDS: Island[] = [
  "Providenciales",
  "Grand Turk",
  "North Caicos",
  "Salt Cay",
];

// ---------------------------------------------------------------------------
// The events
// ---------------------------------------------------------------------------

export const SAMPLE_EVENTS: SampleEvent[] = [
  {
    id: "evt-001",
    slug: "full-moon-beach-party",
    title: "Full Moon Beach Party",
    category: "nightlife",
    coverImage: "/events/full-moon-beach-party.jpg",
    gallery: [
      "/events/gallery-party-1.jpg",
      "/events/gallery-party-2.jpg",
      "/events/gallery-drinks.jpg",
    ],
    organizer: "Ocean Club Events",
    organizerVerified: true,
    venueName: "Grace Bay Beach",
    island: "Providenciales",
    address: "Grace Bay Rd, Providenciales, TCI",
    lat: 21.7947,
    lng: -72.173,
    startAt: "2026-08-29T20:00:00-04:00",
    endAt: "2026-08-30T01:00:00-04:00",
    description:
      "Dance barefoot under a full Caribbean moon on the world-famous sands of Grace Bay. Our resident DJs spin deep house and Afrobeats until the small hours while fire dancers light up the shoreline.\n\nExpect craft cocktails from the beach bar, a bonfire lounge, and the softest white sand in Turks & Caicos beneath your feet. Arrive early for the sunset set.",
    featured: true,
    ticketTypes: [
      { name: "General Admission", priceUSD: 45 },
      { name: "VIP Cabana (seats 4)", priceUSD: 120 },
    ],
    status: "available",
  },
  {
    id: "evt-002",
    slug: "sunset-catamaran-cruise",
    title: "Sunset Catamaran Cruise",
    category: "boat",
    coverImage: "/events/sunset-catamaran-cruise.jpg",
    gallery: [
      "/events/gallery-beach-1.jpg",
      "/events/gallery-beach-2.jpg",
      "/events/gallery-drinks.jpg",
    ],
    organizer: "Turquoise Sailing Co.",
    organizerVerified: true,
    venueName: "Blue Haven Marina",
    island: "Providenciales",
    address: "Leeward Going Through, Providenciales, TCI",
    lat: 21.8365,
    lng: -72.1497,
    startAt: "2026-08-15T17:30:00-04:00",
    endAt: "2026-08-15T20:00:00-04:00",
    description:
      "Glide across glassy turquoise water aboard a luxury 55-foot catamaran as the sun melts into the horizon. Open bar, island canapés, and a snorkel stop at a secluded reef are all included.\n\nLimited to 30 guests for an unhurried, intimate evening on the water. Bring a light layer for the sail home under the stars.",
    featured: true,
    ticketTypes: [
      { name: "Adult", priceUSD: 95 },
      { name: "Child (under 12)", priceUSD: 55 },
    ],
    status: "almost_sold_out",
  },
  {
    id: "evt-003",
    slug: "island-reggae-nights",
    title: "Island Reggae Nights",
    category: "music",
    coverImage: "/events/island-reggae-nights.jpg",
    gallery: [
      "/events/gallery-concert.jpg",
      "/events/gallery-party-1.jpg",
      "/events/gallery-celebrate.jpg",
    ],
    organizer: "Bambarra Sound",
    organizerVerified: true,
    venueName: "The Sandbar",
    island: "Providenciales",
    address: "Turtle Cove, Providenciales, TCI",
    lat: 21.7889,
    lng: -72.2071,
    startAt: "2026-08-22T19:00:00-04:00",
    endAt: "2026-08-22T23:30:00-04:00",
    description:
      "A laid-back evening of live roots reggae and lovers rock featuring the islands' best bands. Rum punch flows, the grill fires up, and the whole community turns out to sway under the palms.\n\nFamily-friendly early, party vibes late. A true taste of Turks & Caicos culture.",
    featured: false,
    ticketTypes: [
      { name: "General Admission", priceUSD: 30 },
      { name: "Front Row Table", priceUSD: 60 },
    ],
    status: "available",
  },
  {
    id: "evt-004",
    slug: "conch-festival",
    title: "Conch Festival",
    category: "festival",
    coverImage: "/events/conch-festival.jpg",
    gallery: [
      "/events/gallery-food.jpg",
      "/events/gallery-celebrate.jpg",
      "/events/gallery-beach-3.jpg",
    ],
    organizer: "TCI Tourist Board",
    organizerVerified: true,
    venueName: "Blue Hills Beachfront",
    island: "Providenciales",
    address: "Blue Hills Rd, Providenciales, TCI",
    lat: 21.833,
    lng: -72.25,
    startAt: "2026-11-14T11:00:00-05:00",
    endAt: "2026-11-14T22:00:00-05:00",
    description:
      "The islands' most-loved food festival celebrates the mighty conch in every form — cracked, fritters, ceviche and chowder. Cheer on the conch-blowing contest, watch live cracking demos, and vote for the best chef in TCI.\n\nFree to enter, with a VIP tasting pass for unlimited samples and a shaded lounge. Live bands all day.",
    featured: true,
    ticketTypes: [
      { name: "Free Entry", priceUSD: 0 },
      { name: "VIP Tasting Pass", priceUSD: 15 },
    ],
    status: "available",
  },
  {
    id: "evt-005",
    slug: "fine-dining-on-the-beach",
    title: "Fine Dining on the Beach — A 5-Course Journey",
    category: "food",
    coverImage: "/events/fine-dining-beach.jpg",
    gallery: [
      "/events/gallery-food.jpg",
      "/events/gallery-drinks.jpg",
      "/events/gallery-beach-4.jpg",
    ],
    organizer: "Coral Reef Culinary",
    organizerVerified: true,
    venueName: "Long Bay Dunes",
    island: "Providenciales",
    address: "Long Bay Hills, Providenciales, TCI",
    lat: 21.7717,
    lng: -72.1503,
    startAt: "2026-09-19T18:30:00-04:00",
    endAt: "2026-09-19T22:00:00-04:00",
    description:
      "An intimate five-course tasting menu served at a single long table set on the sand, lit only by lanterns and starlight. Each course pairs the day's freshest local catch with hand-selected wines.\n\nGuided by an award-winning chef, this is the islands' most exclusive dining experience — just 24 seats.",
    featured: true,
    ticketTypes: [{ name: "Seat at the Table", priceUSD: 180, soldOut: true }],
    status: "sold_out",
  },
  {
    id: "evt-006",
    slug: "grand-turk-live-band",
    title: "Grand Turk Cruise Port Live Band",
    category: "music",
    coverImage: "/events/grand-turk-live-band.jpg",
    gallery: [
      "/events/gallery-concert.jpg",
      "/events/gallery-celebrate.jpg",
      "/events/gallery-beach-2.jpg",
    ],
    organizer: "Grand Turk Live",
    organizerVerified: false,
    venueName: "Cruise Center Plaza",
    island: "Grand Turk",
    address: "Cruise Center, Grand Turk, TCI",
    lat: 21.4297,
    lng: -71.1461,
    startAt: "2026-10-03T18:00:00-05:00",
    endAt: "2026-10-03T21:00:00-05:00",
    description:
      "Rip-roaring rake-and-scrape and calypso from local legends right on the Grand Turk waterfront. A free-spirited evening of dancing, cold Turk's Head beer and ocean breeze.\n\nPerfect for cruise visitors and locals alike. Bring your dancing shoes.",
    featured: false,
    ticketTypes: [{ name: "General Admission", priceUSD: 25 }],
    status: "available",
  },
  {
    id: "evt-007",
    slug: "kite-surfing-championship",
    title: "Long Bay Kite Surfing Championship",
    category: "sports",
    coverImage: "/events/kite-surfing-championship.jpg",
    gallery: [
      "/events/gallery-beach-1.jpg",
      "/events/gallery-beach-4.jpg",
      "/events/gallery-celebrate.jpg",
    ],
    organizer: "Long Bay Kite Club",
    organizerVerified: true,
    venueName: "Long Bay Beach",
    island: "Providenciales",
    address: "Long Bay Beach, Providenciales, TCI",
    lat: 21.755,
    lng: -72.12,
    startAt: "2026-11-07T09:00:00-05:00",
    endAt: "2026-11-08T17:00:00-05:00",
    description:
      "The Caribbean's top riders descend on Long Bay's flat, waist-deep turquoise water for two days of freestyle and racing. Spectators get grandstand views, food trucks, and a beginner taster zone.\n\nOne of the most photogenic sporting events in the region — a riot of colour against the blue.",
    featured: false,
    ticketTypes: [
      { name: "Spectator", priceUSD: 20 },
      { name: "Grandstand Seat", priceUSD: 45 },
    ],
    status: "available",
  },
  {
    id: "evt-008",
    slug: "kids-ocean-day-festival",
    title: "Kids' Ocean Day Festival",
    category: "family",
    coverImage: "/events/kids-ocean-day.jpg",
    gallery: [
      "/events/gallery-beach-2.jpg",
      "/events/gallery-beach-3.jpg",
      "/events/gallery-celebrate.jpg",
    ],
    organizer: "TCI Reef Fund",
    organizerVerified: true,
    venueName: "Bight Children's Park",
    island: "Providenciales",
    address: "The Bight, Providenciales, TCI",
    lat: 21.7853,
    lng: -72.1961,
    startAt: "2026-09-12T10:00:00-04:00",
    endAt: "2026-09-12T15:00:00-04:00",
    description:
      "A free, joyful day of ocean-themed fun for the whole family — sandcastle contests, touch tanks, face painting, a marine-life parade and junior snorkel lessons in the shallows.\n\nRun by the reef conservation team, every activity teaches kids to love and protect our waters. Free entry, all ages.",
    featured: false,
    ticketTypes: [{ name: "Free Entry", priceUSD: 0 }],
    status: "available",
  },
  {
    id: "evt-009",
    slug: "new-years-eve-gala",
    title: "New Year's Eve Gala",
    category: "nightlife",
    coverImage: "/events/new-years-eve-gala.jpg",
    gallery: [
      "/events/gallery-party-2.jpg",
      "/events/gallery-drinks.jpg",
      "/events/gallery-celebrate.jpg",
    ],
    organizer: "Grace Bay Resort Collection",
    organizerVerified: true,
    venueName: "Grace Bay Ballroom & Terrace",
    island: "Providenciales",
    address: "Grace Bay Rd, Providenciales, TCI",
    lat: 21.7961,
    lng: -72.1789,
    startAt: "2026-12-31T20:00:00-05:00",
    endAt: "2027-01-01T01:30:00-05:00",
    description:
      "Ring in 2027 in black-tie style on the terrace at Grace Bay. A champagne reception, gourmet dinner, live orchestra and a midnight fireworks display over the ocean.\n\nThe island's premier New Year celebration. VIP tables include a private bar and front-row fireworks seating.",
    featured: true,
    ticketTypes: [
      { name: "Gala Admission", priceUSD: 150 },
      { name: "VIP Table (seats 8)", priceUSD: 350 },
    ],
    status: "almost_sold_out",
  },
  {
    id: "evt-010",
    slug: "local-art-craft-market",
    title: "Local Art & Craft Market",
    category: "arts",
    coverImage: "/events/art-craft-market.jpg",
    gallery: [
      "/events/gallery-celebrate.jpg",
      "/events/gallery-food.jpg",
      "/events/gallery-beach-3.jpg",
    ],
    organizer: "Made in TCI Collective",
    organizerVerified: false,
    venueName: "Da Conch Shack Lawn",
    island: "Providenciales",
    address: "Blue Hills, Providenciales, TCI",
    lat: 21.8342,
    lng: -72.2489,
    startAt: "2026-08-30T10:00:00-04:00",
    endAt: "2026-08-30T16:00:00-04:00",
    description:
      "Browse handmade jewellery, sea-glass art, straw work, paintings and island preserves from over 40 local makers. Meet the artists, watch live demos and enjoy acoustic music all afternoon.\n\nFree to wander. Support the talented hands of Turks & Caicos.",
    featured: false,
    ticketTypes: [{ name: "Free Entry", priceUSD: 0 }],
    status: "available",
  },
  {
    id: "evt-011",
    slug: "deep-sea-fishing-tournament",
    title: "Deep Sea Fishing Tournament",
    category: "sports",
    coverImage: "/events/deep-sea-fishing.jpg",
    gallery: [
      "/events/gallery-beach-1.jpg",
      "/events/gallery-beach-4.jpg",
      "/events/gallery-drinks.jpg",
    ],
    organizer: "Caicos Anglers Association",
    organizerVerified: true,
    venueName: "South Side Marina",
    island: "Providenciales",
    address: "Long Bay Hills, Providenciales, TCI",
    lat: 21.7625,
    lng: -72.1372,
    startAt: "2026-10-24T06:30:00-05:00",
    endAt: "2026-10-24T18:00:00-05:00",
    description:
      "Teams battle the deep blue off the Caicos banks for marlin, wahoo, mahi and tuna in the islands' biggest game-fishing tournament. Weigh-in dockside party, prizes and a fresh-catch cookout follow.\n\nEntry is per team (up to 4 anglers). Spectators welcome at the dock party.",
    featured: false,
    ticketTypes: [{ name: "Team Entry (up to 4)", priceUSD: 250 }],
    status: "available",
  },
  {
    id: "evt-012",
    slug: "wine-and-jazz-evening",
    title: "Wine & Jazz Evening",
    category: "music",
    coverImage: "/events/wine-jazz-evening.jpg",
    gallery: [
      "/events/gallery-drinks.jpg",
      "/events/gallery-food.jpg",
      "/events/gallery-concert.jpg",
    ],
    organizer: "Cellar & Sea",
    organizerVerified: true,
    venueName: "The Vineyard Terrace",
    island: "Providenciales",
    address: "Grace Bay Rd, Providenciales, TCI",
    lat: 21.7936,
    lng: -72.1712,
    startAt: "2026-09-26T19:00:00-04:00",
    endAt: "2026-09-26T22:30:00-04:00",
    description:
      "A sophisticated evening of smooth live jazz paired with a curated flight of old-world wines and artisan cheese boards. Candlelit tables under the stars on a breezy garden terrace.\n\nPremium tickets add a sommelier-led tasting and reserved seating up front.",
    featured: false,
    ticketTypes: [
      { name: "General Admission", priceUSD: 65 },
      { name: "Premium (tasting + seat)", priceUSD: 110 },
    ],
    status: "almost_sold_out",
  },
  {
    id: "evt-013",
    slug: "junkanoo-street-parade",
    title: "Junkanoo Street Parade",
    category: "festival",
    coverImage: "/events/junkanoo-parade.jpg",
    gallery: [
      "/events/gallery-celebrate.jpg",
      "/events/gallery-party-1.jpg",
      "/events/gallery-concert.jpg",
    ],
    organizer: "Grand Turk Cultural Committee",
    organizerVerified: true,
    venueName: "Front Street",
    island: "Grand Turk",
    address: "Front St, Cockburn Town, Grand Turk, TCI",
    lat: 21.4664,
    lng: -71.1389,
    startAt: "2026-12-26T16:00:00-05:00",
    endAt: "2026-12-26T21:00:00-05:00",
    description:
      "A dazzling explosion of colour, costume and rhythm as Junkanoo groups rush down Front Street with goatskin drums, brass and whistles. Grand Turk's proudest cultural tradition.\n\nFree to line the street and join the dance. Come early for the best spots.",
    featured: false,
    ticketTypes: [{ name: "Free — Street Viewing", priceUSD: 0 }],
    status: "available",
  },
  {
    id: "evt-014",
    slug: "yoga-and-wellness-retreat-day",
    title: "Yoga & Wellness Retreat Day",
    category: "family",
    coverImage: "/events/yoga-wellness-retreat.jpg",
    gallery: [
      "/events/gallery-yoga.jpg",
      "/events/gallery-beach-3.jpg",
      "/events/gallery-food.jpg",
    ],
    organizer: "Still Waters Wellness",
    organizerVerified: true,
    venueName: "Sandy Point Beach",
    island: "North Caicos",
    address: "Sandy Point, North Caicos, TCI",
    lat: 21.937,
    lng: -71.956,
    startAt: "2026-10-10T08:00:00-05:00",
    endAt: "2026-10-10T16:00:00-05:00",
    description:
      "Escape to serene North Caicos for a full day of beachfront yoga, guided meditation, sound healing and a nourishing plant-based lunch. All levels welcome; mats provided.\n\nA private session upgrade adds a one-to-one with our lead instructor and a spa treatment.",
    featured: false,
    ticketTypes: [
      { name: "Day Pass", priceUSD: 80 },
      { name: "Private Session Add-on", priceUSD: 150 },
    ],
    status: "available",
  },
  {
    id: "evt-015",
    slug: "beach-bonfire-and-bbq",
    title: "Beach Bonfire & BBQ",
    category: "food",
    coverImage: "/events/beach-bonfire-bbq.jpg",
    gallery: [
      "/events/gallery-bbq.jpg",
      "/events/gallery-party-2.jpg",
      "/events/gallery-beach-4.jpg",
    ],
    organizer: "Ocean Club Events",
    organizerVerified: true,
    venueName: "Taylor Bay Beach",
    island: "Providenciales",
    address: "Chalk Sound, Providenciales, TCI",
    lat: 21.7481,
    lng: -72.2739,
    startAt: "2026-09-05T17:00:00-04:00",
    endAt: "2026-09-05T22:00:00-04:00",
    description:
      "Gather round a roaring beach bonfire for a proper island cookout — jerk chicken, fresh grilled lobster, cracked conch and cold drinks as the sky turns pink over Taylor Bay.\n\nLive acoustic sets, lawn games and s'mores for the kids. The Family 4-Pack is the best value for groups.",
    featured: false,
    ticketTypes: [
      { name: "General Admission", priceUSD: 40 },
      { name: "Family 4-Pack", priceUSD: 140 },
    ],
    status: "available",
  },
];

// ---------------------------------------------------------------------------
// Helpers (used by cards, homepage, discover, detail pages)
// ---------------------------------------------------------------------------

/** Lowest ticket price for an event (0 = free). */
export function lowestPrice(event: SampleEvent): number {
  return Math.min(...event.ticketTypes.map((t) => t.priceUSD));
}

/** "Free" or "from $45" style label for cards. */
export function priceLabel(event: SampleEvent): string {
  const low = lowestPrice(event);
  if (low === 0) return "Free";
  const single = event.ticketTypes.length === 1;
  return `${single ? "" : "from "}$${low}`;
}

/** Format USD without unnecessary decimals (e.g. $45, $2.25). */
export function formatUSD(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  return Number.isInteger(rounded)
    ? `$${rounded}`
    : `$${rounded.toFixed(2)}`;
}

/**
 * Turks & Caicos runs on America/Grand_Turk time. We format every event date in
 * that fixed zone so the server and the browser always produce the same string
 * (a mismatch would cause a React hydration warning).
 */
export const TCI_TIME_ZONE = "America/Grand_Turk";

/** Short date for cards, e.g. "Sat, Aug 29". */
export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: TCI_TIME_ZONE,
  });
}

/** Time for cards, e.g. "8:00 PM". */
export function formatEventTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TCI_TIME_ZONE,
  });
}

export const STATUS_LABEL: Record<EventStatus, string> = {
  available: "Tickets available",
  almost_sold_out: "Almost sold out",
  sold_out: "Sold out",
};

export function getEventBySlug(slug: string): SampleEvent | undefined {
  return SAMPLE_EVENTS.find((e) => e.slug === slug);
}

export function getFeaturedEvents(): SampleEvent[] {
  return SAMPLE_EVENTS.filter((e) => e.featured);
}

/** Upcoming events sorted by start date (soonest first). */
export function getUpcomingEvents(): SampleEvent[] {
  return [...SAMPLE_EVENTS].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );
}

/** Other events by the same organizer (for "More from this organizer"). */
export function getEventsByOrganizer(
  organizer: string,
  excludeSlug?: string,
): SampleEvent[] {
  return SAMPLE_EVENTS.filter(
    (e) => e.organizer === organizer && e.slug !== excludeSlug,
  );
}
