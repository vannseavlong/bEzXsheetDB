import { apiClient } from './client'

export type DbCategoryAddon = {
  _id: string; name_en: string; name_km: string
  badge_en?: string; badge_km?: string
  selection_type: 'SINGLE' | 'MULTIPLE'
  is_required: boolean; status: boolean
}

export type DbAddonItem = {
  _id: string; addon_id: string; name_en: string; name_km: string
  type: string; img_url?: string; amount: number; duration: number
  status: boolean; sort: number
}

export type AddonInput = {
  name_en: string; name_km: string
  badge_en?: string; badge_km?: string
  selection_type: 'SINGLE' | 'MULTIPLE'
  is_required: boolean; status: boolean
}

export type AddonItemInput = {
  name_en: string; name_km: string; type: string
  img_url?: string; amount: number; duration: number
  status: boolean; sort: number
}

const BASE = '/admin/category-addons'

export const categoryAddonsApi = {
  list: () =>
    apiClient.get<{ data: DbCategoryAddon[] }>(BASE).then(r => r.data),

  get: (id: string) =>
    apiClient.get<{ data: DbCategoryAddon }>(`${BASE}/${id}`).then(r => r.data),

  create: (data: AddonInput) =>
    apiClient.post<{ data: DbCategoryAddon }>(BASE, data).then(r => r.data),

  update: (id: string, data: Partial<AddonInput>) =>
    apiClient.patch<{ data: DbCategoryAddon }>(`${BASE}/${id}`, data).then(r => r.data),

  remove: (id: string) =>
    apiClient.del(`${BASE}/${id}`),

  getItems: (addonId: string) =>
    apiClient.get<{ data: DbAddonItem[] }>(`${BASE}/${addonId}/items`).then(r => r.data),

  createItem: (addonId: string, data: AddonItemInput) =>
    apiClient.post<{ data: DbAddonItem }>(`${BASE}/${addonId}/items`, data).then(r => r.data),

  updateItem: (itemId: string, data: Partial<AddonItemInput>) =>
    apiClient.patch<{ data: DbAddonItem }>(`/admin/category-addon-items/${itemId}`, data).then(r => r.data),

  removeItem: (itemId: string) =>
    apiClient.del(`/admin/category-addon-items/${itemId}`),
}
