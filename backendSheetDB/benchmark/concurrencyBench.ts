import { buildBenchContext } from './lib/context';
import { appendCsvRow, nowIso, percentile } from './lib/csv';
import { mulberry32, makeRow } from './lib/prng';

// Times single-row create() calls (the path real application code and `lsdb seed`
// use — NOT createMany's single-request batching) under increasing concurrency,
// against the disposable benchmark_scratch table. This is the direct test of the
// "300 requests/min" quota claim: create() has no built-in backoff (only
// `lsdb sync --all-users` wraps writes in withBackoff), so watch for hard 429
// failures rather than graceful retries as concurrency rises.
const RESULTS_CSV = 'benchmark/results/concurrency.csv';
const CONCURRENCY_LEVELS = [1, 5, 10, 20];
const TOTAL_WRITES_PER_LEVEL = 100;

function isRateLimitError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return msg.includes('429') || msg.includes('quota') || msg.includes('rate limit');
  }
  return false;
}

async function runLevel(table: ReturnType<ReturnType<typeof buildBenchContext>['table']>, concurrency: number, runTag: string) {
  const rand = mulberry32(concurrency * 1000 + 7);
  let nextIndex = 0;
  let succeeded = 0;
  let rateLimited = 0;
  let otherFailed = 0;
  const latenciesMs: number[] = [];

  async function worker() {
    while (true) {
      const i = nextIndex++;
      if (i >= TOTAL_WRITES_PER_LEVEL) return;
      const row = { run_id: runTag, ...makeRow(rand, i) };
      const start = performance.now();
      try {
        await table.create(row, { skipFKValidation: true });
        latenciesMs.push(performance.now() - start);
        succeeded++;
      } catch (err) {
        if (isRateLimitError(err)) {
          rateLimited++;
        } else {
          otherFailed++;
          console.error(`  unexpected error: ${err instanceof Error ? err.message : err}`);
        }
      }
    }
  }

  const start = performance.now();
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  const totalMs = Math.round(performance.now() - start);

  latenciesMs.sort((a, b) => a - b);
  return {
    totalMs,
    succeeded,
    rateLimited,
    otherFailed,
    p50: Math.round(percentile(latenciesMs, 50)),
    p95: Math.round(percentile(latenciesMs, 95)),
    effectiveReqPerMin: Math.round((succeeded / totalMs) * 60_000),
  };
}

async function main() {
  const ctx = buildBenchContext();
  const table = ctx.table('benchmark_scratch');

  for (const concurrency of CONCURRENCY_LEVELS) {
    const runTag = `conc-${concurrency}-${Date.now()}`;
    console.log(`\nconcurrency=${concurrency}, ${TOTAL_WRITES_PER_LEVEL} total create() calls...`);
    const r = await runLevel(table, concurrency, runTag);
    console.log(
      `  ${r.succeeded} ok, ${r.rateLimited} rate-limited, ${r.otherFailed} other-failed in ${r.totalMs}ms ` +
      `(p50=${r.p50}ms p95=${r.p95}ms, ~${r.effectiveReqPerMin} successful req/min)`
    );
    appendCsvRow(RESULTS_CSV, {
      timestamp: nowIso(),
      concurrency,
      total_writes: TOTAL_WRITES_PER_LEVEL,
      succeeded: r.succeeded,
      rate_limited: r.rateLimited,
      other_failed: r.otherFailed,
      total_ms: r.totalMs,
      p50_ms: r.p50,
      p95_ms: r.p95,
      effective_req_per_min: r.effectiveReqPerMin,
    });
  }

  console.log(`\nResults appended to ${RESULTS_CSV}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
