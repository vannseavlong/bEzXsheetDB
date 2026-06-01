import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CustomHeader, MultiLanguageInput } from '@/components/shared'
import { mockCategories } from '@/data/categories'
import { mockCategoryAddons } from '@/data/categoryAddons'

interface MultiLangVal {
  en: string
  km: string
  vi: string
  tw: string
  cn: string
}

interface AddonItem {
  id: string
  nameEn: string
  type: 'Fixed' | 'Per Item' | 'Per Hour'
  price: number
}

function emptyLang(val = ''): MultiLangVal {
  return { en: val, km: '', vi: '', tw: '', cn: '' }
}

function emptyItem(): AddonItem {
  return {
    id: `item-${Date.now()}-${Math.random()}`,
    nameEn: '',
    type: 'Fixed',
    price: 0,
  }
}

export default function CategoryAddonForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = id !== 'new'

  const [name, setName] = useState<MultiLangVal>(emptyLang())
  const [status, setStatus] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [items, setItems] = useState<AddonItem[]>([emptyItem()])
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    if (isEdit && id) {
      const addon = (mockCategoryAddons as any[]).find((a) => a.id === id)
      if (addon) {
        setName(emptyLang(addon.nameEn))
        setStatus(addon.status)
        setSelectedCategories(addon.categories ?? [])
        if (addon.items && addon.items.length > 0) {
          setItems(addon.items)
        }
      }
    }
  }, [id, isEdit])

  function updateItem(idx: number, field: keyof AddonItem, value: string | number) {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    )
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()])
  }

  function toggleCategory(catName: string) {
    setSelectedCategories((prev) =>
      prev.includes(catName)
        ? prev.filter((c) => c !== catName)
        : [...prev, catName]
    )
  }

  function handleSave() {
    const payload = {
      id: isEdit ? id : undefined,
      name,
      status,
      categories: selectedCategories,
      items,
    }
    console.log('Save category addon:', payload)
    setSaveMsg('Saved successfully!')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  return (
    <div className="flex flex-col h-full">
      <CustomHeader
        title={isEdit ? 'Edit Category Add-On' : 'New Category Add-On'}
        onBack={() => navigate(-1)}
        onSave={handleSave}
      >
        {saveMsg && (
          <span className="text-sm text-green-600 font-medium">{saveMsg}</span>
        )}
      </CustomHeader>

      <div className="p-6 overflow-auto space-y-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Name */}
            <MultiLanguageInput
              label="Name"
              required
              values={name}
              onChange={setName}
            />

            {/* Status */}
            <div className="flex items-center gap-3">
              <Switch checked={status} onCheckedChange={setStatus} id="status" />
              <Label htmlFor="status" className="cursor-pointer font-medium">
                {status ? 'Active' : 'Inactive'}
              </Label>
            </div>

            {/* Associated Categories */}
            <div className="space-y-2">
              <Label>Associated Categories</Label>
              <ScrollArea className="h-48 rounded-md border p-3">
                <div className="grid grid-cols-2 gap-2">
                  {(mockCategories as any[]).map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-gray-50 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedCategories.includes(cat.nameEn)}
                        onCheckedChange={() => toggleCategory(cat.nameEn)}
                      />
                      <span className="text-sm">{cat.nameEn}</span>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Add-On Items Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Add-On Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Name</TableHead>
                    <TableHead className="w-40">Type</TableHead>
                    <TableHead className="w-36">Price ($)</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          value={item.nameEn}
                          onChange={(e) => updateItem(idx, 'nameEn', e.target.value)}
                          placeholder="Item name"
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.type}
                          onValueChange={(v) =>
                            updateItem(idx, 'type', v as AddonItem['type'])
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fixed">Fixed</SelectItem>
                            <SelectItem value="Per Item">Per Item</SelectItem>
                            <SelectItem value="Per Hour">Per Hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            $
                          </span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) =>
                              updateItem(idx, 'price', parseFloat(e.target.value) || 0)
                            }
                            className="h-8 pl-6"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-500"
                          onClick={() => removeItem(idx)}
                          disabled={items.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 gap-1.5 px-0"
              onClick={addItem}
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
