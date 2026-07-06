import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CustomHeader } from '@/components/shared/CustomHeader'
import { MultiLanguageInput } from '@/components/shared/MultiLanguageInput'
import { MultiSelect } from '@/components/shared/MultiSelect'
import { ProfilePicker } from '@/components/shared/ProfilePicker'
import TaskInformationPanel, { type TaskItem } from '@/components/category/task-information/TaskInformationPanel'
import { TaskInformationDialog, type TaskData } from '@/components/category/task-information/TaskInformationDialog'
import DraggableComboboxPanel from '@/components/common/draggable/DraggableComboboxPanel'
import type { ComboItem } from '@/components/common/draggable/SortableComboBox'
import {
  useProduct, useCreateProduct, useUpdateProduct, useProductCategoryLinks, useSetProductCategories,
} from '@/api/products'
import { uploadImage } from '@/api/upload'
import { useProductOptions } from '@/api/product-options'
import {
  useCategories, useSetCategoryProductOptions, type DbCategoryProductOptionLink,
} from '@/api/categories'
import { apiClient } from '@/api/client'
import { useReplaceTaskInfoForProduct, useTaskInfoByProduct, toTaskItem } from '@/api/task-info'

type MultiLangVal = { en: string; km: string; vi: string; tw: string; cn: string }
function emptyLang(val = ''): MultiLangVal { return { en: val, km: '', vi: '', tw: '', cn: '' } }

