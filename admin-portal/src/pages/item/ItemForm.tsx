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
import { mockItems } from '@/data/items'
import type { Item, MultiLangValue } from '@/types'

const allItems = mockItems as Item[]
const CATEGORIES = Array.from(new Set(allItems.map((i) => i.category)))

interface FormState {
  name: MultiLangValue
  category: string
  status: boolean
  sortOrder: number
}

export default function ItemForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm] = useState<FormState>({
    name: { en: '', km: '', vi: '', tw: '', cn: '' },
    category: CATEGORIES[0] ?? '',
    status: true,
    sortOrder: 1,
  })

  useEffect(() => {
    if (!isNew && id) {
      const found = allItems.find((i) => i.id === id)
      if (found) {
        setForm({
          name: { en: found.nameEn, km: '', vi: '', tw: '', cn: '' },
          category: found.category,
          status: found.status,
          sortOrder: found.sortOrder,
        })
      }
    }
  }, [id, isNew])

  function handleSave() {
    console.log('ItemForm save:', form)
  }

  return (
    <div className="flex flex-col h-full">
      <CustomHeader
        title={isNew ? 'New Item' : 'Edit Item'}
        onBack={() => navigate('/item')}
        onSave={handleSave}
        saveLabel="Save"
        showSave
      />

      <div className="flex-1 overflow-auto px-6 py-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 space-y-6">
            {/* Name */}
            <MultiLanguageInput
              label="Name"
              values={form.name}
              onChange={(vals) => setForm((prev) => ({ ...prev, name: vals }))}
              required
              type="input"
            />

            {/* Category */}
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
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <Switch
                checked={form.status}
                onCheckedChange={(val) => setForm((prev) => ({ ...prev, status: val }))}
                id="status-switch"
              />
              <Label htmlFor="status-switch">Active</Label>
            </div>

            {/* Sort Order */}
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
