// One analytics job (BigQuery sync or GA4 backfill) at a time: both write the same sheet and
// Sheets API quotas are tight.
let running = false
export const isSyncRunning = () => running
export function acquireSyncLock() {
  if (running) throw new Error('A sync is already running')
  running = true
}
export function releaseSyncLock() { running = false }
