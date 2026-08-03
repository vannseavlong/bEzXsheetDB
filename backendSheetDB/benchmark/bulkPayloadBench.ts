import { buildBenchContext } from './lib/context';
import { appendCsvRow, nowIso } from './lib/csv';
import { mulberry32, makeRow } from './lib/prng';

// Times a single createMany() call at increasing batch sizes against the disposable
// benchmark_scratch table — this is the "bulk create with big payload" case: one
// appendRows() -> one Sheets API request, however many rows are in the array. Finds
// where a single request starts slowing down sharply or failing outright (payload
// size / timeout), independent of accumulated table size.
//
// Cleanup between full runs: `npx lsdb drop-table benchmark_scratch --yes` then
// re-sync (the schema file recreates the tab on next write).
const RESULTS_CSV = 'benchmark/results/bulk-payload.csv';
const BATCH_SIZES = [1_000, 5_000, 10_000, 20_000, 50_000];

async function main() {
  const ctx = buildBenchContext();
  const table = ctx.table('benchmark_scratch');
  const rand = mulberry32(Date.now());
  const runTag = `run-${Date.now()}`;

  for (const size of BATCH_SIZES) {
    const rows = Array.from({ length: size }, (_, i) => ({
      run_id: runTag,
      ...makeRow(rand, i),
    }));
    const approxBytes = JSON.stringify(rows).length;

    console.log(`\ncreateMany(${size} rows, ~${(approxBytes / 1024 / 1024).toFixed(2)}MB payload)...`);
    const start = performance.now();
    try {
      await table.createMany(rows, { skipFKValidation: true });
      const ms = Math.round(performance.now() - start);
      console.log(`  ok in ${ms}ms (${Math.round((size / ms) * 1000)} rows/sec)`);
      appendCsvRow(RESULTS_CSV, {
        timestamp: nowIso(),
        batch_size: size,
        approx_payload_bytes: approxBytes,
        elapsed_ms: ms,
        status: 'ok',
      });
    } catch (err) {
      const ms = Math.round(performance.now() - start);
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  FAILED after ${ms}ms: ${message}`);
      appendCsvRow(RESULTS_CSV, {
        timestamp: nowIso(),
        batch_size: size,
        approx_payload_bytes: approxBytes,
        elapsed_ms: ms,
        status: `failed: ${message.replace(/,/g, ';').slice(0, 200)}`,
      });
    }
  }

  console.log(`\nResults appended to ${RESULTS_CSV}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
