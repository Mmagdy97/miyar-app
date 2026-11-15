-- Step A: run alone first (new enum values must be committed before use)
alter type app_role add value if not exists 'accountant';
alter type app_role add value if not exists 'secretary';
