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

export type RbacAction = {
  id: string | number
  key: string
  label: string
}

export type RbacModule = {
  id: string | number
  key: string
  label: string
  section: string
  actions: string[]
}

export type ModuleInput = {
  key: string
  label: string
  section: string
  actions: string[]
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

// ── Actions catalog ─────────────────────────────────────────────────────────

export const useRbacActions = () =>
  useQuery({
    queryKey: ['rbac', 'actions'],
    queryFn: () => apiClient.get<{ data: RbacAction[] }>(`${BASE}/actions`).then((r) => r.data),
  })

export function useCreateRbacAction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { key: string; label: string }) =>
      apiClient.post<{ data: RbacAction }>(`${BASE}/actions`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rbac', 'actions'] }),
  })
}

// ── Modules catalog ──────────────────────────────────────────────────────────

export const useRbacModules = () =>
  useQuery({
    queryKey: ['rbac', 'modules'],
    queryFn: () => apiClient.get<{ data: RbacModule[] }>(`${BASE}/modules`).then((r) => r.data),
  })

export function useCreateRbacModule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ModuleInput) => apiClient.post<{ data: RbacModule }>(`${BASE}/modules`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rbac', 'modules'] }),
  })
}

export function useUpdateRbacModule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: Partial<Omit<ModuleInput, 'key'>> }) =>
      apiClient.put<{ data: RbacModule }>(`${BASE}/modules/${key}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rbac', 'modules'] }),
  })
}
