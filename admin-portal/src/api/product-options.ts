import { createResourceHooks, type ListParams } from './createResourceHooks'

export type DbProductOption = {
  _id: string; product_id: string; name_en: string; name_km: string
  type: string; amount: number; status: boolean; sort: number
}

export type ProductOptionInput = {
  product_id: string; name_en: string; name_km: string
  type: string; amount: number; status: boolean; sort: number
}

const resource = createResourceHooks<DbProductOption, ProductOptionInput>('product-options', '/admin/product-options')

export const useProductOptions = (params?: ListParams) => resource.useList(params)
export const useProductOption = (id: string | undefined) => resource.useGet(id)
export const useCreateProductOption = resource.useCreate
export const useUpdateProductOption = resource.useUpdate
export const useRemoveProductOption = resource.useRemove
