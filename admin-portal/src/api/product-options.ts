import { apiClient } from './client'

export type DbProductOption = {
  _id: string; product_id: string; name_en: string; name_km: string
  type: string; amount: number; status: boolean; sort: number
}

export type ProductOptionInput = {
  product_id: string; name_en: string; name_km: string
  type: string; amount: number; status: boolean; sort: number
}

const BASE = '/admin/product-options'

export const productOptionsApi = {
  list: (productId?: string) => {
    const qs = productId ? `?product_id=${productId}` : ''
    return apiClient.get<{ data: DbProductOption[] }>(`${BASE}${qs}`).then(r => r.data)
  },

  get: (id: string) =>
    apiClient.get<{ data: DbProductOption }>(`${BASE}/${id}`).then(r => r.data),

  create: (data: ProductOptionInput) =>
    apiClient.post<{ data: DbProductOption }>(BASE, data).then(r => r.data),

  update: (id: string, data: Partial<ProductOptionInput>) =>
    apiClient.patch<{ data: DbProductOption }>(`${BASE}/${id}`, data).then(r => r.data),

  remove: (id: string) =>
    apiClient.del(`${BASE}/${id}`),
}
