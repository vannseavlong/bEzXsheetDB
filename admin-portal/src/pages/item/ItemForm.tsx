import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CustomHeader, MultiLanguageInput } from '@/components/shared'
import { itemsApi } from '@/api/items'
import type { MultiLangValue } from '@/types'

interface FormState {
  name: MultiLangValue
  category: string
  status: boolean
  sortOrder: number
}

const EMPTY_FORM: FormState = {
  name: { en: '', km: '', vi: '', tw: '', cn: '' },
  category: '',
  status: true,
  sortOrder: 1,
}

export default function ItemForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [categories, setCategories] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  // Load category list from live data
  useEffect(() => {
    itemsApi.list().then(res => {
      const unique = Array.from(new Set(res.map(i => i.category))).sort()
      setCategories(unique)
      if (isNew && unique.length > 0) {
        setForm(prev => ({ ...prev, category: unique[0] }))
      }
    })
  }, [isNew])

  // Load existing item for edit
  useEffect(() => {
    if (!isNew && id) {
      itemsApi.get(id).then(res => {
        const item = res
        setForm({
          name: { en: item.name_en, km: item.name_km, vi: '', tw: '', cn: '' },
          category: item.category,
          status: item.status,
          sortOrder: item.sort_order,
        })
      })
    }
  }, [id, isNew])

  async function handleSave() {
    if (!form.name.en.trim() || !form.name.km.trim() || !form.category) return
    setSaving(true)
    try {
      const payload = {
        name_en: form.name.en.trim(),
        name_km: form.name.km.trim(),
        category: form.category,
        status: form.status,
        sort_order: form.sortOrder,
      }
      if (isNew) {
        await itemsApi.create(payload)
      } else {
        await itemsApi.update(id!, payload)
      }
      navigate('/item')
    } catch (err) {
      console.error('ItemForm save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <CustomHeader
        title={isNew ? 'New Item' : 'Edit Item'}
        onBack={() => navigate('/item')}
        onSave={handleSave}
        saveLabel={saving ? 'Saving…' : 'Save'}
      />

      <div className="flex-1 overflow-auto px-6 py-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 space-y-6">
            <MultiLanguageInput
              label="Name"
              values={form.name}
              onChange={(vals) => setForm((prev) => ({ ...prev, name: vals }))}
              required
              type="input"
            />

            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm((prev) => ({ ...prev, category: val }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.status}
                onCheckedChange={(val) => setForm((prev) => ({ ...prev, status: val }))}
                id="status-switch"
              />
              <Label htmlFor="status-switch">Active</Label>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sort-order">Sort Order</Label>
              <Input
                id="sort-order"
                type="number"
                min={1}
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, sortOrder: parseInt(e.target.value, 10) || 1 }))
                }
                className="w-32"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
