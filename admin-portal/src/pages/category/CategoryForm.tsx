import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Uploader } from '@/components/shared/Uploader'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CustomHeader } from '@/components/shared/CustomHeader'
import { MultiLanguageInput } from '@/components/shared/MultiLanguageInput'
import { MultiSelect } from '@/components/shared/MultiSelect'
import { ProfilePicker } from '@/components/shared/ProfilePicker'
import TaskInformationPanel, { type TaskItem } from '@/components/category/task-information/TaskInformationPanel'
import { TaskInformationDialog, emptyTaskData, type TaskData } from '@/components/category/task-information/TaskInformationDialog'
import DraggableComboboxPanel from '@/components/common/draggable/DraggableComboboxPanel'
import type { ComboItem } from '@/components/common/draggable/SortableComboBox'
import {
  useCategory, useCategoryAddons, useCategoryProducts,
  useCreateCategory, useSetCategoryAddons, useSetCategoryProducts, useUpdateCategory,
} from '@/api/categories'
import { uploadImage } from '@/api/upload'
import { useProducts } from '@/api/products'
import { useCategoryAddonsList } from '@/api/category-addons'
import { usePlatforms } from '@/api/platforms'
import { useReplaceTaskInfoForCategory, useTaskInfoByCategory, toTaskItem } from '@/api/task-info'

type MultiLangVal = { en: string; km: string; vi: string; tw: string; cn: string }
function emptyLang(val = ''): MultiLangVal { return { en: val, km: '', vi: '', tw: '', cn: '' } }

export default function CategoryForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = id !== 'new'

  const [name, setName] = useState<MultiLangVal>(emptyLang())
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [platform, setPlatform] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [equipmentFiles, setEquipmentFiles] = useState<File[]>([])
  const [taskItems, setTaskItems] = useState<TaskItem[]>([])
  const [products, setProducts] = useState<ComboItem[]>([])
  const [addons, setAddons] = useState<ComboItem[]>([])

  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | undefined>()
  const [saving, setSaving] = useState(false)

  // Reference lists for the dropdowns/pickers
  const { data: productsResult } = useProducts()
  const { data: addonsResult } = useCategoryAddonsList()
  const { data: platformsResult } = usePlatforms()

  const productOptions = useMemo(
    () => (productsResult?.data ?? []).map((r) => ({ label: r.nameEn, value: r.id })),
    [productsResult]
  )
  const addonOptions = useMemo(
    () => (addonsResult?.data ?? []).map((r) => ({ label: r.nameEn, value: r.id })),
    [addonsResult]
  )
  const platformOptions = useMemo(
    () => (platformsResult?.data ?? []).map((r) => ({ label: r.name_en, value: r._id })),
    [platformsResult]
  )

  // Load existing category on edit
  const editId = isEdit ? id : undefined
  const { data: category } = useCategory(editId)
  const { data: linkedProducts } = useCategoryProducts(editId)
  const { data: linkedAddons } = useCategoryAddons(editId)
  const { data: tasks } = useTaskInfoByCategory(editId)

  useEffect(() => {
    if (!category || !linkedProducts || !linkedAddons || !tasks) return
    setName(emptyLang(category.name_en))
    setStatus(category.status ? 'active' : 'inactive')
    setPlatform(category.platform ?? [])
    setImageUrl(category.thumbnail_url ?? '')
    setProducts(linkedProducts
      .sort((a, b) => a.sort - b.sort)
      .map(l => ({ id: l._id, value: l.product_id! }))
    )
    setAddons(linkedAddons
      .sort((a, b) => a.sort - b.sort)
      .map(l => ({ id: l._id, value: l.addon_id! }))
    )
    setTaskItems(tasks.map(toTaskItem))
  }, [category, linkedProducts, linkedAddons, tasks])

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const setCategoryProducts = useSetCategoryProducts()
  const setCategoryAddons = useSetCategoryAddons()
  const replaceTaskInfo = useReplaceTaskInfoForCategory()

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        name_en: name.en,
        name_km: name.km,
        thumbnail_url: imageUrl || undefined,
        status: status === 'active',
        platform,
      }

      let categoryId = id!
      if (isEdit) {
        await updateCategory.mutateAsync({ id: categoryId, data: payload })
      } else {
        const created = await createCategory.mutateAsync(payload)
        categoryId = created._id
      }

      await Promise.all([
        setCategoryProducts.mutateAsync({ id: categoryId, productIds: products.map(p => p.value) }),
        setCategoryAddons.mutateAsync({ id: categoryId, addonIds: addons.map(a => a.value) }),
        replaceTaskInfo.mutateAsync({ categoryId, items: taskItems }),
      ])

      navigate('/category')
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
        title={isEdit ? 'Edit Category' : 'New Category'}
        onBack={() => navigate(-1)}
        onSave={handleSave}
        isLoading={saving}
      />

      <div className="flex gap-6 p-6 overflow-auto">
        {/* Left column */}
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
                  <Label>Platform</Label>
                  <MultiSelect
                    options={platformOptions}
                    value={platform}
                    onChange={setPlatform}
                    placeholder="Select platform…"
                  />
                </div>
              </div>

              <Uploader label="Equipment Images" accept="image/*" multiple
                files={equipmentFiles} onFilesSelected={setEquipmentFiles} />
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="w-80 space-y-4 border-l pl-6">
          <TaskInformationPanel items={taskItems} onChange={setTaskItems}
            onAdd={openAddTask} onEdit={openEditTask} />

          <DraggableComboboxPanel title="Products" buttonText="Add Product"
            data={products} onChange={setProducts} options={productOptions} />

          <DraggableComboboxPanel title="Category Add-Ons" buttonText="Add Add-On"
            data={addons} onChange={setAddons} options={addonOptions} />
        </div>
      </div>

      <TaskInformationDialog
        open={taskDialogOpen} setOpen={setTaskDialogOpen}
        value={editingTaskIndex !== undefined ? taskItems[editingTaskIndex] : undefined}
        onSave={handleTaskSave}
      />
    </div>
  )
}
