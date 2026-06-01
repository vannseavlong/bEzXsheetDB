import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ImageIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CustomHeader, MultiLanguageInput } from '@/components/shared'
import { mockPopularServices } from '@/data/popularServices'
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

export default function PopularServiceForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = id !== 'new'

  const [name, setName] = useState<MultiLangVal>(emptyLang())
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [displayOrder, setDisplayOrder] = useState<number>(1)
  const [categoryId, setCategoryId] = useState('')
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    if (isEdit && id) {
      const svc = (mockPopularServices as any[]).find((s) => s.id === id)
      if (svc) {
        setName(emptyLang(svc.nameEn))
        setStatus(svc.status ? 'active' : 'inactive')
        setDisplayOrder(svc.displayOrder)
        setCategoryId(svc.categoryId ?? '')
      }
    }
  }, [id, isEdit])

  function handleSave() {
    const payload = {
      id: isEdit ? id : undefined,
      name,
      status: status === 'active',
      displayOrder,
      categoryId,
    }
    console.log('Save popular service:', payload)
    setSaveMsg('Saved successfully!')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  return (
    <div className="flex flex-col h-full">
      <CustomHeader
        title={isEdit ? 'Edit Popular Service' : 'New Popular Service'}
        onBack={() => navigate(-1)}
        onSave={handleSave}
      >
        {saveMsg && (
          <span className="text-sm text-green-600 font-medium">{saveMsg}</span>
        )}
      </CustomHeader>

      <div className="p-6 overflow-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Image upload placeholder */}
            <div className="space-y-1.5">
              <Label>Image</Label>
              <div className="w-40 h-40 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 bg-gray-50 cursor-pointer hover:border-blue-400 transition-colors">
                <ImageIcon className="h-10 w-10 text-gray-400" />
                <span className="text-xs text-gray-500">Click to upload</span>
              </div>
            </div>

            {/* Name */}
            <MultiLanguageInput
              label="Name"
              required
              values={name}
              onChange={setName}
            />

            {/* Status */}
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as 'active' | 'inactive')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Display Order */}
            <div className="space-y-1.5">
              <Label>Display Order</Label>
              <Input
                type="number"
                min="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category..." />
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
