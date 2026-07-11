import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import { createResourceHooks, type ListParams } from './createResourceHooks'
import { toast } from '@/hooks/use-toast'
import type { OrderStatus, PaymentStatus, OrderType } from '@/types'

export interface OrderSummary {
  id: string | number
  bulkOrderId: string
  customerName: string
  customerPhone: string
  profileUrl: string | null
  category: string
  serviceType: string
  itemCount: number
  /** null when the stored value couldn't be parsed as a date — see backend cleanDate(). */
  scheduleDate: string | null
  address: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  totalPayableAmount: number
  note: string | null
  type: OrderType
  createdAt: string | null
}

export interface OrderItemAddon {
  id: string | number
  nameEn: string
  nameKm: string
  amount: number
  qty: number
}

export interface OrderItem {
  id: string | number
  category: string
  serviceType: string
  qty: number
  duration: number
  amount: number
  isPrimary: boolean
  addOns: OrderItemAddon[]
}

export interface OrderDetail {
  id: string | number
  bulkOrderId: string
  customerName: string
  customerPhone: string
  profileUrl: string | null
  address: string
  latitude: number | null
  longitude: number | null
  floorNum: string | null
  roomNum: string | null
  /** null when the stored value couldn't be parsed as a date — see backend cleanDate(). */
  scheduleDate: string | null
  duration: number
  note: string | null
  couponCode: string | null
  amount: number
  discount: number
  serviceFee: number
  transportFee: number
  vatFee: number
  totalPayableAmount: number
  paymentMethod: string
  paymentStatus: PaymentStatus
  status: OrderStatus
  type: OrderType
  assignedCleanerId: string | number | null
  createdAt: string | null
  items: OrderItem[]
}

const BASE = '/admin/orders'
const resource = createResourceHooks<OrderDetail, never, OrderSummary>('orders', BASE)

export const useOrders = (params?: ListParams) => resource.useList(params)
export const useOrderDetail = (bulkOrderId: string | undefined) => resource.useGet(bulkOrderId)

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bulkOrderId, status }: { bulkOrderId: string; status: OrderStatus }) =>
      apiClient
        .patch<{ data: { bulkOrderId: string; status: OrderStatus } }>(`${BASE}/${bulkOrderId}/status`, { status })
        .then((r) => r.data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['orders', 'list'] })
      qc.invalidateQueries({ queryKey: ['orders', 'detail', vars.bulkOrderId] })
      toast({ title: 'Success', description: 'Order status updated' })
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      })
    },
  })
}

export function useAssignCleaner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ bulkOrderId, cleanerId }: { bulkOrderId: string; cleanerId: string | null }) =>
      apiClient
        .patch<{ data: { bulkOrderId: string; assignedCleanerId: string | null } }>(`${BASE}/${bulkOrderId}/assign-cleaner`, { cleanerId })
        .then((r) => r.data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['orders', 'list'] })
      qc.invalidateQueries({ queryKey: ['orders', 'detail', vars.bulkOrderId] })
      toast({ title: 'Success', description: 'Cleaner assignment updated' })
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      })
    },
  })
}
