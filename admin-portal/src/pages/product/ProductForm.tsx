import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CustomHeader } from '@/components/shared/CustomHeader'
import { MultiLanguageInput } from '@/components/shared/MultiLanguageInput'
import { ProfilePicker } from '@/components/shared/ProfilePicker'
import TaskInformationPanel, { type TaskItem } from '@/components/category/task-information/TaskInformationPanel'
import { TaskInformationDialog, type TaskData } from '@/components/category/task-information/TaskInformationDialog'
import DraggableComboboxPanel from '@/components/common/draggable/DraggableComboboxPanel'
import type { ComboItem } from '@/components/common/draggable/SortableComboBox'
import { useProduct, useCreateProduct, useUpdateProduct, useProductOptionLinks, useSetProductOptions } from '@/api/products'
import { uploadImage } from '@/api/upload'
import { useProductOptions } from '@/api/product-options'
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
  const [linkedOptions, setLinkedOptions] = useState<ComboItem[]>([])
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
  const { data: linkedOptionsResult } = useProductOptionLinks(editId)
  const { data: tasks } = useTaskInfoByProduct(editId)

  useEffect(() => {
    if (!product || !linkedOptionsResult || !tasks) return
    setName(emptyLang(product.name_en))
    setStatus(product.status ? 'active' : 'inactive')
    setImageUrl(product.thumbnail_url ?? '')
    setLinkedOptions(linkedOptionsResult
      .sort((a, b) => a.sort - b.sort)
      .map(l => ({ id: l._id, value: l.product_option_id, amount: String(l.price), duration: String(l.duration) }))
    )
    setTaskItems(tasks.map(toTaskItem))
  }, [product, linkedOptionsResult, tasks])

  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const setProductOptions = useSetProductOptions()
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

      await Promise.all([
        setProductOptions.mutateAsync({
          id: productId,
          options: linkedOptions.filter(o => o.value).map(o => ({
            product_option_id: o.value,
            price: parseFloat(o.amount ?? '') || 0,
            duration: parseFloat(o.duration ?? '') || 0,
          })),
        }),
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
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-[26rem] shrink-0 space-y-4">
          <TaskInformationPanel items={taskItems} onChange={setTaskItems}
            onAdd={openAddTask} onEdit={openEditTask} />

          <DraggableComboboxPanel title="Product Options" buttonText="Add Product Option"
            data={linkedOptions} onChange={setLinkedOptions} options={optionChoices} showAmount showDuration />
        </div>
      </div>

      <TaskInformationDialog open={taskDialogOpen} setOpen={setTaskDialogOpen}
        value={editingTaskIndex !== undefined ? taskItems[editingTaskIndex] : undefined}
        onSave={handleTaskSave} />
    </div>
  )
}
