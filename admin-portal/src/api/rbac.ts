import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, buildQuery } from './client'
import type { ListParams, ListResponse } from './createResourceHooks'

export type DbRole = {
  id: string | number
  name: string
  code: string
  status: boolean
  description?: string
}

export type RolePermission = {
  module: string
  action: string
}

export type RoleInput = {
  name: string
  code: string
  description?: string
  status?: boolean
}

const BASE = '/admin/rbac'

export const useRoles = (params: ListParams = {}) =>
  useQuery({
    queryKey: ['roles', 'list', params],
    queryFn: () => apiClient.get<ListResponse<DbRole>>(`${BASE}/roles${buildQuery(params)}`),
  })

export function useCreateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RoleInput) => apiClient.post<{ data: DbRole }>(`${BASE}/roles`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles', 'list'] }),
  })
}

export function useUpdateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<RoleInput> }) =>
      apiClient.put<{ data: DbRole }>(`${BASE}/roles/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles', 'list'] }),
  })
}

export function useDeleteRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => apiClient.del(`${BASE}/roles/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles', 'list'] }),
  })
}

export const useRolePermissions = (code: string | undefined) =>
  useQuery({
    queryKey: ['roles', 'permissions', code],
    queryFn: () => apiClient.get<{ data: RolePermission[] }>(`${BASE}/roles/${code}/permissions`).then((r) => r.data),
    enabled: !!code,
  })

export function useSetRolePermissions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ code, permissions }: { code: string; permissions: RolePermission[] }) =>
      apiClient.put<{ message: string }>(`${BASE}/roles/${code}/permissions`, { permissions }),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['roles', 'permissions', vars.code] }),
  })
}
