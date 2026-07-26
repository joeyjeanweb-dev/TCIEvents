/**
 * static-map.ts — the arithmetic that turns a latitude/longitude into a picture
 * of a map, built from OpenStreetMap tile images (Step 3.4, revised).
 *
 * ---------------------------------------------------------------------------
 * Why this file exists
 * ---------------------------------------------------------------------------
 * Step 3.4 originally showed the venue in an `<iframe>` pointing at
 * OpenStreetMap's own embed page. That page's **zoom-out button doesn't work** —
 * confirmed on OpenStreetMap's site itself, so it's their bug, and code outside
 * an iframe can't reach in and fix a button inside it. A dead control on a
 * boutique-looking page is worse than no control, so the map is now a **static
 * picture we assemble ourselves**: no third-party JavaScript, no controls, and
 * therefore nothing that can look broken. `docs/02-Spec.md` §C.3 explicitly
 * allows this ("static map image is fine for Phase 1").
 *
 * Panning and zooming aren't lost — the card's **Larger map** and **Get
 * directions** buttons hand you to the full OpenStreetMap and Google Maps.
 *
 * ---------------------------------------------------------------------------
 * How a map is made of tiles ("slippy map" tiles)
 * ---------------------------------------------------------------------------
 * Every online map is a grid of small square images. At **zoom 0** the whole
 * world is one 256×256 tile. Each zoom level splits every tile into four, so at
 * zoom `z` the world is a 2^z × 2^z grid — zoom 15 is 32,768 tiles across. A
 * tile is addressed by its column and row at a zoom: `/{z}/{x}/{y}.png`.
 *
 * So "draw a map of Grace Bay" becomes:
 *   1. Work out where the venue falls on that giant world grid (in pixels).
 *   2. Decide the rectangle of pixels we want to show, centred on the venue.
 *   3. Work out which tiles that rectangle overlaps, and where each one sits
 *      inside it.
 *   4. Put a pin in the exact middle — which *is* the venue, by construction.
 *
 * Step 1 is the only real maths, and it's the standard **Web Mercator**
 * projection every web map uses:
 *   x grows evenly with longitude (easy: -180°→0, +180°→1).
 *   y uses a logarithm, because Mercator stretches the map more the further you
 *   get from the equator — the reason Greenland looks huge on a world map.
 *
 * Everything here is returned as **percentages**, not pixels, so the finished
 * map scales to whatever width the card happens to be — phone or desktop —
 * without any JavaScript measuring anything.
 *
 * ---------------------------------------------------------------------------
 * Using OpenStreetMap's tiles: what we owe them
 * ---------------------------------------------------------------------------
 * The tiles come free from OpenStreetMap's own servers, which run on donations.
 * Their Tile Usage Policy asks for two things we honour:
 *   - **Visible attribution** — the "© OpenStreetMap" credit rendered over the
 *     map in `components/VenueMap.tsx` is not decoration, it's required.
 *   - **No heavy or bulk use.** A sample site is fine. Before TCIEvents carries
 *     real traffic, the `TILE_URL` below should point at a paid tile host
 *     (MapTiler, Thunderforest, Mapbox…) or a self-hosted server. That's a
 *     one-line change here — see the note on `TILE_URL`.
 */

/** Tiles are 256×256 pixels — the long-standing convention for OSM raster tiles. */
export const TILE_SIZE = 256;

/**
 * Where tile images come from.
 *
 * `{z}/{x}/{y}` are replaced with the zoom, column and row. This is
 * OpenStreetMap's standard tile server; swapping to a paid provider before
 * launch means changing this one line (and its API key), and nothing else in
 * the app needs to know.
 */
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

/**
 * The visible rectangle, in map pixels, at the chosen zoom.
 *
 * 768 × 432 is 16:9, and at zoom 15 in Turks & Caicos covers roughly 3.4 km by
 * 1.9 km — close enough to see the venue's road and its neighbours, wide enough
 * to recognise where on the island you are. It's also the *native* size: on a
 * phone the picture is scaled down (which only ever looks sharper), and in the
 * desktop column it's shown at about its true size.
 */
const VIEW_WIDTH = 768;
const VIEW_HEIGHT = 432;

/** Street-level-ish. Higher = closer in. */
const DEFAULT_ZOOM = 15;

/** One tile image, positioned as a percentage of the visible rectangle. */
export type MapTile = {
  /** Stable key + the image URL. */
  url: string;
  /** Distance from the left edge of the map, as a % of its width. */
  leftPct: number;
  /** Distance from the top edge of the map, as a % of its height. */
  topPct: number;
};

export type StaticMapPlan = {
  /** Every tile needed to cover the visible rectangle, already positioned. */
  tiles: MapTile[];
  /** A tile's width as a % of the map's width (they're square, so see below). */
  tileWidthPct: number;
  /** A tile's height as a % of the map's height. */
  tileHeightPct: number;
  /** For a CSS `aspect-ratio`, e.g. "768 / 432" — reserves the right shape. */
  aspectRatio: string;
  /** The zoom level actually used. */
  zoom: number;
};

