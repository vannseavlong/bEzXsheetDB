import { useMutation, useQuery, useQueryClient, keepPreviousData, type UseQueryOptions } from '@tanstack/react-query'
import { apiClient, buildQuery } from './client'
import { toast } from '@/hooks/use-toast'

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
  const label = resource.replace(/-/g, ' ')

  function notifyError(error: unknown) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Something went wrong',
      variant: 'destructive',
    })
  }

  function useList(params: ListParams = {}, options?: Pick<UseQueryOptions<ListResponse<TList>>, 'enabled'>) {
    return useQuery({
      queryKey: listKey(params),
      queryFn: () => apiClient.get<ListResponse<TList>>(`${basePath}${buildQuery(params)}`),
      placeholderData: keepPreviousData,
      ...options,
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
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [resource, 'list'] })
        toast({ title: 'Success', description: `${label} created successfully` })
      },
      onError: notifyError,
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
        toast({ title: 'Success', description: `${label} updated successfully` })
      },
      onError: notifyError,
    })
  }

  function useRemove() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => apiClient.del(`${basePath}/${id}`),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [resource, 'list'] })
        toast({ title: 'Success', description: `${label} deleted successfully` })
      },
      onError: notifyError,
    })
  }

  return { resource, basePath, listKey, detailKey, useList, useGet, useCreate, useUpdate, useRemove }
}
