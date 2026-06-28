import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CustomHeader } from '@/components/shared/CustomHeader'
import { MultiLanguageInput } from '@/components/shared/MultiLanguageInput'
import NewCategoryAddonCard, { type AddonItemState } from '@/components/category/NewCategoryAddonCard'
import {
  useCategoryAddon, useAddonItems, useCreateCategoryAddon, useUpdateCategoryAddon,
  useCreateAddonItem, useRemoveAddonItem,
} from '@/api/category-addons'

type MultiLangVal = { en: string; km: string; vi: string; tw: string; cn: string }
function emptyLang(val = ''): MultiLangVal { return { en: val, km: '', vi: '', tw: '', cn: '' } }

function emptyItem(): AddonItemState {
  return {
    id: `tmp_${Date.now()}_${Math.random()}`,
    imgUrl: '', nameEn: '', nameKm: '', nameVi: '', nameTw: '', nameCn: '',
    amount: '', duration: '', status: true, type: 'SINGLE',
  }
}

export default function CategoryAddonForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = id !== 'new'

  const [name, setName] = useState<MultiLangVal>(emptyLang())
  const [badge, setBadge] = useState<MultiLangVal>(emptyLang())
  const [selectionType, setSelectionType] = useState<'SINGLE' | 'MULTIPLE'>('SINGLE')
  const [isRequired, setIsRequired] = useState(false)
  const [status, setStatus] = useState(true)
  const [items, setItems] = useState<AddonItemState[]>([emptyItem()])
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const editId = isEdit ? id : undefined
  const { data: addon } = useCategoryAddon(editId)
  const { data: dbItems } = useAddonItems(editId)

  useEffect(() => {
    if (!addon || !dbItems) return
    setName(emptyLang(addon.name_en))
    setBadge(emptyLang(addon.badge_en ?? ''))
    setSelectionType(addon.selection_type)
    setIsRequired(addon.is_required)
    setStatus(addon.status)
    setItems(dbItems.map(i => ({
      id: i._id,
      imgUrl: i.img_url ?? '',
      nameEn: i.name_en, nameKm: i.name_km,
      nameVi: '', nameTw: '', nameCn: '',
      amount: String(i.amount),
      duration: String(i.duration),
      status: i.status,
      type: i.type as 'SINGLE' | 'MULTIPLE',
    })))
  }, [addon, dbItems])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex(i => i.id === active.id)
    const newIndex = items.findIndex(i => i.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) setItems(arrayMove(items, oldIndex, newIndex))
  }

  function handleFieldChange(itemId: string, field: keyof AddonItemState, value: string | boolean) {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, [field]: value } : i))
  }

  const createCategoryAddon = useCreateCategoryAddon()
  const updateCategoryAddon = useUpdateCategoryAddon()
  const createAddonItem = useCreateAddonItem()
  const removeAddonItem = useRemoveAddonItem()

  async function handleSave() {
    setSaving(true)
    try {
      const groupPayload = {
        name_en: name.en, name_km: name.km,
        badge_en: badge.en || undefined, badge_km: badge.km || undefined,
        selection_type: selectionType, is_required: isRequired, status,
      }

      let addonId = id!
      if (isEdit) {
        await updateCategoryAddon.mutateAsync({ id: addonId, data: groupPayload })
        // Replace items: delete all existing, then recreate
        await Promise.all((dbItems ?? []).map(e => removeAddonItem.mutateAsync(e._id)))
      } else {
        const created = await createCategoryAddon.mutateAsync(groupPayload)
        addonId = created._id
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        await createAddonItem.mutateAsync({
          addonId,
          data: {
            name_en: item.nameEn, name_km: item.nameKm,
            type: item.type, img_url: item.imgUrl || undefined,
            amount: parseFloat(item.amount) || 0,
            duration: parseFloat(item.duration) || 0,
            status: item.status, sort: i,
          },
        })
      }

      navigate('/category-addon')
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <CustomHeader
        title={isEdit ? 'Edit Category Add-On' : 'New Category Add-On'}
        onBack={() => navigate(-1)}
        onSave={handleSave}
        isLoading={saving}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Group</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MultiLanguageInput label="Name" required values={name} onChange={setName} />
              <MultiLanguageInput label="Badge" values={badge} onChange={setBadge} />

              <div className="space-y-1.5">
                <Label>Selection Type</Label>
                <Select value={selectionType} onValueChange={v => setSelectionType(v as 'SINGLE' | 'MULTIPLE')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE">Single</SelectItem>
                    <SelectItem value="MULTIPLE">Multiple</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={status ? 'true' : 'false'} onValueChange={v => setStatus(v === 'true')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Switch checked={isRequired} onCheckedChange={setIsRequired} id="is-required" />
                <Label htmlFor="is-required" className="cursor-pointer">Is Required</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Add-on Items</CardTitle>
              {items.length > 0 && (
                <Button variant="link" className="text-destructive pr-0! pt-0!"
                  type="button" onClick={() => setItems([])}>Clear All</Button>
              )}
            </div>
          </CardHeader>
          {items.length > 0 && (
            <CardContent>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col divide-y divide-accent gap-0">
                    {items.map((item, index) => (
                      <div key={item.id} className="py-6 first:pt-0">
                        <NewCategoryAddonCard item={item} index={index}
                          onFieldChange={handleFieldChange}
                          onDelete={() => setItems(prev => prev.filter(i => i.id !== item.id))} />
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          )}
          <CardFooter className="justify-end">
            <Button type="button" variant="link" className="pr-0! pb-0! gap-1"
              onClick={() => setItems(prev => [...prev, emptyItem()])}>
              <Plus className="h-4 w-4" />Add Another Item
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
