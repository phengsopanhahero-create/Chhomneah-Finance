/**
 * Rural Finance Hub Cambodia - Branch/Agent Location Scraper
 *
 * Queries the Google Places API (Text Search + Place Details) for each
 * institution in src/lib/data/institutions.ts and writes the results to:
 *   - scripts/output/service_locations.json (always)
 *   - the `service_locations` table in Supabase (if credentials are set)
 *
 * Usage:
 *   npm run scrape:locations             # all institutions
 *   npm run scrape:locations -- --type=bank
 *   npm run scrape:locations -- --slug=aba-bank
 *
 * Requires:
 *   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY  (Places API (New) enabled in Google Cloud Console)
 *
 * Optional (to also upsert into Supabase):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import { config } from "dotenv";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

config({ path: path.join(__dirname, "..", ".env.local") });
config();

import { createClient } from "@supabase/supabase-js";
import {
  INSTITUTIONS,
  type Institution,
  type InstitutionType,
} from "../src/lib/data/institutions";
import type { ServiceType } from "../src/types/database";

const PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const SEARCH_TEXT_URL = "https://places.googleapis.com/v1/places:searchText";
const PLACE_DETAILS_URL = "https://places.googleapis.com/v1/places";

// Map institution type -> service_locations.service_type.
// Wing/TrueMoney keep their dedicated legacy categories for backwards
// compatibility with existing map color/legend; everything else falls
// back to its institution type.
const SERVICE_TYPE_OVERRIDES: Record<string, ServiceType> = {
  "wing-bank": "wing",
  truemoney: "truemoney",
};

function resolveServiceType(institution: Institution): ServiceType {
  return SERVICE_TYPE_OVERRIDES[institution.slug] ?? institution.type;
}

interface PlaceTextSearchResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
}

interface PlaceDetailsResult {
  internationalPhoneNumber?: string;
  regularOpeningHours?: { weekdayDescriptions?: string[] };
}

interface ScrapedLocation {
  institution_slug: string;
  name: string;
  name_km: string;
  service_type: ServiceType;
  address: string;
  address_km: string | null;
  latitude: number;
  longitude: number;
  hours: string | null;
  phone: string | null;
}

async function textSearch(query: string): Promise<PlaceTextSearchResult[]> {
  const res = await fetch(SEARCH_TEXT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": PLACES_API_KEY!,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location",
    },
    body: JSON.stringify({
      textQuery: query,
      regionCode: "KH",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Places text search failed (${res.status}) for "${query}": ${body}`);
  }
  const data = await res.json();
  return (data.places ?? []) as PlaceTextSearchResult[];
}

async function placeDetails(placeId: string): Promise<PlaceDetailsResult> {
  const res = await fetch(`${PLACE_DETAILS_URL}/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": PLACES_API_KEY!,
      "X-Goog-FieldMask": "internationalPhoneNumber,regularOpeningHours",
    },
  });

  if (!res.ok) {
    return {};
  }
  return (await res.json()) as PlaceDetailsResult;
}

async function scrapeInstitution(
  institution: Institution,
  maxResults: number
): Promise<ScrapedLocation[]> {
  const results = await textSearch(institution.placesQuery);
  const serviceType = resolveServiceType(institution);

  const limited = results.slice(0, maxResults);
  const locations: ScrapedLocation[] = [];

  for (const place of limited) {
    if (!place.location || !place.formattedAddress) continue;

    const details = await placeDetails(place.id);
    locations.push({
      institution_slug: institution.slug,
      name: place.displayName?.text ?? institution.name,
      name_km: institution.name_km,
      service_type: serviceType,
      address: place.formattedAddress,
      address_km: null,
      latitude: place.location.latitude,
      longitude: place.location.longitude,
      hours: details.regularOpeningHours?.weekdayDescriptions?.join("; ") ?? null,
      phone: details.internationalPhoneNumber ?? institution.hotline ?? null,
    });
    // Be polite to the Places API rate limits.
    await new Promise((r) => setTimeout(r, 200));
  }

  return locations;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const typeArg = args.find((a) => a.startsWith("--type="))?.split("=")[1];
  const slugArg = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const maxArg = args.find((a) => a.startsWith("--max="))?.split("=")[1];

  return {
    type: typeArg as InstitutionType | undefined,
    slug: slugArg,
    maxResults: maxArg ? parseInt(maxArg, 10) : 5,
  };
}

async function main() {
  if (!PLACES_API_KEY) {
    console.error(
      "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set. Add it to .env.local before running this script."
    );
    process.exit(1);
  }

  const { type, slug, maxResults } = parseArgs();

  let institutions = INSTITUTIONS;
  if (type) institutions = institutions.filter((i) => i.type === type);
  if (slug) institutions = institutions.filter((i) => i.slug === slug);

  if (institutions.length === 0) {
    console.error("No institutions matched the given --type/--slug filters.");
    process.exit(1);
  }

  console.log(`Scraping branch/agent locations for ${institutions.length} institution(s)...`);

  const allLocations: ScrapedLocation[] = [];
  for (const institution of institutions) {
    console.log(`  -> ${institution.name} (${institution.placesQuery})`);
    try {
      const locations = await scrapeInstitution(institution, maxResults);
      console.log(`     found ${locations.length} location(s)`);
      allLocations.push(...locations);
    } catch (err) {
      console.error(`     failed: ${(err as Error).message}`);
    }
  }

  const outDir = path.join(__dirname, "output");
  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, "service_locations.json");
  await writeFile(outFile, JSON.stringify(allLocations, null, 2), "utf-8");
  console.log(`\nWrote ${allLocations.length} locations to ${outFile}`);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceRoleKey) {
    console.log("\nUpserting into Supabase service_locations table...");
    // Untyped client: the generated Database["..."]["Insert"] (Partial<Row>)
    // lacks an index signature, which makes postgrest-js's GenericTable
    // constraint resolve to `never` for .insert(). Use an untyped client for
    // this write only; reads elsewhere keep full type safety.
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const rows = allLocations.map(({ institution_slug, ...row }) => row);
    const { error } = await supabase.from("service_locations").insert(rows);

    if (error) {
      console.error("Supabase insert failed:", error.message);
    } else {
      console.log(`Inserted ${rows.length} rows into service_locations.`);
    }
  } else {
    console.log(
      "\nSupabase credentials not set - skipping database upsert. " +
        "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable it."
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
