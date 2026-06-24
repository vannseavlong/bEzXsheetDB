import { apiClient } from './client'

export type DbItem = {
  _id: string | number
  name_en: string
  name_km: string
  category: string
  status: boolean
  sort_order: number
}

export type ItemInput = {
  name_en: string
  name_km: string
  category: string
  status?: boolean
  sort_order?: number
}

const BASE = '/admin/items'

export const itemsApi = {
  list: () =>
    apiClient.get<{ data: DbItem[] }>(BASE).then(r => r.data),

  get: (id: string | number) =>
    apiClient.get<{ data: DbItem }>(`${BASE}/${id}`).then(r => r.data),

  create: (data: ItemInput) =>
    apiClient.post<{ data: DbItem }>(BASE, data).then(r => r.data),

  update: (id: string | number, data: Partial<ItemInput>) =>
    apiClient.patch<{ data: DbItem }>(`${BASE}/${id}`, data).then(r => r.data),

  delete: (id: string | number) =>
    apiClient.del(`${BASE}/${id}`),
}
