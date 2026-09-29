-- GDPR retention job (run from a Cron Trigger).
-- Retention: rejected/abandoned -> 30 days, fulfilled -> 1 year.
-- STEP 1 (in the Worker): SELECT photo_key FROM quote_requests WHERE <same conditions> AND photo_key IS NOT NULL;
--         then env.R2.delete(keys). Only after that succeeds, run the deletes below.
DELETE FROM orders
 WHERE (status IN ('rejected','abandoned') AND updated_at < strftime('%Y-%m-%dT%H:%M:%fZ','now','-30 days'))
    OR (status = 'fulfilled'               AND updated_at < strftime('%Y-%m-%dT%H:%M:%fZ','now','-1 year'));

DELETE FROM quote_requests
 WHERE (status IN ('rejected','abandoned') AND updated_at < strftime('%Y-%m-%dT%H:%M:%fZ','now','-30 days'))
    OR (status = 'fulfilled'               AND updated_at < strftime('%Y-%m-%dT%H:%M:%fZ','now','-1 year'));