export default function ProductForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = id !== 'new'

  const [name, setName] = useState<MultiLangVal>(emptyLang())
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [imageUrl, setImageUrl] = useState('')
  const [taskItems, setTaskItems] = useState<TaskItem[]>([])
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  // Product options/pricing are category-scoped: a product linked to multiple
  // categories can have different options+prices per category, so this is keyed by category_id.
  const [optionsByCategory, setOptionsByCategory] = useState<Record<string, ComboItem[]>>({})
  const [activeCategoryTab, setActiveCategoryTab] = useState('')
  const [optionChoices, setOptionChoices] = useState<{ label: string; value: string }[]>([])

  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | undefined>()
  const [saving, setSaving] = useState(false)

  // Load all product options for the dropdown
  const { data: allOptionsResult } = useProductOptions()
  useEffect(() => {
    if (!allOptionsResult) return
    setOptionChoices(allOptionsResult.data.map(r => ({ label: r.nameEn, value: r.id })))
  }, [allOptionsResult])

  // Load existing product on edit
  const editId = isEdit ? id : undefined
  const { data: product } = useProduct(editId)
  const { data: tasks } = useTaskInfoByProduct(editId)
  const { data: categoriesResult } = useCategories()
  const { data: categoryLinksResult } = useProductCategoryLinks(editId)

  const categoryNameById = useMemo(
    () => Object.fromEntries((categoriesResult?.data ?? []).map(c => [c.id, c.nameEn])),
    [categoriesResult]
  )
  const categoryOptions = useMemo(
    () => (categoriesResult?.data ?? []).map(c => ({ label: c.nameEn, value: c.id })),
    [categoriesResult]
  )
  const linkedCategories = useMemo(
    () => (categoryLinksResult ?? []).slice().sort((a, b) => a.sort - b.sort),
    [categoryLinksResult]
  )
  // Tabs follow the live category selection (not just server-fetched links) so picking a
  // new category above immediately gives you a tab to set its options, before saving.
  const tabCategoryIds = useMemo(
    () => categoryIds.filter(cid => categoryNameById[cid]),
    [categoryIds, categoryNameById]
  )

  // Fetch this product's option list within each linked category — one query per tab.
  const optionQueries = useQueries({
    queries: linkedCategories.map(link => ({
      queryKey: ['categories', 'products', link.category_id, editId, 'options'],
      queryFn: () => apiClient
        .get<{ data: DbCategoryProductOptionLink[] }>(`/admin/categories/${link.category_id}/products/${editId}/options`)
        .then(r => r.data),
      enabled: !!editId,
    })),
  })

  useEffect(() => {
    optionQueries.forEach((q, i) => {
      const categoryId = linkedCategories[i]?.category_id
      if (!categoryId || !q.data) return
      setOptionsByCategory(prev => prev[categoryId] ? prev : {
        ...prev,
        [categoryId]: q.data!
          .slice()
          .sort((a, b) => a.sort - b.sort)
          .map(l => ({ id: l._id, value: l.product_option_id, amount: String(l.price), duration: String(l.duration) })),
      })
    })
  }, [optionQueries, linkedCategories])

  // Keep the active tab in sync as the category selection changes — pick a default when
  // one becomes available, and fall off a tab that's just been deselected.
  useEffect(() => {
    if (tabCategoryIds.length === 0) {
      if (activeCategoryTab) setActiveCategoryTab('')
    } else if (!tabCategoryIds.includes(activeCategoryTab)) {
      setActiveCategoryTab(tabCategoryIds[0])
    }
  }, [tabCategoryIds, activeCategoryTab])

  useEffect(() => {
    if (!categoryLinksResult) return
    setCategoryIds(categoryLinksResult.map(l => l.category_id))
  }, [categoryLinksResult])

  useEffect(() => {
    if (!product || !tasks) return
    setName(emptyLang(product.name_en))
    setStatus(product.status ? 'active' : 'inactive')
    setImageUrl(product.thumbnail_url ?? '')
    setTaskItems(tasks.map(toTaskItem))
  }, [product, tasks])

  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const setProductCategories = useSetProductCategories()
  const setCategoryProductOptions = useSetCategoryProductOptions()
  const replaceTaskInfo = useReplaceTaskInfoForProduct()

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        name_en: name.en, name_km: name.km,
        thumbnail_url: imageUrl || undefined,
        status: status === 'active',
      }

      let productId = id!
      if (isEdit) {
        await updateProduct.mutateAsync({ id: productId, data: payload })
      } else {
        const created = await createProduct.mutateAsync(payload)
        productId = created._id
      }

      // Category membership must land before per-category options: the options endpoint
      // 404s for any (category, product) pair that isn't linked yet.
      await setProductCategories.mutateAsync({ id: productId, categoryIds })

      await Promise.all([
        ...categoryIds.map(categoryId =>
          setCategoryProductOptions.mutateAsync({
            categoryId,
            productId,
            options: (optionsByCategory[categoryId] ?? []).filter(o => o.value).map(o => ({
              product_option_id: o.value,
              price: parseFloat(o.amount ?? '') || 0,
              duration: parseFloat(o.duration ?? '') || 0,
            })),
          })
        ),
        replaceTaskInfo.mutateAsync({ productId, items: taskItems }),
      ])
      navigate('/product')
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  function openAddTask() { setEditingTaskIndex(undefined); setTaskDialogOpen(true) }
  function openEditTask(index: number) { setEditingTaskIndex(index); setTaskDialogOpen(true) }

  function handleTaskSave(data: TaskData) {
    if (editingTaskIndex !== undefined) {
      setTaskItems(prev => prev.map((t, i) => i === editingTaskIndex ? { ...t, ...data } : t))
    } else {
      setTaskItems(prev => [...prev, { id: `tmp_${Date.now()}`, ...data }])
    }
  }

  return (
    <div className="flex flex-col h-full">
      <CustomHeader
        title={isEdit ? 'Edit Product' : 'New Product'}
        onBack={() => navigate(-1)}
        onSave={handleSave}
        isLoading={saving}
      />

      <div className="flex gap-6 p-6 overflow-auto">
        <div className="flex-1 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <ProfilePicker imageUrl={imageUrl} onUpload={uploadImage} onChange={(_, url) => setImageUrl(url)} />

              <div className="grid grid-cols-2 gap-4">
                <MultiLanguageInput label="Name" required values={name} onChange={setName} />

                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={v => setStatus(v as 'active' | 'inactive')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <MultiSelect
                    options={categoryOptions}
                    value={categoryIds}
                    onChange={setCategoryIds}
                    placeholder="Select category…"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-[26rem] shrink-0 space-y-4">
          <TaskInformationPanel items={taskItems} onChange={setTaskItems}
            onAdd={openAddTask} onEdit={openEditTask} />

          {tabCategoryIds.length === 0 ? (
            <Card className="shadow-none">
              <CardHeader><CardTitle className="text-base">Product Options</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Add this product to a category first — options and pricing are set per category.
              </CardContent>
            </Card>
          ) : (
            <DraggableComboboxPanel key={activeCategoryTab} title="Product Options" buttonText="Add Product Option"
              data={optionsByCategory[activeCategoryTab] ?? []}
              onChange={updater => setOptionsByCategory(prev => ({
                ...prev,
                [activeCategoryTab]: typeof updater === 'function'
                  ? updater(prev[activeCategoryTab] ?? [])
                  : updater,
              }))}
              options={optionChoices} showAmount showDuration
              headerExtra={
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground shrink-0">Category</span>
                  <Tabs value={activeCategoryTab} onValueChange={setActiveCategoryTab}>
                    <TabsList>
                      {tabCategoryIds.map(categoryId => (
                        <TabsTrigger key={categoryId} value={categoryId}>
                          {categoryNameById[categoryId]}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              } />
          )}
        </div>
      </div>

      <TaskInformationDialog open={taskDialogOpen} setOpen={setTaskDialogOpen}
        value={editingTaskIndex !== undefined ? taskItems[editingTaskIndex] : undefined}
        onSave={handleTaskSave} />
    </div>
  )
}
