import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { apiClient, buildQuery } from './client'

export interface ListParams {
  page?: number
  limit?: number
  search?: string
  [key: string]: string | number | boolean | undefined
}

export interface ListMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ListResponse<T> {
  data: T[]
  meta: ListMeta
}

/**
 * Builds the standard list/get/create/update/remove hook set for one admin
 * resource. Resource modules in src/api/ call this once and add any
 * resource-specific endpoints (reorder, nested items, etc.) on top.
 */
export function createResourceHooks<TDb, TInput = Partial<TDb>, TList = TDb>(resource: string, basePath: string) {
  const listKey = (params: ListParams) => [resource, 'list', params] as const
  const detailKey = (id: string | undefined) => [resource, 'detail', id] as const

  function useList(params: ListParams = {}) {
    return useQuery({
      queryKey: listKey(params),
      queryFn: () => apiClient.get<ListResponse<TList>>(`${basePath}${buildQuery(params)}`),
      placeholderData: keepPreviousData,
    })
  }

  function useGet(id: string | undefined) {
    return useQuery({
      queryKey: detailKey(id),
      queryFn: () => apiClient.get<{ data: TDb }>(`${basePath}/${id}`).then((r) => r.data),
      enabled: !!id,
    })
  }

  function useCreate() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (data: TInput) => apiClient.post<{ data: TDb }>(basePath, data).then((r) => r.data),
      onSuccess: () => qc.invalidateQueries({ queryKey: [resource, 'list'] }),
    })
  }

  function useUpdate() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<TInput> }) =>
        apiClient.patch<{ data: TDb }>(`${basePath}/${id}`, data).then((r) => r.data),
      onSuccess: (_data, vars) => {
        qc.invalidateQueries({ queryKey: [resource, 'list'] })
        qc.invalidateQueries({ queryKey: detailKey(vars.id) })
      },
    })
  }

  function useRemove() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => apiClient.del(`${basePath}/${id}`),
      onSuccess: () => qc.invalidateQueries({ queryKey: [resource, 'list'] }),
    })
  }

  return { resource, basePath, listKey, detailKey, useList, useGet, useCreate, useUpdate, useRemove }
}
