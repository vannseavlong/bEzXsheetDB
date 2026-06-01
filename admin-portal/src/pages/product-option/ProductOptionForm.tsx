import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CustomHeader, MultiLanguageInput } from '@/components/shared'
import { mockProductOptions } from '@/data/productOptions'
import type { MultiLangValue } from '@/types'

type OptionType = 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'TOGGLE'

interface OptionItem {
  id: string
  nameEn: string
}

interface FormState {
  name: MultiLangValue
  type: OptionType
  status: boolean
  items: OptionItem[]
}

function generateId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function ProductOptionForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm] = useState<FormState>({
    name: { en: '', km: '', vi: '', tw: '', cn: '' },
    type: 'SINGLE_CHOICE',
    status: true,
    items: [],
  })

  useEffect(() => {
    if (!isNew && id) {
      const found = mockProductOptions.find((o) => o.id === id)
      if (found) {
        const generatedItems: OptionItem[] = Array.from({ length: found.itemCount }, (_, i) => ({
          id: generateId(),
          nameEn: '',
        }))
        setForm({
          name: { en: found.nameEn, km: '', vi: '', tw: '', cn: '' },
          type: found.type as OptionType,
          status: found.status,
          items: generatedItems,
        })
      }
    }
  }, [id, isNew])

  function handleSave() {
    console.log('ProductOptionForm save:', form)
  }

  function handleAddItem() {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { id: generateId(), nameEn: '' }],
    }))
  }

  function handleRemoveItem(itemId: string) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== itemId),
    }))
  }

  function handleItemChange(itemId: string, value: string) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === itemId ? { ...i, nameEn: value } : i)),
    }))
  }

  return (
    <div className="flex flex-col h-full">
      <CustomHeader
        title={isNew ? 'New Product Option' : 'Edit Product Option'}
        onBack={() => navigate('/product-option')}
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

            {/* Type */}
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(val) => setForm((prev) => ({ ...prev, type: val as OptionType }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE_CHOICE">Single Choice</SelectItem>
                  <SelectItem value="MULTI_CHOICE">Multi Choice</SelectItem>
                  <SelectItem value="TOGGLE">Toggle</SelectItem>
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

            <Separator />

            {/* Option Items */}
            <div className="space-y-3">
              <p className="font-semibold text-sm">Option Items</p>

              {form.items.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No items yet. Click "+ Add Item" to add options.
                </p>
              )}

              <div className="space-y-2">
                {form.items.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-6 shrink-0 text-right">
                      {index + 1}.
                    </span>
                    <Input
                      value={item.nameEn}
                      onChange={(e) => handleItemChange(item.id, e.target.value)}
                      placeholder="Item name (English)"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-600"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleAddItem}
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
