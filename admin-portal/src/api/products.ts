import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import { createResourceHooks, type ListParams } from './createResourceHooks'
import type { Product } from '@/types'

export type DbProduct = {
  _id: string; name_en: string; name_km: string
  thumbnail_url?: string | null; status: boolean; sort: number
}

export type ProductInput = {
  name_en: string; name_km: string
  thumbnail_url?: string; status: boolean
}

export type DbProductOptionLink = {
  _id: string; product_id: string; product_option_id: string
  price: number; duration: number; sort: number
}

const BASE = '/admin/products'
const resource = createResourceHooks<DbProduct, ProductInput, Product>('products', BASE)

export const useProducts = (params?: ListParams) => resource.useList(params)
export const useProduct = (id: string | undefined) => resource.useGet(id)
export const useCreateProduct = resource.useCreate
export const useUpdateProduct = resource.useUpdate
export const useRemoveProduct = resource.useRemove

export function useReorderProducts() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, offset }: { ids: string[]; offset?: number }) =>
      apiClient.put<{ success: true }>(`${BASE}/sort`, { ids, offset }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products', 'list'] }),
  })
}

export const useProductOptionLinks = (id: string | undefined) =>
  useQuery({
    queryKey: ['products', 'options', id],
    queryFn: () => apiClient.get<{ data: DbProductOptionLink[] }>(`${BASE}/${id}/options`).then((r) => r.data),
    enabled: !!id,
  })

export function useSetProductOptions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, options }: {
      id: string
      options: { product_option_id: string; price: number; duration: number }[]
    }) => apiClient.put<{ data: DbProductOptionLink[] }>(`${BASE}/${id}/options`, { options }).then((r) => r.data),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['products', 'options', vars.id] }),
  })
}
