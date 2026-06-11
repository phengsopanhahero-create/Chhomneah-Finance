-- Widen provider_type / service_type check constraints to support
-- digital_wallet and insurance providers (Wing, TrueMoney, Pi Pay,
-- Forte, Manulife, Prudential, etc).
--
-- Run this if your database was created from an earlier version of
-- schema.sql. Safe to skip on fresh installs (schema.sql already
-- includes these values).
--
-- Drops any existing check constraint on these columns by inspecting
-- pg_constraint, in case the auto-generated name differs from the
-- default <table>_<column>_check.

do $$
declare
  c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    where rel.relname = 'loan_products'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) like '%provider_type%'
  loop
    execute format('alter table loan_products drop constraint %I', c.conname);
  end loop;

  for c in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    where rel.relname = 'service_locations'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) like '%service_type%'
  loop
    execute format('alter table service_locations drop constraint %I', c.conname);
  end loop;
end $$;

alter table loan_products
  add constraint loan_products_provider_type_check
  check (provider_type in ('bank', 'mfi', 'digital_wallet', 'insurance'));

alter table service_locations
  add constraint service_locations_service_type_check
  check (service_type in ('bank', 'mfi', 'wing', 'truemoney', 'digital_wallet', 'insurance'));
