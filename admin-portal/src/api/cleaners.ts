import { createResourceHooks, type ListParams } from './createResourceHooks'
import type { Cleaner } from '@/types'

export type DbCleaner = {
  _id: string | number
  name: string
  gender: string
  role: string
  status: boolean
  image_url?: string
  phone?: string
  joined_date: string
  auto_assign: boolean
  expertises?: string  // JSON string of string[]
  weekly_offs?: string  // JSON string of string[]
}

export type CleanerInput = {
  name: string
  gender: string
  role: string
  status: boolean
  image_url?: string
  phone?: string
  joined_date: string
  auto_assign: boolean
  expertises?: string
  weekly_offs?: string
}

const BASE = '/admin/cleaners'
const resource = createResourceHooks<DbCleaner, CleanerInput, Cleaner>('cleaners', BASE)

export const useCleaners = (params?: ListParams, options?: Parameters<typeof resource.useList>[1]) =>
  resource.useList(params, options)
export const useCleaner = (id: string | undefined) => resource.useGet(id)
export const useCreateCleaner = resource.useCreate
export const useUpdateCleaner = resource.useUpdate
export const useRemoveCleaner = resource.useRemove
