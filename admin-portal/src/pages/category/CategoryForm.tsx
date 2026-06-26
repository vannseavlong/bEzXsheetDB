import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Uploader } from '@/components/shared/Uploader'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CustomHeader } from '@/components/shared/CustomHeader'
import { MultiLanguageInput } from '@/components/shared/MultiLanguageInput'
import { ProfilePicker } from '@/components/shared/ProfilePicker'
import TaskInformationPanel, { type TaskItem } from '@/components/category/task-information/TaskInformationPanel'
import { TaskInformationDialog, emptyTaskData, type TaskData } from '@/components/category/task-information/TaskInformationDialog'
import DraggableComboboxPanel from '@/components/common/draggable/DraggableComboboxPanel'
import type { ComboItem } from '@/components/common/draggable/SortableComboBox'
import { categoriesApi } from '@/api/categories'
import { uploadImage } from '@/api/upload'
import { productsApi } from '@/api/products'
import { categoryAddonsApi } from '@/api/category-addons'
import { taskInfoApi } from '@/api/task-info'

type MultiLangVal = { en: string; km: string; vi: string; tw: string; cn: string }
function emptyLang(val = ''): MultiLangVal { return { en: val, km: '', vi: '', tw: '', cn: '' } }

export default function CategoryForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = id !== 'new'

  const [name, setName] = useState<MultiLangVal>(emptyLang())
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [sort, setSort] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [equipmentFiles, setEquipmentFiles] = useState<File[]>([])
  const [taskItems, setTaskItems] = useState<TaskItem[]>([])
  const [products, setProducts] = useState<ComboItem[]>([])
  const [addons, setAddons] = useState<ComboItem[]>([])

  const [productOptions, setProductOptions] = useState<{ label: string; value: string }[]>([])
  const [addonOptions, setAddonOptions] = useState<{ label: string; value: string }[]>([])

  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | undefined>()
  const [saving, setSaving] = useState(false)

  // Load reference lists (products + addons for dropdowns)
  useEffect(() => {
    productsApi.list().then(rows =>
      setProductOptions(rows.map(r => ({ label: r.name_en, value: r._id })))
    ).catch(console.error)

    categoryAddonsApi.list().then(rows =>
      setAddonOptions(rows.map(r => ({ label: r.name_en, value: r._id })))
    ).catch(console.error)
  }, [])

  // Load existing category on edit
  useEffect(() => {
    if (!isEdit || !id) return
    Promise.all([
      categoriesApi.get(id),
      categoriesApi.getProducts(id),
      categoriesApi.getAddons(id),
      taskInfoApi.listByCategory(id),
    ]).then(([cat, linkedProducts, linkedAddons, tasks]) => {
      setName(emptyLang(cat.name_en))
      setStatus(cat.status ? 'active' : 'inactive')
      setSort(cat.sort)
      setImageUrl(cat.thumbnail_url ?? '')
      setProducts(linkedProducts
        .sort((a, b) => a.sort - b.sort)
        .map(l => ({ id: l._id, value: l.product_id! }))
      )
      setAddons(linkedAddons
        .sort((a, b) => a.sort - b.sort)
        .map(l => ({ id: l._id, value: l.addon_id! }))
      )
      setTaskItems(tasks.map(taskInfoApi.toTaskItem))
    }).catch(console.error)
  }, [id, isEdit])

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        name_en: name.en,
        name_km: name.km,
        thumbnail_url: imageUrl || undefined,
        status: status === 'active',
        sort,
      }

      let categoryId = id!
      if (isEdit) {
        await categoriesApi.update(categoryId, payload)
      } else {
        const created = await categoriesApi.create(payload)
        categoryId = created._id
      }

      await Promise.all([
        categoriesApi.setProducts(categoryId, products.map(p => p.value)),
        categoriesApi.setAddons(categoryId, addons.map(a => a.value)),
        taskInfoApi.replaceForCategory(categoryId, taskItems),
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
                  <Label>Sort Order</Label>
                  <Input type="number" min="0" value={sort}
                    onChange={e => setSort(parseInt(e.target.value) || 0)} />
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
