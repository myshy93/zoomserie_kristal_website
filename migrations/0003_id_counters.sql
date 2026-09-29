-- Migration 0003: per-day counters for readable order/quote numbers, e.g. C-260929-01
-- (order) and O-260929-01 (quote). One row per prefix+day; incremented atomically with
-- INSERT ... ON CONFLICT DO UPDATE ... RETURNING (see src/lib/server/ids.ts).
CREATE TABLE id_counters (
  scope  TEXT PRIMARY KEY,           -- e.g. 'C-260929'
  value  INTEGER NOT NULL
);
