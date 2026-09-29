-- Zoomserie D1 schema, migration 0001
-- Money is stored as integer bani (1 RON = 100 bani) to avoid float errors.
-- Timestamps are ISO-8601 UTC strings (SQLite has no native datetime type).
-- D1 enforces foreign keys, so ON DELETE CASCADE works for order_items.

CREATE TABLE orders (
  id                TEXT PRIMARY KEY,                    -- short public ID, e.g. 'ZS-7K3Q9F', generated in the Pages Function
  status            TEXT NOT NULL DEFAULT 'new'
                    CHECK (status IN ('new','confirmed','fulfilled','rejected','abandoned')),
  last_name         TEXT NOT NULL,                       -- nume (facturare)
  first_name        TEXT NOT NULL,                       -- prenume (facturare)
  phone             TEXT NOT NULL,
  fulfillment       TEXT NOT NULL CHECK (fulfillment IN ('delivery','pickup')),
  address           TEXT,                                -- required when fulfillment = 'delivery' (enforced below)
  locality          TEXT,
  requested_date    TEXT,                                -- open question with client: desired date/slot, nullable for now
  customer_notes    TEXT,
  subtotal_bani     INTEGER NOT NULL CHECK (subtotal_bani >= 0),
  delivery_fee_bani INTEGER NOT NULL DEFAULT 0 CHECK (delivery_fee_bani >= 0),
  total_bani        INTEGER NOT NULL CHECK (total_bani >= 0),
  lang              TEXT NOT NULL DEFAULT 'ro' CHECK (lang IN ('ro','en')),
  created_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK (fulfillment = 'pickup' OR (address IS NOT NULL AND length(trim(address)) > 0))
);

CREATE TABLE order_items (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id              TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_slug          TEXT NOT NULL,
  product_name          TEXT NOT NULL,                   -- snapshot, so history survives catalog edits
  variations            TEXT NOT NULL DEFAULT '{}',      -- JSON: {"size":"1kg","flavor":"ciocolata","decor":"..."}
  personalized_message  TEXT,
  quantity              REAL NOT NULL CHECK (quantity > 0),  -- piece count or kg (0.5 steps), per-kg semantics TBD
  unit                  TEXT NOT NULL DEFAULT 'piece' CHECK (unit IN ('piece','kg')),
  unit_price_bani       INTEGER NOT NULL CHECK (unit_price_bani >= 0),  -- server-computed snapshot
  line_total_bani       INTEGER NOT NULL CHECK (line_total_bani >= 0)
);

CREATE TABLE quote_requests (
  id              TEXT PRIMARY KEY,                      -- e.g. 'QR-8M2X4D'
  status          TEXT NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new','quoted','accepted','fulfilled','rejected','abandoned')),
  cake_type       TEXT NOT NULL CHECK (cake_type IN ('tort_nunta','tort_personalizat')),
  last_name       TEXT NOT NULL,
  first_name      TEXT NOT NULL,
  phone           TEXT NOT NULL,
  address         TEXT NOT NULL,
  event_date      TEXT,                                  -- YYYY-MM-DD, required for tort_nunta
  description     TEXT,
  photo_key       TEXT,                                  -- R2 object key of the reference photo
  lang            TEXT NOT NULL DEFAULT 'ro' CHECK (lang IN ('ro','en')),
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK (cake_type <> 'tort_nunta' OR event_date IS NOT NULL)
);

CREATE INDEX idx_orders_status_updated ON orders(status, updated_at);
CREATE INDEX idx_order_items_order     ON order_items(order_id);
CREATE INDEX idx_quotes_status_updated ON quote_requests(status, updated_at);
