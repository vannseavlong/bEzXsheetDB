import { apiClient } from './client'

export type DbProduct = {
  _id: string; name_en: string; name_km: string
  base_price: number; duration: number; status: boolean; sort: number
}

export type ProductInput = {
  name_en: string; name_km: string
  base_price: number; duration: number; status: boolean; sort: number
}

const BASE = '/admin/products'

export const productsApi = {
  list: () =>
    apiClient.get<{ data: DbProduct[] }>(BASE).then(r => r.data),

  get: (id: string) =>
    apiClient.get<{ data: DbProduct }>(`${BASE}/${id}`).then(r => r.data),

  create: (data: ProductInput) =>
    apiClient.post<{ data: DbProduct }>(BASE, data).then(r => r.data),

  update: (id: string, data: Partial<ProductInput>) =>
    apiClient.patch<{ data: DbProduct }>(`${BASE}/${id}`, data).then(r => r.data),

  remove: (id: string) =>
    apiClient.del(`${BASE}/${id}`),
}
