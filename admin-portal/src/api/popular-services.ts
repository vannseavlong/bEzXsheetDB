import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import { createResourceHooks, type ListParams } from './createResourceHooks'
import type { PopularService } from '@/types'

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
const resource = createResourceHooks<DbPopularService, PopularServiceInput, PopularService>('popular-services', BASE)

export const usePopularServices = (params?: ListParams) => resource.useList(params)
export const usePopularService = (id: string | undefined) => resource.useGet(id)
export const useCreatePopularService = resource.useCreate
export const useUpdatePopularService = resource.useUpdate
export const useRemovePopularService = resource.useRemove

export const usePopularServiceItems = (id: string | undefined) =>
  useQuery({
    queryKey: ['popular-services', 'items', id],
    queryFn: () => apiClient.get<{ data: DbPopularServiceItem[] }>(`${BASE}/${id}/items`).then((r) => r.data),
    enabled: !!id,
  })

export function useSetPopularServiceItems() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, items }: { id: string; items: ServiceItemInput[] }) =>
      apiClient.put<{ data: DbPopularServiceItem[] }>(`${BASE}/${id}/items`, { items }).then((r) => r.data),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['popular-services', 'items', vars.id] }),
  })
}
