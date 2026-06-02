import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Save } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockCleaners } from '@/data/cleaners'

const DAYS = [
  { label: 'Monday', value: 'Monday' },
  { label: 'Tuesday', value: 'Tuesday' },
  { label: 'Wednesday', value: 'Wednesday' },
  { label: 'Thursday', value: 'Thursday' },
  { label: 'Friday', value: 'Friday' },
  { label: 'Saturday', value: 'Saturday' },
  { label: 'Sunday', value: 'Sunday' },
]

const EXPERTISES = [
  'Home Cleaning',
  'Deep Cleaning',
  'Office Cleaning',
  'Post-Construction',
  'Laundry',
  'Premium Cleaning',
]

export default function CleanerForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id && id !== 'new'
  const existing = isEdit ? mockCleaners.find((c) => c.id === id) : null

  const [name, setName] = useState(existing?.name ?? '')
  const [gender, setGender] = useState(existing?.gender ?? 'Female')
  const [role, setRole] = useState(existing?.role ?? 'MEMBER')
  const [status, setStatus] = useState(existing?.status ? 'Active' : 'Inactive')
  const [autoAssign, setAutoAssign] = useState(existing?.autoAssign ?? false)
  const [joinedDate, setJoinedDate] = useState(existing?.joinedDate ?? '')
  const [expertises, setExpertises] = useState<string[]>(existing?.expertises ?? [])
  const [dayOffs, setDayOffs] = useState<string[]>(existing?.cleanerWeeklyOffs ?? [])

  useEffect(() => {
    if (existing) {
      setName(existing.name)
      setGender(existing.gender)
      setRole(existing.role)
      setStatus(existing.status ? 'Active' : 'Inactive')
      setAutoAssign(existing.autoAssign)
      setJoinedDate(existing.joinedDate)
      setExpertises(existing.expertises)
      setDayOffs(existing.cleanerWeeklyOffs)
    }
  }, [])

  const toggleExpertise = (e: string) => {
    setExpertises((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    )
  }

  const toggleDayOff = (day: string) => {
    setDayOffs((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleSave = () => {
    console.log('Save cleaner:', { name, gender, role, status, autoAssign, joinedDate, expertises, dayOffs })
    navigate('/cleaner')
  }

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/cleaner')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-semibold">{isEdit ? 'Edit Cleaner' : 'New Cleaner'}</h1>
        </div>
        <Button size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>

      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-2xl font-bold cursor-pointer hover:bg-gray-200 select-none">
                  {name?.charAt(0) || '?'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                <div className="flex flex-col gap-1.5">
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Cleaner name" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LEADER">Leader</SelectItem>
                      <SelectItem value="MEMBER">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Joined Date</Label>
                  <Input type="date" value={joinedDate} onChange={(e) => setJoinedDate(e.target.value)} />
                </div>

                <div className="flex items-center gap-3 pt-5">
                  <Checkbox id="autoAssign" checked={autoAssign} onCheckedChange={(v) => setAutoAssign(!!v)} />
                  <Label htmlFor="autoAssign">Allow Auto Assign</Label>
                </div>

                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <Label className="mb-2 block">Expertise</Label>
                  <div className="flex flex-wrap gap-2">
                    {EXPERTISES.map((e) => (
                      <button key={e} type="button" onClick={() => toggleExpertise(e)}>
                        <Badge variant={expertises.includes(e) ? 'default' : 'outline'} className="cursor-pointer text-sm px-3 py-1">
                          {e}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <Label className="mb-3 block">Select Weekly Day Off</Label>
                  <div className="flex flex-wrap gap-3">
                    {DAYS.map((day) => (
                      <div key={day.value} className="flex items-center gap-2 min-w-[130px]">
                        <Checkbox id={day.value} checked={dayOffs.includes(day.value)} onCheckedChange={() => toggleDayOff(day.value)} />
                        <Label htmlFor={day.value} className="cursor-pointer">{day.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
