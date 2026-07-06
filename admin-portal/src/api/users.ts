import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import { createResourceHooks, type ListParams } from './createResourceHooks'

export type DbAdminUser = {
  _id: string | number
  user_id: string
  name: string
  email: string
  role_id: string
  /** Joined from the roles table by the backend; null if the role was deleted. */
  role_name: string | null
  role_code: string | null
  status: 'active' | 'inactive'
  actor_sheet_id?: string
  profile_url?: string
}

export type AdminUserInput = {
  name: string
  email: string
  password: string
  role_id: string
}

export type AdminUserUpdate = {
  name?: string
  role_id?: string
  status?: string
}

const BASE = '/admin/users'
const resource = createResourceHooks<DbAdminUser, AdminUserInput>('users', BASE)

export const useUsers = (params?: ListParams) => resource.useList(params)
export const useCreateUser = resource.useCreate
/** Backend treats DELETE as a soft deactivate (sets status: 'inactive'), never a hard delete. */
export const useDeactivateUser = resource.useRemove

// Update uses a different shape than create (name/role/status, no email/password), so it
// can't reuse resource.useUpdate's Partial<AdminUserInput>.
export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: AdminUserUpdate }) =>
      apiClient.patch<{ data: DbAdminUser }>(`${BASE}/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users', 'list'] }),
  })
}
