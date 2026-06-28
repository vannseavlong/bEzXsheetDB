import { createResourceHooks, type ListParams } from './createResourceHooks'

export type DbPlatform = {
  _id: string; name_en: string; name_km: string
  description?: string; status: boolean
}

export type PlatformInput = {
  name_en: string; name_km: string
  description?: string; status: boolean
}

const resource = createResourceHooks<DbPlatform, PlatformInput>('platforms', '/admin/platforms')

export const usePlatforms = (params?: ListParams) => resource.useList(params)
export const usePlatform = (id: string | undefined) => resource.useGet(id)
export const useCreatePlatform = resource.useCreate
export const useUpdatePlatform = resource.useUpdate
export const useRemovePlatform = resource.useRemove
