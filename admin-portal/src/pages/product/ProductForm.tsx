import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CustomHeader, MultiLanguageInput } from '@/components/shared'
import { mockProducts } from '@/data/products'
import { mockCategories } from '@/data/categories'

interface MultiLangVal {
  en: string
  km: string
  vi: string
  tw: string
  cn: string
}

function emptyLang(val = ''): MultiLangVal {
  return { en: val, km: '', vi: '', tw: '', cn: '' }
}

export default function ProductForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = id !== 'new'

  const [name, setName] = useState<MultiLangVal>(emptyLang())
  const [categoryId, setCategoryId] = useState('')
  const [basePrice, setBasePrice] = useState<number>(0)
  const [duration, setDuration] = useState<number>(1)
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [sortOrder, setSortOrder] = useState<number>(1)
  const [description, setDescription] = useState('')
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    if (isEdit && id) {
      const product = (mockProducts as any[]).find((p) => p.id === id)
      if (product) {
        setName(emptyLang(product.nameEn))
        setCategoryId(product.categoryId)
        setBasePrice(product.basePrice)
        setDuration(product.duration)
        setStatus(product.status ? 'active' : 'inactive')
        setSortOrder(product.sort)
      }
    }
  }, [id, isEdit])

  function handleSave() {
    const payload = {
      id: isEdit ? id : undefined,
      name,
      categoryId,
      basePrice,
      duration,
      status: status === 'active',
      sortOrder,
      description,
    }
    console.log('Save product:', payload)
    setSaveMsg('Saved successfully!')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  return (
    <div className="flex flex-col h-full">
      <CustomHeader
        title={isEdit ? 'Edit Product' : 'New Product'}
        onBack={() => navigate(-1)}
        onSave={handleSave}
      >
        {saveMsg && (
          <span className="text-sm text-green-600 font-medium">{saveMsg}</span>
        )}
      </CustomHeader>

      <div className="p-6 overflow-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Name — full width */}
            <MultiLanguageInput
              label="Name"
              required
              values={name}
              onChange={setName}
            />

            {/* Grid 2-col */}
            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(mockCategories as any[]).map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as 'active' | 'inactive')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Base Price */}
              <div className="space-y-1.5">
                <Label>Base Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                    className="pl-7"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <Label>Duration</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    hours
                  </span>
                </div>
              </div>

              {/* Sort Order */}
              <div className="space-y-1.5">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  min="1"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description in English..."
                rows={4}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
