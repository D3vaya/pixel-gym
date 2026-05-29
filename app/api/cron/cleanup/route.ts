import { NextRequest } from "next/server";
import { list, del } from "@vercel/blob";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

/**
 * Daily cleanup of orphan blobs.
 *
 * The /api/process route deletes blobs in a try/finally, so successes and
 * normal errors clean up themselves. But when a Sharp encode runs past the
 * function's maxDuration, Vercel hard-kills the function and the finally
 * block never runs — leaving the source blob orphaned in the store.
 *
 * This cron sweeps anything older than the cutoff. Anything in-flight finishes
 * in seconds, so 1h is a safe floor.
 *
 * Schedule + auth are configured in vercel.ts. CRON_SECRET is required in
 * production; Vercel auto-injects `Authorization: Bearer ${CRON_SECRET}`.
 */
const ORPHAN_AGE_MS = 60 * 60 * 1000;
const PAGE_LIMIT = 100;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: { code: "BLOB_NOT_CONFIGURED" } },
      { status: 503 },
    );
  }

  const cutoff = Date.now() - ORPHAN_AGE_MS;
  let deleted = 0;
  let scanned = 0;
  let cursor: string | undefined;

  do {
    const page = await list({ cursor, limit: PAGE_LIMIT });
    scanned += page.blobs.length;

    const old = page.blobs.filter((b) => b.uploadedAt.getTime() < cutoff);
    await Promise.all(
      old.map(async (b) => {
        try {
          await del(b.url);
          deleted++;
        } catch (err) {
          console.warn("[cron/cleanup] del failed", {
            url: b.url,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }),
    );

    cursor = page.cursor;
  } while (cursor);

  return Response.json({ scanned, deleted, cutoffISO: new Date(cutoff).toISOString() });
}
