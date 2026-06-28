import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CustomHeader } from '@/components/shared/CustomHeader'
import { MultiLanguageInput } from '@/components/shared/MultiLanguageInput'
import { useProducts } from '@/api/products'
import { useProductOption, useCreateProductOption, useUpdateProductOption } from '@/api/product-options'

type MultiLangVal = { en: string; km: string; vi: string; tw: string; cn: string }
function emptyLang(val = ''): MultiLangVal { return { en: val, km: '', vi: '', tw: '', cn: '' } }

const TYPE_OPTIONS = [
  { label: 'Fixed', value: 'FIXED' },
  { label: 'Per Item', value: 'PER_ITEM' },
  { label: 'Per Hour', value: 'PER_HOUR' },
]

export default function ProductOptionForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [name, setName] = useState<MultiLangVal>(emptyLang())
  const [productId, setProductId] = useState('')
  const [type, setType] = useState('FIXED')
  const [amount, setAmount] = useState(0)
  const [status, setStatus] = useState(true)
  const [sort, setSort] = useState(0)
  const [saving, setSaving] = useState(false)

  const { data: productsResult } = useProducts()
  const productItems = useMemo(
    () => (productsResult?.data ?? []).map(r => ({ label: r.name_en, value: r._id })),
    [productsResult]
  )

  const { data: option } = useProductOption(isNew ? undefined : id)
  useEffect(() => {
    if (!option) return
    setName(emptyLang(option.name_en))
    setProductId(option.product_id)
    setType(option.type)
    setAmount(option.amount)
    setStatus(option.status)
    setSort(option.sort)
  }, [option])

  const createProductOption = useCreateProductOption()
  const updateProductOption = useUpdateProductOption()

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        product_id: productId, name_en: name.en, name_km: name.km,
        type, amount, status, sort,
      }
      if (isNew) {
        await createProductOption.mutateAsync(payload)
      } else {
        await updateProductOption.mutateAsync({ id: id!, data: payload })
      }
      navigate('/product-option')
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <CustomHeader
        title={isNew ? 'New Product Option' : 'Edit Product Option'}
        onBack={() => navigate('/product-option')}
        onSave={handleSave}
        isLoading={saving}
      />

      <div className="flex-1 overflow-auto px-6 py-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <MultiLanguageInput label="Name" required values={name} onChange={setName} />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Product</Label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger><SelectValue placeholder="Select product…" /></SelectTrigger>
                  <SelectContent>
                    {productItems.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Amount ($)</Label>
                <Input type="number" min="0" step="0.01" value={amount}
                  onChange={e => setAmount(parseFloat(e.target.value) || 0)} />
              </div>

              <div className="space-y-1.5">
                <Label>Sort Order</Label>
                <Input type="number" min="0" value={sort}
                  onChange={e => setSort(parseInt(e.target.value) || 0)} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={status} onCheckedChange={setStatus} id="status-switch" />
              <Label htmlFor="status-switch" className="cursor-pointer">Active</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
