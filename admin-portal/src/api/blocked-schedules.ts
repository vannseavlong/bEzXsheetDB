import { useQuery } from '@tanstack/react-query'
import { apiClient } from './client'
import { createResourceHooks, type ListParams } from './createResourceHooks'
import type { BlockedSchedule } from '@/types'

export type DbBlockedSchedule = {
  _id: string | number
  name: string
  blocked_date: string
  start_time: string
  end_time: string
  cleaner_ids?: string  // JSON string of _id array
  associated_address?: string
}

export type DbCleaner = {
  _id: string | number
  name: string
  status: boolean
}

export type BlockedScheduleInput = {
  name: string
  blocked_date: string
  start_time: string
  end_time: string
  cleaner_ids?: string
  associated_address?: string
}

const BASE = '/admin/blocked-schedules'
const resource = createResourceHooks<DbBlockedSchedule, BlockedScheduleInput, BlockedSchedule>('blocked-schedules', BASE)

export const useBlockedSchedules = (params?: ListParams) => resource.useList(params)
export const useBlockedSchedule = (id: string | undefined) => resource.useGet(id)
export const useCreateBlockedSchedule = resource.useCreate
export const useUpdateBlockedSchedule = resource.useUpdate
export const useRemoveBlockedSchedule = resource.useRemove

export const useCleaners = () =>
  useQuery({
    queryKey: ['blocked-schedules', 'cleaners'],
    queryFn: () => apiClient.get<{ data: DbCleaner[] }>(`${BASE}/cleaners`).then((r) => r.data),
  })
