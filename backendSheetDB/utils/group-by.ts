/** Counts rows by a foreign-key column, e.g. countBy(items, 'addon_id') -> { [addon_id]: count } */
export function countBy(rows: Record<string, unknown>[], key: string): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const row of rows) {
    const k = String(row[key])
    counts[k] = (counts[k] ?? 0) + 1
  }
  return counts
}

/**
 * Groups mapped values by a foreign-key column, e.g. groupBy(links, 'addon_id', l => nameById[l.category_id])
 * -> { [addon_id]: name[] }. Drops null/undefined results, which happen when a link
 * points at a row that no longer exists (a dangling foreign key).
 */
export function groupBy<T extends Record<string, unknown>, V>(
  rows: T[],
  key: string,
  mapFn: (row: T) => V
): Record<string, NonNullable<V>[]> {
  const groups: Record<string, NonNullable<V>[]> = {}
  for (const row of rows) {
    const value = mapFn(row)
    if (value === null || value === undefined) continue
    const k = String(row[key])
    ;(groups[k] ??= []).push(value)
  }
  return groups
}
