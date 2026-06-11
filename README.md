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
