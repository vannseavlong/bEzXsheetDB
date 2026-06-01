import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { CustomHeader } from '@/components/shared'
import { mockBlockedSchedules } from '@/data/blockedSchedule'
import { mockCleaners } from '@/data/cleaners'
import type { BlockedSchedule, Cleaner } from '@/types'

const allSchedules = mockBlockedSchedules as BlockedSchedule[]
const allCleaners = mockCleaners as Cleaner[]

const ALL_CLEANERS_VALUE = 'All Cleaners'

interface FormState {
  name: string
  date: string
  startTime: string
  endTime: string
  address: string
  selectedCleaners: string[]
}

export default function BlockedScheduleForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm] = useState<FormState>({
    name: '',
    date: '',
    startTime: '00:00',
    endTime: '23:59',
    address: '',
    selectedCleaners: [],
  })

  useEffect(() => {
    if (!isNew && id) {
      const found = allSchedules.find((s) => s.id === id)
      if (found) {
        setForm({
          name: found.name,
          date: found.blockedDate,
          startTime: found.startTime,
          endTime: found.endTime,
          address: found.associatedAddress ?? '',
          selectedCleaners: found.cleanerDetails ?? [],
        })
      }
    }
  }, [id, isNew])

  function handleSave() {
    console.log('BlockedScheduleForm save:', form)
  }

  function isAllCleanersSelected(): boolean {
    return form.selectedCleaners.includes(ALL_CLEANERS_VALUE)
  }

  function handleAllCleanersToggle(checked: boolean) {
    if (checked) {
      setForm((prev) => ({
        ...prev,
        selectedCleaners: [ALL_CLEANERS_VALUE, ...allCleaners.map((c) => c.name)],
      }))
    } else {
      setForm((prev) => ({ ...prev, selectedCleaners: [] }))
    }
  }

  function handleCleanerToggle(cleanerName: string, checked: boolean) {
    setForm((prev) => {
      let updated = checked
        ? [...prev.selectedCleaners, cleanerName]
        : prev.selectedCleaners.filter((n) => n !== cleanerName && n !== ALL_CLEANERS_VALUE)

      // If all individual cleaners are now selected, also add "All Cleaners"
      const allIndividualSelected = allCleaners.every((c) => updated.includes(c.name))
      if (allIndividualSelected && !updated.includes(ALL_CLEANERS_VALUE)) {
        updated = [ALL_CLEANERS_VALUE, ...updated]
      }

      return { ...prev, selectedCleaners: updated }
    })
  }

  return (
    <div className="flex flex-col h-full">
      <CustomHeader
        title={isNew ? 'New Blocked Schedule' : 'Edit Blocked Schedule'}
        onBack={() => navigate('/blocked-schedule')}
        onSave={handleSave}
        saveLabel="Save"
        showSave
      />

      <div className="flex-1 overflow-auto px-6 py-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter schedule name"
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>

            {/* Start Time */}
            <div className="space-y-1.5">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
              />
            </div>

            {/* End Time */}
            <div className="space-y-1.5">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={form.endTime}
                onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label htmlFor="address">Address (optional)</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Enter associated address"
              />
            </div>

            {/* Cleaners */}
            <div className="space-y-2">
              <Label>Cleaners</Label>
              <div className="max-h-48 overflow-y-auto rounded-md border p-3 space-y-2">
                {/* All Cleaners option */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="all-cleaners"
                    checked={isAllCleanersSelected()}
                    onCheckedChange={(checked) => handleAllCleanersToggle(checked === true)}
                  />
                  <Label htmlFor="all-cleaners" className="font-medium cursor-pointer">
                    All Cleaners
                  </Label>
                </div>

                <div className="border-t pt-2 space-y-2">
                  {allCleaners.map((cleaner) => (
                    <div key={cleaner.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`cleaner-${cleaner.id}`}
                        checked={form.selectedCleaners.includes(cleaner.name)}
                        onCheckedChange={(checked) =>
                          handleCleanerToggle(cleaner.name, checked === true)
                        }
                      />
                      <Label htmlFor={`cleaner-${cleaner.id}`} className="cursor-pointer font-normal">
                        {cleaner.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
