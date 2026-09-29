-- Migration 0002: order_items.unit uses the catalog's units (bucata/kg/portie/cutie)
-- instead of 'piece'/'kg'. SQLite can't alter a CHECK constraint, so the table is
-- rebuilt (it holds no rows when this ships).

CREATE TABLE order_items_new (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id              TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_slug          TEXT NOT NULL,
  product_name          TEXT NOT NULL,                   -- snapshot, so history survives catalog edits
  variations            TEXT NOT NULL DEFAULT '{}',      -- JSON: {"aroma":"ciocolata","decor":"clasic"}
  personalized_message  TEXT,
  quantity              REAL NOT NULL CHECK (quantity > 0),  -- piece count, or kg in 0.5 steps
  unit                  TEXT NOT NULL CHECK (unit IN ('bucata','kg','portie','cutie')),
  unit_price_bani       INTEGER NOT NULL CHECK (unit_price_bani >= 0),  -- server-computed snapshot
  line_total_bani       INTEGER NOT NULL CHECK (line_total_bani >= 0)
);

INSERT INTO order_items_new
  SELECT id, order_id, product_slug, product_name, variations, personalized_message, quantity,
         CASE unit WHEN 'piece' THEN 'bucata' ELSE unit END, unit_price_bani, line_total_bani
  FROM order_items;

DROP TABLE order_items;
ALTER TABLE order_items_new RENAME TO order_items;
CREATE INDEX idx_order_items_order ON order_items(order_id);
