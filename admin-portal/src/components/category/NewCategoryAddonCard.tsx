import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Grip, Minus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ProfilePicker } from '@/components/shared/ProfilePicker'
import { MultiLanguageInput } from '@/components/shared/MultiLanguageInput'
import { uploadImage } from '@/api/upload'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

export type AddonItemState = {
  id: string
  imgUrl: string
  nameEn: string
  nameKm: string
  nameVi: string
  nameTw: string
  nameCn: string
  amount: string
  duration: string
  status: boolean
  type: 'SINGLE' | 'MULTIPLE'
}

type MultiLangVal = { en: string; km: string; vi: string; tw: string; cn: string }

type Props = {
  item: AddonItemState
  index: number
  onFieldChange: (id: string, field: keyof AddonItemState, value: string | boolean) => void
  onDelete: () => void
}

export default function NewCategoryAddonCard({ item, index, onFieldChange, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const [nameVals, setNameVals] = useState<MultiLangVal>({
    en: item.nameEn, km: item.nameKm, vi: item.nameVi, tw: item.nameTw, cn: item.nameCn,
  })

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  const handleNameChange = (vals: MultiLangVal) => {
    setNameVals(vals)
    onFieldChange(item.id, 'nameEn', vals.en)
    onFieldChange(item.id, 'nameKm', vals.km)
    onFieldChange(item.id, 'nameVi', vals.vi)
    onFieldChange(item.id, 'nameTw', vals.tw)
    onFieldChange(item.id, 'nameCn', vals.cn)
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center gap-3 mb-4">
        <button type="button" className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
          {...attributes} {...listeners}>
          <Grip className="h-4 w-4" />
        </button>
        <span className="flex-1 text-sm font-medium">Item {index + 1}</span>
        <button type="button" onClick={onDelete} className="p-1 text-red-400 hover:text-red-600">
          <Minus className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[96px_1fr] gap-6 items-start">
        <ProfilePicker
          imageUrl={item.imgUrl}
          onUpload={uploadImage}
          onChange={(_, url) => onFieldChange(item.id, 'imgUrl', url)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MultiLanguageInput label="Name" values={nameVals} onChange={handleNameChange} required />

          <div className="space-y-1.5">
            <Label>Amount</Label>
            <Input type="number" min="0" placeholder="Amount"
              value={item.amount}
              onChange={e => onFieldChange(item.id, 'amount', e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Duration</Label>
            <Input type="number" min="0" placeholder="Duration"
              value={item.duration}
              onChange={e => onFieldChange(item.id, 'duration', e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={item.status ? 'true' : 'false'}
              onValueChange={v => onFieldChange(item.id, 'status', v === 'true')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={item.type} onValueChange={v => onFieldChange(item.id, 'type', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE">Single</SelectItem>
                <SelectItem value="MULTIPLE">Multiple</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
