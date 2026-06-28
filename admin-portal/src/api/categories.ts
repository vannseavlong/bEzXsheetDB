import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import { createResourceHooks, type ListParams } from './createResourceHooks'
import type { Category } from '@/types'

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
const resource = createResourceHooks<DbCategory, CategoryInput, Category>('categories', BASE)

export const useCategories = (params?: ListParams) => resource.useList(params)
export const useCategory = (id: string | undefined) => resource.useGet(id)
export const useCreateCategory = resource.useCreate
export const useUpdateCategory = resource.useUpdate
export const useRemoveCategory = resource.useRemove

export function useReorderCategories() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, offset }: { ids: string[]; offset?: number }) =>
      apiClient.put<{ success: true }>(`${BASE}/sort`, { ids, offset }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories', 'list'] }),
  })
}

export const useCategoryProducts = (id: string | undefined) =>
  useQuery({
    queryKey: ['categories', 'products', id],
    queryFn: () => apiClient.get<{ data: DbCategoryLink[] }>(`${BASE}/${id}/products`).then((r) => r.data),
    enabled: !!id,
  })

export function useSetCategoryProducts() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, productIds }: { id: string; productIds: string[] }) =>
      apiClient.put<{ data: DbCategoryLink[] }>(`${BASE}/${id}/products`, { product_ids: productIds }).then((r) => r.data),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['categories', 'products', vars.id] }),
  })
}

export const useCategoryAddons = (id: string | undefined) =>
  useQuery({
    queryKey: ['categories', 'addons', id],
    queryFn: () => apiClient.get<{ data: DbCategoryLink[] }>(`${BASE}/${id}/addons`).then((r) => r.data),
    enabled: !!id,
  })

export function useSetCategoryAddons() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, addonIds }: { id: string; addonIds: string[] }) =>
      apiClient.put<{ data: DbCategoryLink[] }>(`${BASE}/${id}/addons`, { addon_ids: addonIds }).then((r) => r.data),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['categories', 'addons', vars.id] }),
  })
}
