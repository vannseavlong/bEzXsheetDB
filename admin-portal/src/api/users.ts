import { apiClient } from './client'

export type DbAdminUser = {
  _id: string | number
  user_id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  actor_sheet_id?: string
  profile_url?: string
}

export type AdminUserInput = {
  name: string
  email: string
  password: string
  role: string
}

export type AdminUserUpdate = {
  name?: string
  role?: string
  status?: string
}

const BASE = '/admin/users'

export const usersApi = {
  list: () =>
    apiClient.get<{ data: DbAdminUser[] }>(BASE).then(r => r.data),

  create: (data: AdminUserInput) =>
    apiClient.post<{ data: DbAdminUser }>(BASE, data).then(r => r.data),

  update: (id: string | number, data: AdminUserUpdate) =>
    apiClient.patch<{ data: DbAdminUser }>(`${BASE}/${id}`, data).then(r => r.data),

  deactivate: (id: string | number) =>
    apiClient.del(`${BASE}/${id}`),
}
