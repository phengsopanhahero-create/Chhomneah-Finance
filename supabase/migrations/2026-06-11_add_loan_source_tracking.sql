-- Track where each loan product's rates/terms came from and when they
-- were last verified against the provider's official website.
--
-- Safe to skip on fresh installs (schema.sql already includes these
-- columns).

alter table loan_products
  add column if not exists source_url text,
  add column if not exists rates_last_updated date;
