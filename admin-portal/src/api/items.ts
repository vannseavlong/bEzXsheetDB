import { createResourceHooks, type ListParams } from './createResourceHooks'

export type DbItem = {
  _id: string | number
  name_en: string
  name_km: string
  category: string
  status: boolean
  sort_order: number
}

export type ItemInput = {
  name_en: string
  name_km: string
  category: string
  status?: boolean
  sort_order?: number
}

const resource = createResourceHooks<DbItem, ItemInput>('items', '/admin/items')

export const useItems = (params?: ListParams) => resource.useList(params)
export const useItem = (id: string | undefined) => resource.useGet(id)
export const useCreateItem = resource.useCreate
export const useUpdateItem = resource.useUpdate
export const useRemoveItem = resource.useRemove
