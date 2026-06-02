import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MultiLanguageInput } from '@/components/shared'
import { rolesData } from '@/data/roles'

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

export default function RoleForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id && id !== 'new'
  const existing = isEdit ? rolesData.find((r) => r.id === id) : null

  const [name, setName] = useState<MultiLangVal>(emptyLang(existing?.role ?? ''))
  const [status, setStatus] = useState(existing?.status ?? 'Active')

  const handleSave = () => {
    console.log('Save role:', { name, status })
    navigate('/roles')
  }

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10" style={{ height: 88 }}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/roles')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-semibold">{isEdit ? 'Edit Role' : 'New Role'}</h1>
        </div>
        <Button size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                <MultiLanguageInput
                  label="Role Name"
                  values={name}
                  onChange={setName}
                />

                <div className="flex flex-col gap-1.5">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
