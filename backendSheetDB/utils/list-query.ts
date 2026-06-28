import type { FindOptions } from 'longcelot-sheet-db'

export interface ListQueryConfig {
  /** Columns checked against `?search=` with a case-insensitive substring match. */
  searchFields?: string[]
  /** Query params accepted as exact-match `where` filters, e.g. ['status', 'role']. */
  filterFields?: string[]
  /** Subset of filterFields whose value is 'true'/'false' and must be coerced to boolean. */
  booleanFields?: string[]
  defaultOrderBy?: string
  defaultOrder?: 'asc' | 'desc'
  defaultLimit?: number
  maxLimit?: number
}

export interface ListMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ListResult<T> {
  data: T[]
  meta: ListMeta
}

interface Table<T> {
  findMany(options?: FindOptions): Promise<T[]>
}

/**
 * Pagination is opt-in: callers that don't send ?page or ?limit (e.g. picker
 * dropdowns populating a whole form) keep getting every matching row, exactly
 * like before this helper existed.
 */
export async function listResource<T extends Record<string, unknown>>(
  table: Table<T>,
  query: Record<string, unknown>,
  config: ListQueryConfig = {}
): Promise<ListResult<T>> {
  const {
    searchFields = [],
    filterFields = [],
    booleanFields = [],
    defaultOrderBy,
    defaultOrder = 'asc',
    defaultLimit = 30,
    maxLimit = 200,
  } = config

  const where: Record<string, unknown> = {}
  for (const field of filterFields) {
    const raw = query[field]
    if (raw === undefined || raw === '') continue
    where[field] = booleanFields.includes(field) ? raw === 'true' : raw
  }

  const orderBy = (typeof query.orderBy === 'string' && query.orderBy) || defaultOrderBy
  const order = query.order === 'desc' ? 'desc' : query.order === 'asc' ? 'asc' : defaultOrder

  // longcelot-sheet-db@0.1.25+ sorts orderBy numerically when both sides parse as numbers
  // (fixed upstream — see PACKAGE_IMPROVEMENT.md), so we delegate sorting to findMany again.
  let rows = await table.findMany({ where, orderBy, order })

  const search = typeof query.search === 'string' ? query.search.trim() : ''
  if (search && searchFields.length) {
    const needle = search.toLowerCase()
    rows = rows.filter((row) =>
      searchFields.some((field) => String(row[field] ?? '').toLowerCase().includes(needle))
    )
  }

  const total = rows.length
  const paginated = query.page !== undefined || query.limit !== undefined

  if (!paginated) {
    return { data: rows, meta: { page: 1, limit: total, total, totalPages: 1 } }
  }

  const page = Math.max(1, parseInt(String(query.page ?? '1'), 10) || 1)
  const limit = Math.min(maxLimit, Math.max(1, parseInt(String(query.limit ?? defaultLimit), 10) || defaultLimit))
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const offset = (page - 1) * limit

  return { data: rows.slice(offset, offset + limit), meta: { page, limit, total, totalPages } }
}
