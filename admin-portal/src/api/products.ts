import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import { createResourceHooks, type ListParams } from './createResourceHooks'
import { toast } from '@/hooks/use-toast'
import type { Product } from '@/types'

function notifyError(error: unknown) {
  toast({
    title: 'Error',
    description: error instanceof Error ? error.message : 'Something went wrong',
    variant: 'destructive',
  })
}

export type DbProduct = {
  _id: string; name_en: string; name_km: string
  thumbnail_url?: string | null; status: boolean; sort: number
}

export type ProductInput = {
  name_en: string; name_km: string
  thumbnail_url?: string; status: boolean
}

export type DbCategoryProductLink = {
  _id: string; category_id: string; product_id: string; sort: number
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products', 'list'] })
      toast({ title: 'Success', description: 'Products reordered successfully' })
    },
    onError: notifyError,
  })
}

// Which categories a product is linked to. Pricing/options are category-scoped —
// see useCategoryProductOptions/useSetCategoryProductOptions in api/categories.ts.
export const useProductCategoryLinks = (id: string | undefined) =>
  useQuery({
    queryKey: ['products', 'categories', id],
    queryFn: () => apiClient.get<{ data: DbCategoryProductLink[] }>(`${BASE}/${id}/categories`).then((r) => r.data),
    enabled: !!id,
  })

export function useSetProductCategories() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, categoryIds }: { id: string; categoryIds: string[] }) =>
      apiClient.put<{ data: DbCategoryProductLink[] }>(`${BASE}/${id}/categories`, { category_ids: categoryIds }).then((r) => r.data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['products', 'categories', vars.id] })
      // membership changes also affect each category's own product list
      qc.invalidateQueries({ queryKey: ['categories', 'products'] })
      toast({ title: 'Success', description: 'Product categories updated successfully' })
    },
    onError: notifyError,
  })
}
