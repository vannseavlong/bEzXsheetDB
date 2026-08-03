import { buildBenchContext } from './lib/context';
import { appendCsvRow, nowIso } from './lib/csv';

// Times read-path operations against benchmark_records at its *current* live row
// count. Run this after each seed step (see benchmark/README.md) to sample
// findMany()/findOne()/count() latency at 1k, 10k, 25k, 50k, 100k rows.
const RESULTS_CSV = 'benchmark/results/query-bench.csv';
const REPEATS = 3;

async function timeIt<T>(fn: () => Promise<T>): Promise<{ ms: number; result: T }> {
  const start = performance.now();
  const result = await fn();
  return { ms: Math.round(performance.now() - start), result };
}

async function main() {
  const ctx = buildBenchContext();
  const table = ctx.table('benchmark_records');

  const { ms: countMs, result: rowCount } = await timeIt(() => table.count());
  console.log(`count() -> ${rowCount} rows in ${countMs}ms`);
  appendCsvRow(RESULTS_CSV, { timestamp: nowIso(), row_count: rowCount, operation: 'count', run: 1, elapsed_ms: countMs });

  for (let run = 1; run <= REPEATS; run++) {
    const { ms } = await timeIt(() => table.findMany());
    console.log(`findMany() (full scan) run ${run} -> ${ms}ms`);
    appendCsvRow(RESULTS_CSV, { timestamp: nowIso(), row_count: rowCount, operation: 'findMany_full', run, elapsed_ms: ms });
  }

  for (let run = 1; run <= REPEATS; run++) {
    const { ms, result } = await timeIt(() => table.findMany({ where: { category: 'electronics' } }));
    console.log(`findMany({where: category}) run ${run} -> ${ms}ms (${(result as unknown[]).length} matches)`);
    appendCsvRow(RESULTS_CSV, { timestamp: nowIso(), row_count: rowCount, operation: 'findMany_filtered', run, elapsed_ms: ms });
  }

  for (let run = 1; run <= REPEATS; run++) {
    const { ms } = await timeIt(() => table.findOne({ where: { sku: 'sku-bench-0000001' } }));
    console.log(`findOne(first sku) run ${run} -> ${ms}ms`);
    appendCsvRow(RESULTS_CSV, { timestamp: nowIso(), row_count: rowCount, operation: 'findOne_first', run, elapsed_ms: ms });
  }

  const lastSku = `sku-bench-${String(rowCount).padStart(7, '0')}`;
  for (let run = 1; run <= REPEATS; run++) {
    const { ms } = await timeIt(() => table.findOne({ where: { sku: lastSku } }));
    console.log(`findOne(last sku) run ${run} -> ${ms}ms`);
    appendCsvRow(RESULTS_CSV, { timestamp: nowIso(), row_count: rowCount, operation: 'findOne_last', run, elapsed_ms: ms });
  }

  console.log(`\nResults appended to ${RESULTS_CSV}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
