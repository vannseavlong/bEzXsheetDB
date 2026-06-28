import { createResourceHooks, type ListParams } from './createResourceHooks'
import type { Product } from '@/types'

export type DbProduct = {
  _id: string; name_en: string; name_km: string
  base_price: number; duration: number; status: boolean; sort: number
}

export type ProductInput = {
  name_en: string; name_km: string
  base_price: number; duration: number; status: boolean; sort: number
}

const resource = createResourceHooks<DbProduct, ProductInput, Product>('products', '/admin/products')

export const useProducts = (params?: ListParams) => resource.useList(params)
export const useProduct = (id: string | undefined) => resource.useGet(id)
export const useCreateProduct = resource.useCreate
export const useUpdateProduct = resource.useUpdate
export const useRemoveProduct = resource.useRemove
