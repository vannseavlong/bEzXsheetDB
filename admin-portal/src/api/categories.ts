import { apiClient } from './client'

export type DbCategory = {
  _id: string; name_en: string; name_km: string
  thumbnail_url?: string; status: boolean; sort: number
  platform: string[] | null
}

export type CategoryInput = {
  name_en: string; name_km: string
  thumbnail_url?: string; status: boolean
  platform: string[]
}

export type DbCategoryLink = {
  _id: string; category_id: string; product_id?: string; addon_id?: string; sort: number
}

const BASE = '/admin/categories'

export const categoriesApi = {
  list: () =>
    apiClient.get<{ data: DbCategory[] }>(BASE).then(r => r.data),

  get: (id: string) =>
    apiClient.get<{ data: DbCategory }>(`${BASE}/${id}`).then(r => r.data),

  create: (data: CategoryInput) =>
    apiClient.post<{ data: DbCategory }>(BASE, data).then(r => r.data),

  update: (id: string, data: Partial<CategoryInput>) =>
    apiClient.patch<{ data: DbCategory }>(`${BASE}/${id}`, data).then(r => r.data),

  remove: (id: string) =>
    apiClient.del(`${BASE}/${id}`),

  reorder: (ids: string[]) =>
    apiClient.put<{ data: DbCategory[] }>(`${BASE}/sort`, { ids }).then(r => r.data),

  getProducts: (id: string) =>
    apiClient.get<{ data: DbCategoryLink[] }>(`${BASE}/${id}/products`).then(r => r.data),

  setProducts: (id: string, productIds: string[]) =>
    apiClient.put<{ data: DbCategoryLink[] }>(`${BASE}/${id}/products`, { product_ids: productIds }).then(r => r.data),

  getAddons: (id: string) =>
    apiClient.get<{ data: DbCategoryLink[] }>(`${BASE}/${id}/addons`).then(r => r.data),

  setAddons: (id: string, addonIds: string[]) =>
    apiClient.put<{ data: DbCategoryLink[] }>(`${BASE}/${id}/addons`, { addon_ids: addonIds }).then(r => r.data),
}
