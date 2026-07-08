import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import { toast } from '@/hooks/use-toast'
import type { TaskItem } from '@/components/category/task-information/TaskInformationPanel'

function notifyError(error: unknown) {
  toast({
    title: 'Error',
    description: error instanceof Error ? error.message : 'Something went wrong',
    variant: 'destructive',
  })
}

export type DbTaskInfo = {
  _id: string; category_id?: string; product_id?: string; sort: number
  title_en: string; title_km: string
  description_en: string[] | null; description_km: string[] | null
}

const BASE = '/admin/task-info'

export const useTaskInfoByCategory = (categoryId: string | undefined) =>
  useQuery({
    queryKey: ['task-info', 'category', categoryId],
    queryFn: () => apiClient.get<{ data: DbTaskInfo[] }>(`${BASE}?category_id=${categoryId}`).then((r) => r.data),
    enabled: !!categoryId,
  })

export const useTaskInfoByProduct = (productId: string | undefined) =>
  useQuery({
    queryKey: ['task-info', 'product', productId],
    queryFn: () => apiClient.get<{ data: DbTaskInfo[] }>(`${BASE}?product_id=${productId}`).then((r) => r.data),
    enabled: !!productId,
  })

/** Converts a DbTaskInfo row → TaskItem for the panel */
export function toTaskItem(db: DbTaskInfo): TaskItem {
  return {
    id: db._id,
    en: { title: db.title_en, description: db.description_en ?? [] },
    km: { title: db.title_km, description: db.description_km ?? [] },
    vi: { title: '', description: [] },
    tw: { title: '', description: [] },
    cn: { title: '', description: [] },
  }
}

async function replaceTaskInfo(deletePath: string, fields: { category_id?: string; product_id?: string }, items: TaskItem[]) {
  await apiClient.del(deletePath)
  for (let i = 0; i < items.length; i++) {
    const t = items[i]
    await apiClient.post(BASE, {
      ...fields,
      sort: i,
      title_en: t.en.title,
      title_km: t.km.title,
      description_en: t.en.description,
      description_km: t.km.description,
    })
  }
}

export function useReplaceTaskInfoForCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ categoryId, items }: { categoryId: string; items: TaskItem[] }) =>
      replaceTaskInfo(`${BASE}/by-category/${categoryId}`, { category_id: categoryId }, items),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['task-info', 'category', vars.categoryId] })
      toast({ title: 'Success', description: 'Task info updated successfully' })
    },
    onError: notifyError,
  })
}

export function useReplaceTaskInfoForProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, items }: { productId: string; items: TaskItem[] }) =>
      replaceTaskInfo(`${BASE}/by-product/${productId}`, { product_id: productId }, items),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['task-info', 'product', vars.productId] })
      toast({ title: 'Success', description: 'Task info updated successfully' })
    },
    onError: notifyError,
  })
}
