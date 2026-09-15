import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { OrderStatus } from '@/types'

// Same palette as the ORDER status badge variants (see StatusBadge.tsx) so a status
// reads as the same color everywhere in the portal.
const STATUS_META: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: '#F6B024' },
  ACCEPTED: { label: 'Accepted', color: '#102C90' },
  IN_PROGRESS: { label: 'In Progress', color: '#1B4CFA' },
  COMPLETED: { label: 'Completed', color: '#06C270' },
  CANCELLED: { label: 'Cancelled', color: '#FF3B3B' },
}

const STATUS_ORDER: OrderStatus[] = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

export function OrderStatusBreakdown({
  counts,
  isLoading,
}: {
  counts: Partial<Record<OrderStatus, number>>
  isLoading?: boolean
}) {
  const total = STATUS_ORDER.reduce((sum, status) => sum + (counts[status] ?? 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)
        ) : total === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
              {STATUS_ORDER.filter((status) => counts[status]).map((status) => (
                <div
                  key={status}
                  style={{
                    width: `${((counts[status] ?? 0) / total) * 100}%`,
                    backgroundColor: STATUS_META[status].color,
                  }}
                />
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              {STATUS_ORDER.map((status) => {
                const count = counts[status] ?? 0
                const pct = total ? Math.round((count / total) * 100) : 0
                return (
                  <div key={status} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: STATUS_META[status].color }}
                      />
                      {STATUS_META[status].label}
                    </div>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      {count}
                      <span className="w-9 text-right text-xs font-normal text-muted-foreground">{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
