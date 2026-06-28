import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { CustomHeader } from '@/components/shared'
import {
  useCleaners, useBlockedSchedule, useCreateBlockedSchedule, useUpdateBlockedSchedule,
} from '@/api/blocked-schedules'

const ALL_CLEANERS_VALUE = '__all__'

interface FormState {
  name: string
  date: string
  startTime: string
  endTime: string
  address: string
  selectedIds: string[]
}

const EMPTY_FORM: FormState = {
  name: '',
  date: '',
  startTime: '00:00',
  endTime: '23:59',
  address: '',
  selectedIds: [],
}

export default function BlockedScheduleForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const { data: cleaners = [] } = useCleaners()

  const { data: schedule } = useBlockedSchedule(isNew ? undefined : id)
  useEffect(() => {
    if (!schedule) return
    const ids: string[] = schedule.cleaner_ids ? JSON.parse(schedule.cleaner_ids) : []
    setForm({
      name: schedule.name,
      date: schedule.blocked_date.slice(0, 10),
      startTime: schedule.start_time,
      endTime: schedule.end_time,
      address: schedule.associated_address ?? '',
      selectedIds: ids,
    })
  }, [schedule])

  function isAllSelected(): boolean {
    return cleaners.length > 0 && cleaners.every(c => form.selectedIds.includes(String(c._id)))
  }

  function handleAllToggle(checked: boolean) {
    setForm(prev => ({
      ...prev,
      selectedIds: checked ? cleaners.map(c => String(c._id)) : [],
    }))
  }

  function handleCleanerToggle(cleanerId: string, checked: boolean) {
    setForm(prev => ({
      ...prev,
      selectedIds: checked
        ? [...prev.selectedIds, cleanerId]
        : prev.selectedIds.filter(id => id !== cleanerId),
    }))
  }

  const createBlockedSchedule = useCreateBlockedSchedule()
  const updateBlockedSchedule = useUpdateBlockedSchedule()

  async function handleSave() {
    if (!form.name.trim() || !form.date) return
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        blocked_date: form.date,
        start_time: form.startTime,
        end_time: form.endTime,
        cleaner_ids: JSON.stringify(form.selectedIds),
        associated_address: form.address.trim() || undefined,
      }
      if (isNew) {
        await createBlockedSchedule.mutateAsync(payload)
      } else {
        await updateBlockedSchedule.mutateAsync({ id: id!, data: payload })
      }
      navigate('/blocked-schedule')
    } catch (err) {
      console.error('BlockedScheduleForm save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <CustomHeader
        title={isNew ? 'New Blocked Schedule' : 'Edit Blocked Schedule'}
        onBack={() => navigate('/blocked-schedule')}
        onSave={handleSave}
        saveLabel={saving ? 'Saving…' : 'Save'}
      />

      <div className="flex-1 overflow-auto px-6 py-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter schedule name"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={form.endTime}
                onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Address (optional)</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Enter associated address"
              />
            </div>

            <div className="space-y-2">
              <Label>Cleaners</Label>
              <div className="max-h-48 overflow-y-auto rounded-md border p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={ALL_CLEANERS_VALUE}
                    checked={isAllSelected()}
                    onCheckedChange={(checked) => handleAllToggle(checked === true)}
                  />
                  <Label htmlFor={ALL_CLEANERS_VALUE} className="font-medium cursor-pointer">
                    All Cleaners
                  </Label>
                </div>
                <div className="border-t pt-2 space-y-2">
                  {cleaners.map((cleaner) => {
                    const cid = String(cleaner._id)
                    return (
                      <div key={cid} className="flex items-center gap-2">
                        <Checkbox
                          id={`cleaner-${cid}`}
                          checked={form.selectedIds.includes(cid)}
                          onCheckedChange={(checked) =>
                            handleCleanerToggle(cid, checked === true)
                          }
                        />
                        <Label htmlFor={`cleaner-${cid}`} className="cursor-pointer font-normal">
                          {cleaner.name}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
