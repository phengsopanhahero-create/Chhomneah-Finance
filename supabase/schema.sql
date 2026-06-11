-- Rural Finance Hub Cambodia - Database Schema
-- Run this in the Supabase SQL editor

-- Enable PostGIS-free distance calc via lat/lng columns (simple haversine in app code)

create table if not exists loan_products (
  id uuid primary key default gen_random_uuid(),
  provider_name text not null,
  provider_type text not null check (provider_type in ('bank', 'mfi', 'digital_wallet')),
  product_name text not null,
  product_name_km text,
  interest_rate_min numeric(5,2) not null,
  interest_rate_max numeric(5,2) not null,
  term_min_months integer not null,
  term_max_months integer not null,
  min_amount numeric(12,2) not null,
  max_amount numeric(12,2) not null,
  description text,
  description_km text,
  created_at timestamptz not null default now()
);

create table if not exists service_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_km text,
  service_type text not null check (service_type in ('bank', 'mfi', 'wing', 'truemoney')),
  address text not null,
  address_km text,
  latitude double precision not null,
  longitude double precision not null,
  hours text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists education_topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_km text not null,
  summary_en text not null,
  summary_km text not null,
  content_en text not null,
  content_km text not null,
  icon text,
  sort_order integer not null default 0
);

create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  topic_slug text not null references education_topics(slug) on delete cascade,
  question_en text not null,
  question_km text not null,
  options_en text[] not null,
  options_km text[] not null,
  correct_index integer not null,
  sort_order integer not null default 0
);

-- Indexes
create index if not exists idx_service_locations_type on service_locations(service_type);
create index if not exists idx_loan_products_type on loan_products(provider_type);
create index if not exists idx_quiz_questions_topic on quiz_questions(topic_slug);

-- Row Level Security: public read access (no auth required to browse)
alter table loan_products enable row level security;
alter table service_locations enable row level security;
alter table education_topics enable row level security;
alter table quiz_questions enable row level security;

create policy "Public read access" on loan_products for select using (true);
create policy "Public read access" on service_locations for select using (true);
create policy "Public read access" on education_topics for select using (true);
create policy "Public read access" on quiz_questions for select using (true);
