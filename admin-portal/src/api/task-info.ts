import { apiClient } from './client'
import type { TaskItem } from '@/components/category/task-information/TaskInformationPanel'

export type DbTaskInfo = {
  _id: string; category_id?: string; product_id?: string; sort: number
  title_en: string; title_km: string
  description_en: string[] | null; description_km: string[] | null
}

const BASE = '/admin/task-info'

export const taskInfoApi = {
  listByCategory: (categoryId: string) =>
    apiClient.get<{ data: DbTaskInfo[] }>(`${BASE}?category_id=${categoryId}`).then(r => r.data),

  listByProduct: (productId: string) =>
    apiClient.get<{ data: DbTaskInfo[] }>(`${BASE}?product_id=${productId}`).then(r => r.data),

  /** Converts a DbTaskInfo row → TaskItem for the panel */
  toTaskItem: (db: DbTaskInfo): TaskItem => ({
    id: db._id,
    en: { title: db.title_en, description: db.description_en ?? [] },
    km: { title: db.title_km, description: db.description_km ?? [] },
    vi: { title: '', description: [] },
    tw: { title: '', description: [] },
    cn: { title: '', description: [] },
  }),

  /** Replace all task info for a category with the current panel items */
  replaceForCategory: async (categoryId: string, items: TaskItem[]) => {
    await apiClient.del(`${BASE}/by-category/${categoryId}`)
    for (let i = 0; i < items.length; i++) {
      const t = items[i]
      await apiClient.post(`${BASE}`, {
        category_id: categoryId,
        sort: i,
        title_en: t.en.title,
        title_km: t.km.title,
        description_en: t.en.description,
        description_km: t.km.description,
      })
    }
  },

  /** Replace all task info for a product with the current panel items */
  replaceForProduct: async (productId: string, items: TaskItem[]) => {
    await apiClient.del(`${BASE}/by-product/${productId}`)
    for (let i = 0; i < items.length; i++) {
      const t = items[i]
      await apiClient.post(`${BASE}`, {
        product_id: productId,
        sort: i,
        title_en: t.en.title,
        title_km: t.km.title,
        description_en: t.en.description,
        description_km: t.km.description,
      })
    }
  },
}
