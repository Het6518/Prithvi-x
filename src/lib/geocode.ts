import { cityGeocodeLookup } from "@/data/mock";

type GeoResult = { lat: number; lng: number } | null;

/**
 * Geocode a village/city name to lat/lng coordinates.
 * First checks the static lookup table, then falls back to OpenStreetMap Nominatim API (free, no key needed).
 * Appends ", India" to the query for better accuracy.
 */
export async function geocodeVillage(village: string): Promise<GeoResult> {
  if (!village || village.trim().length === 0) return null;

  const key = village.toLowerCase().trim();

  // 1. Check static lookup first (instant, no network call)
  if (cityGeocodeLookup[key]) {
    return cityGeocodeLookup[key];
  }

  // 2. Try OpenStreetMap Nominatim API (free, no API key needed)
  try {
    const query = encodeURIComponent(`${village.trim()}, India`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&countrycodes=in`,
      {
        headers: {
          "User-Agent": "PrithvixAgriTech/1.0 (contact@prithvix.com)"
        }
      }
    );

    if (!response.ok) {
      console.warn(`[Geocode] Nominatim returned ${response.status} for "${village}"`);
      return null;
    }

    const results = await response.json();

    if (results && results.length > 0) {
      const lat = parseFloat(results[0].lat);
      const lng = parseFloat(results[0].lon);

      if (!isNaN(lat) && !isNaN(lng)) {
        console.log(`[Geocode] Resolved "${village}" → ${lat}, ${lng}`);
        return { lat, lng };
      }
    }

    console.warn(`[Geocode] No results for "${village}"`);
    return null;
  } catch (error) {
    console.error(`[Geocode] Failed for "${village}":`, error);
    return null;
  }
}