// ---------------------------------------------------------------------------
// Web Mercator: longitude/latitude → position on the world grid
// ---------------------------------------------------------------------------

/**
 * Longitude → horizontal position, measured in tiles from the left edge of the
 * world. A whole number means "exactly on a tile boundary"; 12.5 means "halfway
 * across tile 12".
 */
function lngToTileX(lng: number, zoom: number): number {
  return ((lng + 180) / 360) * 2 ** zoom;
}

/**
 * Latitude → vertical position, in tiles from the top of the world.
 *
 * The `log(tan + sec)` is the Mercator projection. Latitudes are clamped to
 * ±85.0511° because Mercator sends the actual poles to infinity — beyond that
 * limit the sum inside the logarithm explodes and the maths stops meaning
 * anything. (Irrelevant for Turks & Caicos at 21°N, but a helper shouldn't
 * return nonsense just because today's callers are all tropical.)
 */
function latToTileY(lat: number, zoom: number): number {
  const clamped = Math.min(85.05112878, Math.max(-85.05112878, lat));
  const rad = (clamped * Math.PI) / 180;
  const mercator = Math.log(Math.tan(rad) + 1 / Math.cos(rad));
  return ((1 - mercator / Math.PI) / 2) * 2 ** zoom;
}

// ---------------------------------------------------------------------------
// The plan
// ---------------------------------------------------------------------------

/**
 * Work out every tile needed to draw a map centred on one point, and where each
 * tile sits inside the picture.
 *
 * The venue always ends up at **dead centre** (50%, 50%) of the result, which is
 * why `VenueMap` can place the pin without doing any maths of its own.
 */
export function planStaticMap({
  lat,
  lng,
  zoom = DEFAULT_ZOOM,
}: {
  lat: number;
  lng: number;
  zoom?: number;
}): StaticMapPlan {
  // Where the venue sits on the world grid, in pixels rather than tiles.
  const centreX = lngToTileX(lng, zoom) * TILE_SIZE;
  const centreY = latToTileY(lat, zoom) * TILE_SIZE;

  // The top-left corner of the rectangle we're going to show. (Centring means
  // stepping back half the width and half the height from the venue.)
  const originX = centreX - VIEW_WIDTH / 2;
  const originY = centreY - VIEW_HEIGHT / 2;

  // Which tiles does that rectangle touch? `floor` gives the tile containing an
  // edge; the rectangle almost never lines up with tile boundaries, so this is
  // typically one more tile than the rectangle is wide.
  const firstTileX = Math.floor(originX / TILE_SIZE);
  const lastTileX = Math.floor((originX + VIEW_WIDTH - 1) / TILE_SIZE);
  const firstTileY = Math.floor(originY / TILE_SIZE);
  const lastTileY = Math.floor((originY + VIEW_HEIGHT - 1) / TILE_SIZE);

  /** How many tiles the world is wide/tall at this zoom. */
  const worldTiles = 2 ** zoom;

  const tiles: MapTile[] = [];

  for (let tileY = firstTileY; tileY <= lastTileY; tileY++) {
    // Above the north pole or below the south pole there is simply no tile.
    // Skipping leaves the card's sand background showing, which is the honest
    // result — better than requesting a URL that 404s.
    if (tileY < 0 || tileY >= worldTiles) continue;

    for (let tileX = firstTileX; tileX <= lastTileX; tileX++) {
      // Left/right *does* wrap: the world is a cylinder, so one step west of
      // tile 0 is the last tile on the other side of the antimeridian. `%` in
      // JavaScript can return a negative, hence the `+ worldTiles`.
      const wrappedX = ((tileX % worldTiles) + worldTiles) % worldTiles;

      tiles.push({
        url: TILE_URL.replace("{z}", String(zoom))
          .replace("{x}", String(wrappedX))
          .replace("{y}", String(tileY)),
        // Where this tile's own top-left corner falls inside our rectangle,
        // as a percentage. Tiles that hang off the left/top get a negative
        // percentage, which is exactly right — they're clipped by the card.
        leftPct: ((tileX * TILE_SIZE - originX) / VIEW_WIDTH) * 100,
        topPct: ((tileY * TILE_SIZE - originY) / VIEW_HEIGHT) * 100,
      });
    }
  }

  return {
    tiles,
    // A square tile is a different percentage of the width than of the height,
    // because the rectangle isn't square.
    tileWidthPct: (TILE_SIZE / VIEW_WIDTH) * 100,
    tileHeightPct: (TILE_SIZE / VIEW_HEIGHT) * 100,
    aspectRatio: `${VIEW_WIDTH} / ${VIEW_HEIGHT}`,
    zoom,
  };
}
