import path from 'path';
import { buildBenchContext } from './lib/context';
import { appendCsvRow, nowIso } from './lib/csv';

// Replaces `lsdb seed` for benchmark_records: `lsdb seed` always writes with an
// admin-actor context (actorSheetId: ADMIN_SHEET_ID), which is correct for the
// project's real seed files (all admin-actor tables) but silently targets the
// wrong spreadsheet for a `user`-actor table like benchmark_records. This script
// uses buildBenchContext() directly (actor: 'user', actorSheetId: DEV_USER_SHEET_ID)
// and logs progress every 100 rows so a slow/stuck run is visible immediately
// instead of only at exit.
//
// Usage: tsx benchmark/seedStep.ts seeds/bench-records-01-to-1k.ts
const RESULTS_CSV = 'benchmark/results/bulk-seed.csv';

function isRateLimitError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return msg.includes('429') || msg.includes('quota') || msg.includes('rate limit');
  }
  return false;
}

async function main() {
  const seedFileArg = process.argv[2];
  if (!seedFileArg) {
    console.error('Usage: tsx benchmark/seedStep.ts <seed-file.ts>');
    process.exit(1);
  }

  const seedFilePath = path.resolve(process.cwd(), seedFileArg);
  const mod = require(seedFilePath) as { default: { benchmark_records: Record<string, unknown>[] } };
  const records = mod.default.benchmark_records;
  console.log(`Loaded ${records.length} records from ${seedFileArg}`);

  const ctx = buildBenchContext();
  const table = ctx.table('benchmark_records');

  let succeeded = 0;
  let rateLimited = 0;
  let otherFailed = 0;
  const start = performance.now();

  for (let i = 0; i < records.length; i++) {
    try {
      await table.create(records[i], { skipFKValidation: true });
      succeeded++;
    } catch (err) {
      if (isRateLimitError(err)) {
        rateLimited++;
      } else {
        otherFailed++;
        console.error(`  ✖ [${i}] ${err instanceof Error ? err.message : err}`);
      }
    }

    if ((i + 1) % 100 === 0 || i === records.length - 1) {
      const elapsedS = Math.round((performance.now() - start) / 1000);
      console.log(`  ${i + 1}/${records.length} attempted — ${succeeded} ok, ${rateLimited} rate-limited, ${otherFailed} other-failed (${elapsedS}s elapsed)`);
    }
  }

  const totalMs = Math.round(performance.now() - start);
  console.log(`\nDone in ${totalMs}ms: ${succeeded} ok, ${rateLimited} rate-limited, ${otherFailed} other-failed.`);

  appendCsvRow(RESULTS_CSV, {
    timestamp: nowIso(),
    seed_file: seedFileArg,
    record_count: records.length,
    succeeded,
    rate_limited: rateLimited,
    other_failed: otherFailed,
    total_ms: totalMs,
    effective_req_per_min: Math.round((succeeded / totalMs) * 60_000),
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
