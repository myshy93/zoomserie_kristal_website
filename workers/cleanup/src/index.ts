// GDPR retention job (daily Cron Trigger). Orders and quote requests hold personal
// data (name, phone, address) with no basis for indefinite retention:
//   - rejected / abandoned  -> deleted after 30 days
//   - fulfilled             -> deleted after 1 year
// Quote reference photos are deleted from R2 first, so a failed run never leaves a
// photo without its row (the next run retries). order_items go with their order
// via ON DELETE CASCADE. Mirrors db/cleanup.sql.

interface Env {
  DB: D1Database;
  QUOTE_PHOTOS: R2Bucket;
}

const EXPIRED = `(status IN ('rejected','abandoned') AND updated_at < strftime('%Y-%m-%dT%H:%M:%fZ','now','-30 days'))
    OR (status = 'fulfilled' AND updated_at < strftime('%Y-%m-%dT%H:%M:%fZ','now','-1 year'))`;

const R2_DELETE_BATCH = 1000;

export async function cleanup(env: Env): Promise<{ photos: number; orders: number; quotes: number }> {
  const { results } = await env.DB.prepare(
    `SELECT photo_key FROM quote_requests WHERE (${EXPIRED}) AND photo_key IS NOT NULL`,
  ).all<{ photo_key: string }>();
  const keys = results.map((r) => r.photo_key);
  for (let i = 0; i < keys.length; i += R2_DELETE_BATCH) {
    await env.QUOTE_PHOTOS.delete(keys.slice(i, i + R2_DELETE_BATCH));
  }

  const [orders, quotes] = await env.DB.batch([
    env.DB.prepare(`DELETE FROM orders WHERE ${EXPIRED}`),
    env.DB.prepare(`DELETE FROM quote_requests WHERE ${EXPIRED}`),
  ]);
  return { photos: keys.length, orders: orders.meta.changes, quotes: quotes.meta.changes };
}

export default {
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(
      cleanup(env).then((counts) => console.log('[cleanup] deleted', JSON.stringify(counts))),
    );
  },
} satisfies ExportedHandler<Env>;
