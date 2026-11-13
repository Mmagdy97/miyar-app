-- Projects wiring. Run AFTER schema.sql, schema-saas.sql, schema-owner.sql.
alter table projects add column if not exists engineer_name text;
alter table projects add column if not exists image text;
