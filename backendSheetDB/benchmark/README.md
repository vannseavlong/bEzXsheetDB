# Scale/quota benchmark suite

Written to answer the thesis reviewer feedback: the 300 req/min quota and
10M-cell ceiling are stated in Chapter 5 but never stress-tested. This runs the
three tests that back that up empirically, against your real `DEV_USER_SHEET_ID`
sheet, and logs every result to CSV under `benchmark/results/` for you to turn
into thesis figures/tables.

**Nothing here runs automatically or touches production tables.** Two new tabs
get created in `DEV_USER_SHEET_ID` the first time you write to them:
`benchmark_records` (grows to 100k rows across the seed steps) and
`benchmark_scratch` (disposable, used only by the payload/concurrency tests).
Drop both when you're done: `npx lsdb drop-table benchmark_records benchmark_scratch --yes`.

Run everything from `backendSheetDB/` (so `.env` and `.lsdb-tokens.json` resolve).

## 0. One-time setup: create the tabs

`benchmark_records`/`benchmark_scratch` are registered schemas but the tabs
don't exist in `DEV_USER_SHEET_ID` until synced once:

```bash
npx lsdb sync --token-file .lsdb-tokens.json
npm run bench:status   # confirms both tabs exist with 0 rows
```

Skipping this makes every write fail with `Unable to parse range:
benchmark_records!A:ZZ` — found the hard way during the first run of this suite.

## 1. Bulk-create / row-count scaling

**Not `lsdb seed`** — that command always writes with an `actor: 'admin'`
context (`actorSheetId: ADMIN_SHEET_ID`), which is fine for the project's real
seed files (all admin-actor tables) but silently points at the wrong
spreadsheet for `benchmark_records` (actor `user`), since `resolveSpreadsheetId`
uses the *context's* actorSheetId, not the *table's* actor. `benchmark/seedStep.ts`
instead uses the same `buildBenchContext()` every other benchmark script uses
(actor `user`, `actorSheetId: DEV_USER_SHEET_ID`), calling `create()` per row
the same way `lsdb seed` does, and logs progress every 100 rows so a slow or
stuck run is visible immediately instead of only at exit.

The seed files are already generated (`npm run bench:gen-seeds` regenerates them
deterministically if you ever need to). Each step is a non-overlapping range of
new rows, so running them in order grows the table 0→1k→10k→25k→50k→100k without
re-inserting anything:

```bash
npm run bench:seed:1k     # 1,000 new rows
npm run bench:seed:10k    # +9,000 rows  (table now at 10k)
npm run bench:seed:25k    # +15,000 rows (table now at 25k)
npm run bench:seed:50k    # +25,000 rows (table now at 50k)
npm run bench:seed:100k   # +50,000 rows (table now at 100k)
```

Each run appends one summary row (record count, succeeded/rate-limited/other-failed,
total ms, effective req/min) to `benchmark/results/bulk-seed.csv` — that's your
bulk-insert throughput curve directly. Since `create()` has **no automatic
backoff** — only `lsdb sync --all-users` wraps writes in retry/backoff — any
step that runs fast enough to cross the quota threshold will show a nonzero
`rate_limited` count rather than transparently retrying. If that stays at 0,
you're comfortably under quota at that write rate; if it climbs, that count
*is* the quota evidence for Chapter 5.

If a step gets interrupted partway, check `npm run bench:status` for the current
row count before deciding whether to re-run it — records already written will
be duplicated on a re-run since there's no skip-existing check here (unlike
`lsdb seed --skip-existing`).

## 2. Read/query response time at each checkpoint

After **each** seed step above, run:

```bash
npm run bench:query
```

This times `count()`, `findMany()` (full scan), `findMany({where})`, and
`findOne()` for the first and last row, 3 times each, and appends to
`benchmark/results/query-bench.csv` tagged with the row count `count()` returned
at that moment. Run it once per checkpoint (5 times total) and you'll have a
1k/10k/25k/50k/100k latency curve.

**Note on repeated runs:** the adapter caches `getAllRows()` for 2 seconds. The
first `findMany()` in a `bench:query` invocation is a cold read; if you run
`bench:query` twice within 2 seconds you'll see near-zero latency on the second
call — that's the cache working, not the table getting faster. The CSV's `run`
column lets you tell warm and cold reads apart if you re-run manually.

## 3. Bulk create with a big payload (single `createMany()` call)

```bash
npm run bench:bulk-payload
```

Fires one `createMany()` call each at 1k / 5k / 10k / 20k / 50k rows against
`benchmark_scratch` (a single Sheets API request per call, however large the
array). Logs elapsed time, success/failure, and the approximate JSON payload
size to `benchmark/results/bulk-payload.csv`. This is the test that finds where
a single batch starts failing or degrading — the practical ceiling on one
`createMany()` call, independent of the 10M-cell/workbook limit.

## 4. Concurrent writers / write-quota behavior

```bash
npm run bench:concurrency
```

Fires 100 single-row `create()` calls at concurrency 1, 5, 10, and 20 against
`benchmark_scratch`, counting successes, rate-limit (429) failures, and other
failures, plus p50/p95 latency and effective successful-requests-per-minute.
Results append to `benchmark/results/concurrency.csv`. This is the most direct
test of the "300 requests/min" claim: as concurrency rises you should see the
rate-limited count climb and effective req/min flatten out near the real quota
ceiling.

## Cleanup

```bash
npx lsdb drop-table benchmark_records benchmark_scratch --yes
rm -f seeds/bench-records-*.ts
```

## Turning results into thesis figures

Send the five CSVs back (or paste their contents) and they can be turned into
the Chapter 5 figures: a bulk-insert throughput chart from the seed-step timings
+ `query-bench.csv`, a read-latency-vs-table-size line chart from
`query-bench.csv`, a payload-size-vs-latency chart from `bulk-payload.csv`, and
a concurrency-vs-throughput/failure-rate chart from `concurrency.csv`.
