import { apiClient } from './client'

export type DbPopularService = {
  _id: string; name_en: string; name_km: string
  image_url?: string; status: boolean; display_order: number
}

export type DbPopularServiceItem = {
  _id: string; popular_service_id: string
  type: 'CATEGORY' | 'PRODUCT'; category_id?: string; product_id?: string; priority: number
}

export type PopularServiceInput = {
  name_en: string; name_km: string
  image_url?: string; status: boolean; display_order: number
}

export type ServiceItemInput = {
  type: 'CATEGORY' | 'PRODUCT'; ref_id: string; priority?: number
}

const BASE = '/admin/popular-services'

export const popularServicesApi = {
  list: () =>
    apiClient.get<{ data: DbPopularService[] }>(BASE).then(r => r.data),

  get: (id: string) =>
    apiClient.get<{ data: DbPopularService }>(`${BASE}/${id}`).then(r => r.data),

  create: (data: PopularServiceInput) =>
    apiClient.post<{ data: DbPopularService }>(BASE, data).then(r => r.data),

  update: (id: string, data: Partial<PopularServiceInput>) =>
    apiClient.patch<{ data: DbPopularService }>(`${BASE}/${id}`, data).then(r => r.data),

  remove: (id: string) =>
    apiClient.del(`${BASE}/${id}`),

  getItems: (id: string) =>
    apiClient.get<{ data: DbPopularServiceItem[] }>(`${BASE}/${id}/items`).then(r => r.data),

  setItems: (id: string, items: ServiceItemInput[]) =>
    apiClient.put<{ data: DbPopularServiceItem[] }>(`${BASE}/${id}/items`, { items }).then(r => r.data),
}
