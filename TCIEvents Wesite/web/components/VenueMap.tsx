/**
 * VenueMap — the "where is this?" map on the Event Details page (Step 3.4).
 *
 * `docs/03-Wireframes.md` §4 puts a map under About; `docs/02-Spec.md` §C.3 asks
 * for a map and says a **static map image is fine for Phase 1**.
 *
 * ---------------------------------------------------------------------------
 * Why this is a static map and not an embedded interactive one
 * ---------------------------------------------------------------------------
 * The first version of this card was an `<iframe>` pointing at OpenStreetMap's
 * embed page. It looked right, but its **zoom-out (−) button doesn't work** —
 * and that's reproducible on OpenStreetMap's own site, so it's a bug in their
 * embed, not in this project. Nothing outside an iframe can fix a button inside
 * one: browsers isolate iframe content completely. On a page that's meant to
 * feel like a boutique resort, a control that visibly does nothing is worse than
 * no control at all.
 *
 * So the map is now a **picture we assemble ourselves** from OpenStreetMap tile
 * images — see `lib/static-map.ts` for the arithmetic. That means:
 *   - **Nothing to break.** No buttons, no third-party JavaScript on the page.
 *   - **Much lighter.** A dozen small PNGs instead of ~1.3 MB of map library.
 *   - **Still interactive, one tap away.** **Larger map** opens the real
 *     OpenStreetMap (pan and zoom all you like) and **Get directions** opens
 *     Google Maps, both in a new tab.
 *
 * ---------------------------------------------------------------------------
 * Details worth knowing
 * ---------------------------------------------------------------------------
 * - **The address is real text under the map.** If tiles are slow, blocked or
 *   you're offline, the venue name, the full address and both links still work.
 *   The picture is a bonus, never the only copy of the information.
 * - **The pin is always dead centre**, because `planStaticMap()` builds the
 *   picture around the venue. No positioning maths is needed here.
 * - **`loading="lazy"`** on the tiles: this card sits below the fold, so nothing
 *   is downloaded until you scroll near it. The card reserves its shape up front
 *   (`aspectRatio`), so the page doesn't jump when the tiles land.
 * - **`© OpenStreetMap` is required**, not decoration — see the note about their
 *   Tile Usage Policy in `lib/static-map.ts`.
 * - **Directions** use the coordinates rather than the street address, which is
 *   more reliable on small islands where road names repeat.
 *
 * Server component (no `"use client"`): it's markup with no state, so this ships
 * zero JavaScript.
 */

import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { planStaticMap } from "@/lib/static-map";

export function VenueMap({
  venueName,
  address,
  lat,
  lng,
}: {
  venueName: string;
  address: string;
  lat: number;
  lng: number;
}) {
  const map = planStaticMap({ lat, lng });

  /** "Open in Google Maps and route me there from wherever I am." */
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  /** The same spot on the full, interactive OpenStreetMap. */
  const largerMapHref = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${map.zoom}/${lat}/${lng}`;

  return (
    <div className="mt-4 overflow-hidden rounded-card border border-sand-200 shadow-soft">
      {/* ================= The map picture ================= */}
      {/* `aspectRatio` comes from the tile maths, so the box is exactly the
          shape of the picture we're about to draw — at any card width. */}
      <div
        className="relative w-full overflow-hidden bg-sand-100"
        style={{ aspectRatio: map.aspectRatio }}
      >
        {/* ---- The tiles ---- */}
        {map.tiles.map((tile, index) => (
          /* eslint-disable-next-line @next/next/no-img-element --
             Deliberately a plain <img>, not next/image: map tiles are already
             tiny, correctly-sized PNGs served from a CDN, so routing a dozen of
             them through Next's image optimiser would add server work and cache
             churn for no gain — and it would need the tile host added to
             `next.config.ts` as a remote pattern. */
          <img
            key={`${tile.leftPct}-${tile.topPct}-${index}`}
            src={tile.url}
            /* Decorative: the map's meaning is carried by the venue name and
               address below it, which a screen reader reads properly. Alt text
               on each of a dozen tiles would just be noise. */
            alt=""
            loading="lazy"
            /* Stops a click-drag from "picking the tile up" as an image, which
               would give away that this is a mosaic rather than one map. */
            draggable={false}
            className="absolute select-none"
            style={{
              left: `${tile.leftPct}%`,
              top: `${tile.topPct}%`,
              width: `${map.tileWidthPct}%`,
              height: `${map.tileHeightPct}%`,
            }}
          />
        ))}

        {/* ---- The pin ---- */}
        {/* `left-1/2 top-1/2` is the venue, because the picture was built around
            it. The two `-translate-*-1/2`s then pull the badge back by half its
            own width and height, so its *middle* sits on the spot rather than
            its top-left corner. (A teardrop-shaped marker would want its point
            there instead; a round badge reads correctly centred.) */}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ocean-600 text-white shadow-lift ring-2 ring-white">
            <MapPin className="h-5 w-5 fill-current" />
          </span>
        </span>

        {/* ---- Attribution (required by OpenStreetMap's tile policy) ---- */}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-0 right-0 rounded-tl-control bg-white/85 px-2 py-1 text-[11px] text-ink-500 backdrop-blur-sm transition-colors hover:text-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400"
        >
          © OpenStreetMap
        </a>
      </div>

      {/* ================= Address + actions ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-sand-200 bg-white px-5 py-4">
        <div className="flex min-w-0 gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ocean-600/10 text-ocean-700">
            <MapPin className="h-4.5 w-4.5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="font-medium text-ink-900">{venueName}</p>
            <p className="text-sm text-ink-500">{address}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={largerMapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-control px-3 py-2 text-sm font-medium text-ocean-600 transition-colors hover:bg-sand-100 hover:text-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400"
          >
            Larger map
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            {/* Read out by screen readers only — sighted users get the icon. */}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-control bg-ocean-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-2"
          >
            <Navigation className="h-4 w-4" aria-hidden />
            Get directions
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
