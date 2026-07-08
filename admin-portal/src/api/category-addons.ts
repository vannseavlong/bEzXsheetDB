import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import { createResourceHooks, type ListParams } from './createResourceHooks'
import { toast } from '@/hooks/use-toast'
import type { CategoryAddon } from '@/types'

function notifyError(error: unknown) {
  toast({
    title: 'Error',
    description: error instanceof Error ? error.message : 'Something went wrong',
    variant: 'destructive',
  })
}

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
const resource = createResourceHooks<DbCategoryAddon, AddonInput, CategoryAddon>('category-addons', BASE)

export const useCategoryAddonsList = (params?: ListParams) => resource.useList(params)
export const useCategoryAddon = (id: string | undefined) => resource.useGet(id)
export const useCreateCategoryAddon = resource.useCreate
export const useUpdateCategoryAddon = resource.useUpdate
export const useRemoveCategoryAddon = resource.useRemove

export const useAddonItems = (addonId: string | undefined) =>
  useQuery({
    queryKey: ['category-addons', 'items', addonId],
    queryFn: () => apiClient.get<{ data: DbAddonItem[] }>(`${BASE}/${addonId}/items`).then((r) => r.data),
    enabled: !!addonId,
  })

export function useCreateAddonItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ addonId, data }: { addonId: string; data: AddonItemInput }) =>
      apiClient.post<{ data: DbAddonItem }>(`${BASE}/${addonId}/items`, data).then((r) => r.data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['category-addons', 'items', vars.addonId] })
      toast({ title: 'Success', description: 'Addon item created successfully' })
    },
    onError: notifyError,
  })
}

export function useUpdateAddonItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: Partial<AddonItemInput> }) =>
      apiClient.patch<{ data: DbAddonItem }>(`/admin/category-addon-items/${itemId}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['category-addons', 'items'] })
      toast({ title: 'Success', description: 'Addon item updated successfully' })
    },
    onError: notifyError,
  })
}

export function useRemoveAddonItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => apiClient.del(`/admin/category-addon-items/${itemId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['category-addons', 'items'] })
      toast({ title: 'Success', description: 'Addon item deleted successfully' })
    },
    onError: notifyError,
  })
}
