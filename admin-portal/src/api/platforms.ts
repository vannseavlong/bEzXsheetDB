import { apiClient } from './client'

export type DbPlatform = {
  _id: string; name_en: string; name_km: string
  description?: string; status: boolean
}

export type PlatformInput = {
  name_en: string; name_km: string
  description?: string; status: boolean
}

const BASE = '/admin/platforms'

export const platformsApi = {
  list: () =>
    apiClient.get<{ data: DbPlatform[] }>(BASE).then(r => r.data),

  get: (id: string) =>
    apiClient.get<{ data: DbPlatform }>(`${BASE}/${id}`).then(r => r.data),

  create: (data: PlatformInput) =>
    apiClient.post<{ data: DbPlatform }>(BASE, data).then(r => r.data),

  update: (id: string, data: Partial<PlatformInput>) =>
    apiClient.patch<{ data: DbPlatform }>(`${BASE}/${id}`, data).then(r => r.data),

  remove: (id: string) =>
    apiClient.del(`${BASE}/${id}`),
}
