export const BUSINESS_HOURS = { start: '08:00', end: '18:00' }

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function businessHoursSpanMinutes(): number {
  return toMinutes(BUSINESS_HOURS.end) - toMinutes(BUSINESS_HOURS.start)
}

export function formatDateKey(date: unknown): string {
  return new Date(date as string).toISOString().slice(0, 10)
}

export function nextDays(count: number, from: Date = new Date()): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(from)
    d.setDate(d.getDate() + i)
    return formatDateKey(d)
  })
}

/**
 * v1 heuristic: a date is fully unavailable if a company-wide block (no cleaner_ids
 * scoping) exists for it, or if the day's blocked windows collectively cover the whole
 * business-hours span. Per-cleaner capacity isn't modeled yet — that needs the cleaner
 * roster cross-referenced against same-day order counts, deferred until that's needed.
 */
export function isDateBlocked(dateKey: string, blocks: Record<string, unknown>[]): boolean {
  const dayBlocks = blocks.filter((b) => formatDateKey(b.blocked_date) === dateKey)
  if (dayBlocks.length === 0) return false

  const companyWide = dayBlocks.some((b) => {
    const cleanerIds = b.cleaner_ids as string | null | undefined
    if (!cleanerIds) return true
    try {
      const ids = JSON.parse(cleanerIds)
      return !Array.isArray(ids) || ids.length === 0
    } catch {
      return false
    }
  })
  if (companyWide) return true

  const blockedMinutes = dayBlocks.reduce(
    (sum, b) => sum + Math.max(0, toMinutes(b.end_time as string) - toMinutes(b.start_time as string)),
    0
  )
  return blockedMinutes >= businessHoursSpanMinutes()
}
