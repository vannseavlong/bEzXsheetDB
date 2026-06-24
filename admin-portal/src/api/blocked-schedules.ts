import { apiClient } from './client'

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

export const blockedSchedulesApi = {
  list: () =>
    apiClient.get<{ data: DbBlockedSchedule[] }>(BASE).then(r => r.data),

  get: (id: string | number) =>
    apiClient.get<{ data: DbBlockedSchedule }>(`${BASE}/${id}`).then(r => r.data),

  create: (data: BlockedScheduleInput) =>
    apiClient.post<{ data: DbBlockedSchedule }>(BASE, data).then(r => r.data),

  update: (id: string | number, data: Partial<BlockedScheduleInput>) =>
    apiClient.patch<{ data: DbBlockedSchedule }>(`${BASE}/${id}`, data).then(r => r.data),

  delete: (id: string | number) =>
    apiClient.del(`${BASE}/${id}`),

  listCleaners: () =>
    apiClient.get<{ data: DbCleaner[] }>(`${BASE}/cleaners`).then(r => r.data),
}
