import { apiClient } from './client'

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

export const rbacApi = {
  listRoles: () =>
    apiClient.get<{ data: DbRole[] }>(`${BASE}/roles`).then(r => r.data),

  createRole: (data: RoleInput) =>
    apiClient.post<{ data: DbRole }>(`${BASE}/roles`, data).then(r => r.data),

  updateRole: (id: string | number, data: Partial<RoleInput>) =>
    apiClient.put<{ data: DbRole }>(`${BASE}/roles/${id}`, data).then(r => r.data),

  deleteRole: (id: string | number) =>
    apiClient.del(`${BASE}/roles/${id}`),

  getRolePermissions: (code: string) =>
    apiClient.get<{ data: RolePermission[] }>(`${BASE}/roles/${code}/permissions`).then(r => r.data),

  setRolePermissions: (code: string, permissions: RolePermission[]) =>
    apiClient.put<{ message: string }>(`${BASE}/roles/${code}/permissions`, { permissions }),
}
