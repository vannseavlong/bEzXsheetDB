import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * date-fns' format() throws on an invalid date, which — with no error boundary in this
 * app — takes down the whole page. Some sheet-backed date columns can come back
 * unparseable (see backendSheetDB orders.ts cleanDate() for one known cause), so any
 * date rendered from the API should go through this instead of `format(new Date(...))`.
 */
export function formatDateSafe(value: string | null | undefined, pattern: string, fallback = '—'): string {
  if (!value) return fallback
  const date = new Date(value)
  return isNaN(date.getTime()) ? fallback : format(date, pattern)
}
