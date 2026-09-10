import {
  differenceInCalendarDays,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns'

export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'this_month'
  | 'last_month'
  | 'last_3_months'
  | 'all_time'

export const DATE_RANGE_PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'all_time', label: 'All Time' },
]

/** `to: null` (all_time) means "up to now" — callers should treat a null bound as open-ended. */
export function getDateRangeForPreset(preset: DateRangePreset, now = new Date()): { from: Date | null; to: Date | null } {
  switch (preset) {
    case 'today':
      return { from: startOfDay(now), to: endOfDay(now) }
    case 'yesterday': {
      const yesterday = subDays(now, 1)
      return { from: startOfDay(yesterday), to: endOfDay(yesterday) }
    }
    case 'this_week':
      return { from: startOfWeek(now, { weekStartsOn: 1 }), to: endOfWeek(now, { weekStartsOn: 1 }) }
    case 'this_month':
      return { from: startOfMonth(now), to: endOfMonth(now) }
    case 'last_month': {
      const lastMonth = subMonths(now, 1)
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
    }
    case 'last_3_months':
      // Rolling 90-ish days ending today, rather than 3 whole calendar months —
      // reads better as "what's happened recently" than a fixed calendar window.
      return { from: startOfDay(subMonths(now, 3)), to: endOfDay(now) }
    case 'all_time':
      return { from: null, to: null }
  }
}

export interface TrendBucket {
  label: string
  count: number
}

/**
 * Buckets `dates` (already filtered to the chosen range) into a trend series.
 * Granularity adapts to the span so a single day reads hourly while "All Time"
 * over months of data still renders as a readable handful of points.
 */
export function buildTrendBuckets(dates: Date[], from: Date | null, to: Date | null): TrendBucket[] {
  const rangeEnd = to ?? new Date()
  const rangeStart = from ?? (dates.length ? dates.reduce((min, d) => (d < min ? d : min), rangeEnd) : startOfDay(rangeEnd))
  const spanDays = Math.max(0, differenceInCalendarDays(rangeEnd, rangeStart))

  if (spanDays <= 1) {
    const hours = eachHourOfInterval({ start: startOfDay(rangeStart), end: endOfDay(rangeEnd) })
    return hours.map((hour) => ({
      label: format(hour, 'ha'),
      count: dates.filter((d) => d.getHours() === hour.getHours() && isWithinInterval(d, { start: startOfDay(hour), end: endOfDay(hour) })).length,
    }))
  }
  if (spanDays <= 45) {
    const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd })
    return days.map((day) => ({
      label: format(day, 'MMM d'),
      count: dates.filter((d) => isWithinInterval(d, { start: startOfDay(day), end: endOfDay(day) })).length,
    }))
  }
  if (spanDays <= 210) {
    const weeks = eachWeekOfInterval({ start: rangeStart, end: rangeEnd }, { weekStartsOn: 1 })
    return weeks.map((weekStart) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
      return {
        label: format(weekStart, 'MMM d'),
        count: dates.filter((d) => isWithinInterval(d, { start: weekStart, end: weekEnd })).length,
      }
    })
  }
  const months = eachMonthOfInterval({ start: rangeStart, end: rangeEnd })
  return months.map((monthStart) => ({
    label: format(monthStart, 'MMM yyyy'),
    count: dates.filter((d) => isWithinInterval(d, { start: startOfMonth(monthStart), end: endOfMonth(monthStart) })).length,
  }))
}
