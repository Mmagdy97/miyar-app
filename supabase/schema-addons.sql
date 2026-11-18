-- Paid add-ons: extra projects per office (limits come from the plan in code).
alter table organizations add column if not exists extra_projects int not null default 0;
