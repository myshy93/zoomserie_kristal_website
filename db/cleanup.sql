-- GDPR retention job (run from a Cron Trigger, see workers/cleanup).
-- Retention for now: every row 90 days after creation, regardless of status (no admin UI
-- yet to change statuses). Planned once statuses are managed: rejected/abandoned -> 30 days,
-- fulfilled -> 1 year.
-- STEP 1 (in the Worker): SELECT photo_key FROM quote_requests WHERE <same conditions> AND photo_key IS NOT NULL;
--         then env.R2.delete(keys). Only after that succeeds, run the deletes below.
DELETE FROM orders
 WHERE created_at < strftime('%Y-%m-%dT%H:%M:%fZ','now','-90 days');

DELETE FROM quote_requests
 WHERE created_at < strftime('%Y-%m-%dT%H:%M:%fZ','now','-90 days');
