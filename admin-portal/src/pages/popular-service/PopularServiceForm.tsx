import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CustomHeader } from '@/components/shared/CustomHeader'
import { MultiLanguageInput } from '@/components/shared/MultiLanguageInput'
import { ProfilePicker } from '@/components/shared/ProfilePicker'
import { categoriesApi } from '@/api/categories'
import { productsApi } from '@/api/products'
import { popularServicesApi } from '@/api/popular-services'
import { uploadImage } from '@/api/upload'

type MultiLangVal = { en: string; km: string; vi: string; tw: string; cn: string }
function emptyLang(val = ''): MultiLangVal { return { en: val, km: '', vi: '', tw: '', cn: '' } }

type ItemType = 'CATEGORY' | 'PRODUCT'
interface ServiceItem { id: string; type: ItemType; refId: string; priority: number }

export default function PopularServiceForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = id !== 'new'

  const [name, setName] = useState<MultiLangVal>(emptyLang())
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [displayOrder, setDisplayOrder] = useState(1)
  const [imageUrl, setImageUrl] = useState('')
  const [items, setItems] = useState<ServiceItem[]>([])
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([])
  const [productOptions, setProductOptions] = useState<{ label: string; value: string }[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    categoriesApi.list().then(rows => setCategoryOptions(rows.map(r => ({ label: r.name_en, value: r._id })))).catch(console.error)
    productsApi.list().then(rows => setProductOptions(rows.map(r => ({ label: r.name_en, value: r._id })))).catch(console.error)
  }, [])

  useEffect(() => {
    if (!isEdit || !id) return
    Promise.all([
      popularServicesApi.get(id),
      popularServicesApi.getItems(id),
    ]).then(([svc, svcItems]) => {
      setName(emptyLang(svc.name_en))
      setStatus(svc.status ? 'active' : 'inactive')
      setDisplayOrder(svc.display_order)
      setImageUrl(svc.image_url ?? '')
      setItems(svcItems.map(i => ({
        id: i._id,
        type: i.type,
        refId: i.type === 'CATEGORY' ? (i.category_id ?? '') : (i.product_id ?? ''),
        priority: i.priority,
      })))
    }).catch(console.error)
  }, [id, isEdit])

  function addItem() {
    setItems(prev => [...prev, { id: `tmp_${Date.now()}`, type: 'CATEGORY', refId: '', priority: prev.length }])
  }

  function updateItem(itemId: string, field: keyof ServiceItem, value: string | number) {
    setItems(prev => prev.map(i =>
      i.id === itemId ? { ...i, [field]: value, ...(field === 'type' ? { refId: '' } : {}) } : i
    ))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        name_en: name.en, name_km: name.km,
        image_url: imageUrl || undefined,
        status: status === 'active',
        display_order: displayOrder,
      }

      let serviceId = id!
      if (isEdit) {
        await popularServicesApi.update(serviceId, payload)
      } else {
        const created = await popularServicesApi.create(payload)
        serviceId = created._id
      }

      await popularServicesApi.setItems(serviceId, items.map(i => ({
        type: i.type, ref_id: i.refId, priority: i.priority,
      })))

      navigate('/popular-service')
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <CustomHeader
        title={isEdit ? 'Edit Popular Service' : 'New Popular Service'}
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
                  <Label>Display Order</Label>
                  <Input type="number" min="1" value={displayOrder}
                    onChange={e => setDisplayOrder(parseInt(e.target.value) || 1)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-96 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Featured Items</CardTitle>
                <Button size="sm" type="button" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-1" />Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.length === 0 && (
                <p className="text-sm text-muted-foreground">No items yet. Click "Add Item" to add.</p>
              )}
              {items.map((item, idx) => (
                <div key={item.id} className="border rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Item {idx + 1}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600"
                      onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Type</Label>
                      <Select value={item.type} onValueChange={v => updateItem(item.id, 'type', v)}>
                        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CATEGORY">Category</SelectItem>
                          <SelectItem value="PRODUCT">Product</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Priority</Label>
                      <Input type="number" min="0" className="h-8" value={item.priority}
                        onChange={e => updateItem(item.id, 'priority', parseInt(e.target.value) || 0)} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">{item.type === 'CATEGORY' ? 'Category' : 'Product'}</Label>
                    <Select value={item.refId} onValueChange={v => updateItem(item.id, 'refId', v)}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder={`Select ${item.type.toLowerCase()}…`} />
                      </SelectTrigger>
                      <SelectContent>
                        {(item.type === 'CATEGORY' ? categoryOptions : productOptions).map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
