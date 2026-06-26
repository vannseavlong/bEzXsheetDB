import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CustomHeader } from '@/components/shared/CustomHeader'
import { MultiLanguageInput } from '@/components/shared/MultiLanguageInput'
import { ProfilePicker } from '@/components/shared/ProfilePicker'
import TaskInformationPanel, { type TaskItem } from '@/components/category/task-information/TaskInformationPanel'
import { TaskInformationDialog, type TaskData } from '@/components/category/task-information/TaskInformationDialog'
import DraggableComboboxPanel from '@/components/common/draggable/DraggableComboboxPanel'
import type { ComboItem } from '@/components/common/draggable/SortableComboBox'
import { productsApi } from '@/api/products'
import { uploadImage } from '@/api/upload'
import { productOptionsApi } from '@/api/product-options'
import { taskInfoApi } from '@/api/task-info'

type MultiLangVal = { en: string; km: string; vi: string; tw: string; cn: string }
function emptyLang(val = ''): MultiLangVal { return { en: val, km: '', vi: '', tw: '', cn: '' } }

export default function ProductForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = id !== 'new'

  const [name, setName] = useState<MultiLangVal>(emptyLang())
  const [basePrice, setBasePrice] = useState(0)
  const [duration, setDuration] = useState(1)
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [sort, setSort] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [taskItems, setTaskItems] = useState<TaskItem[]>([])
  const [linkedOptions, setLinkedOptions] = useState<ComboItem[]>([])
  const [optionChoices, setOptionChoices] = useState<{ label: string; value: string }[]>([])

  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | undefined>()
  const [saving, setSaving] = useState(false)

  // Load all product options for the dropdown
  useEffect(() => {
    productOptionsApi.list().then(rows =>
      setOptionChoices(rows.map(r => ({ label: r.name_en, value: r._id })))
    ).catch(console.error)
  }, [])

  // Load existing product on edit
  useEffect(() => {
    if (!isEdit || !id) return
    Promise.all([
      productsApi.get(id),
      productOptionsApi.list(id),
      taskInfoApi.listByProduct(id),
    ]).then(([product, options, tasks]) => {
      setName(emptyLang(product.name_en))
      setBasePrice(product.base_price)
      setDuration(product.duration)
      setStatus(product.status ? 'active' : 'inactive')
      setSort(product.sort)
      setLinkedOptions(options.map(o => ({ id: o._id, value: o._id })))
      setTaskItems(tasks.map(taskInfoApi.toTaskItem))
    }).catch(console.error)
  }, [id, isEdit])

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        name_en: name.en, name_km: name.km,
        base_price: basePrice, duration,
        status: status === 'active', sort,
      }

      let productId = id!
      if (isEdit) {
        await productsApi.update(productId, payload)
      } else {
        const created = await productsApi.create(payload)
        productId = created._id
      }

      await taskInfoApi.replaceForProduct(productId, taskItems)
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

              <MultiLanguageInput label="Name" required values={name} onChange={setName} />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Base Price ($)</Label>
                  <Input type="number" min="0" step="0.01" value={basePrice}
                    onChange={e => setBasePrice(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Duration (hours)</Label>
                  <Input type="number" min="0" value={duration}
                    onChange={e => setDuration(parseInt(e.target.value) || 0)} />
                </div>
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
            </CardContent>
          </Card>
        </div>

        <div className="w-80 space-y-4">
          <TaskInformationPanel items={taskItems} onChange={setTaskItems}
            onAdd={openAddTask} onEdit={openEditTask} />

          <DraggableComboboxPanel title="Product Options" buttonText="Add Product Option"
            data={linkedOptions} onChange={setLinkedOptions} options={optionChoices} showAmount />
        </div>
      </div>

      <TaskInformationDialog open={taskDialogOpen} setOpen={setTaskDialogOpen}
        value={editingTaskIndex !== undefined ? taskItems[editingTaskIndex] : undefined}
        onSave={handleTaskSave} />
    </div>
  )
}
