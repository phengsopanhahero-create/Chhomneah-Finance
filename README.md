# Rural Finance Hub Cambodia (ហាបហ្វាយណែនស៍ជនបទ)

Help rural Cambodians compare financial products, locate nearby financial services, and learn about finance — in Khmer and English.

## Setup

```bash
npm install
```

Copy the environment template and fill in your keys:

```bash
cp .env.example .env.local
```

Required values in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
TELEGRAM_BOT_TOKEN=
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=
```

> The app works without Supabase/Maps/Telegram configured — it falls back to static demo data bundled in `src/lib/data/`.

## Database (Supabase)

Run these in the Supabase SQL editor (in order):

```sql
-- 1. supabase/schema.sql
-- 2. supabase/seed.sql
```

## Run the app

```bash
npm run dev
```

Open http://localhost:3000

## Build for production

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## Run the Telegram bot

```bash
npm run bot
```

Requires `TELEGRAM_BOT_TOKEN` in `.env.local` (Supabase optional — falls back to static data).

## Data scrapers

The registry of banks, MFIs, digital wallets, and insurers lives in
[`src/lib/data/institutions.ts`](src/lib/data/institutions.ts). Two scripts
pull live data for these institutions:

### Branch/agent locations (Google Places API)

```bash
npm run scrape:locations              # all institutions
npm run scrape:locations -- --type=bank
npm run scrape:locations -- --slug=aba-bank --max=10
```

Requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` with **Places API (New)** enabled
in the Google Cloud Console. Writes results to
`scripts/output/service_locations.json`, and also upserts into the
`service_locations` table if `SUPABASE_SERVICE_ROLE_KEY` is set.

### Official website content (loan products & Khmer text)

```bash
npm run scrape:products                # all institutions
npm run scrape:products -- --type=mfi
npm run scrape:products -- --slug=prasac-mfi
```

Fetches each institution's official site and extracts headings, Khmer text
blocks, and loan/product links to `scripts/output/site_content/<slug>.json`.
Bank sites vary widely in structure (and some block bots), so this is a
research aid for building `loan_products` rows, not a fully automated import.
