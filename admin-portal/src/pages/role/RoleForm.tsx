import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRoles, useCreateRole, useUpdateRole } from '@/api/rbac'

export default function RoleForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')

  const { data: rolesResult } = useRoles()
  useEffect(() => {
    if (isNew || !id || !rolesResult) return
    const role = rolesResult.data.find(r => String(r.id) === id)
    if (role) {
      setName(role.name)
      setCode(role.code)
      setDescription(role.description ?? '')
    }
  }, [id, isNew, rolesResult])

  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const saving = createRole.isPending || updateRole.isPending

  const handleSave = async () => {
    if (!name.trim() || !code.trim()) return
    try {
      if (isNew) {
        await createRole.mutateAsync({ name: name.trim(), code: code.trim().toUpperCase(), description: description.trim() })
      } else {
        await updateRole.mutateAsync({ id: id!, data: { name: name.trim(), description: description.trim() } })
      }
      navigate('/roles')
    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10" style={{ height: 88 }}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/roles')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-semibold">{isNew ? 'New Role' : 'Edit Role'}</h1>
        </div>
        <Button size="sm" onClick={handleSave} disabled={!name.trim() || !code.trim() || saving}>
          <Save className="h-4 w-4 mr-1" />
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>

      <div className="p-6">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Role Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pb-6">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  placeholder="e.g. Ops Manager"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Code <span className="text-xs text-muted-foreground">(unique identifier)</span></Label>
                <Input
                  placeholder="e.g. OPS_MANAGER"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  disabled={!isNew}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input
                  placeholder="Short description of the role"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
