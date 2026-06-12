import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export type LangData = { title: string; description: string[] }
export type TaskData = { en: LangData; km: LangData; vi: LangData; tw: LangData; cn: LangData }

const LANGS = [
  { value: 'en' as const, label: 'English' },
  { value: 'km' as const, label: 'Khmer' },
  { value: 'vi' as const, label: 'Vietnamese' },
  { value: 'tw' as const, label: 'Traditional Chinese' },
  { value: 'cn' as const, label: 'Simplified Chinese' },
]
type Lang = 'en' | 'km' | 'vi' | 'tw' | 'cn'

function emptyLang(): LangData { return { title: '', description: [] } }
export function emptyTaskData(): TaskData {
  return { en: emptyLang(), km: emptyLang(), vi: emptyLang(), tw: emptyLang(), cn: emptyLang() }
}

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  title?: string
  value?: TaskData
  onSave: (data: TaskData) => void
}

export function TaskInformationDialog({ open, setOpen, title = 'Task Information', value, onSave }: Props) {
  const [draft, setDraft] = useState<TaskData>(value ?? emptyTaskData())

  useEffect(() => {
    if (open) setDraft(value ?? emptyTaskData())
  }, [open, value])

  const updateTitle = (lang: Lang, val: string) =>
    setDraft(p => ({ ...p, [lang]: { ...p[lang], title: val } }))

  const updateDesc = (lang: Lang, idx: number, val: string) =>
    setDraft(p => ({
      ...p,
      [lang]: { ...p[lang], description: p[lang].description.map((d, i) => i === idx ? val : d) },
    }))

  const addDesc = (lang: Lang) =>
    setDraft(p => ({ ...p, [lang]: { ...p[lang], description: [...p[lang].description, ''] } }))

  const removeDesc = (lang: Lang, idx: number) =>
    setDraft(p => ({
      ...p,
      [lang]: { ...p[lang], description: p[lang].description.filter((_, i) => i !== idx) },
    }))

  const isValid = LANGS.every(l => draft[l.value].title.trim().length > 0 && draft[l.value].description.length > 0)

  return (
    <Dialog open={open} onOpenChange={v => !v && setOpen(false)}>
      <DialogContent
        className="max-w-2xl flex flex-col p-0 h-[70vh] gap-0"
        onInteractOutside={e => e.preventDefault()}
      >
        <DialogHeader className="p-6 pb-0 shrink-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="en" className="flex flex-col h-full">
            <div className="px-6 pt-4 shrink-0">
              <TabsList>
                {LANGS.map(l => <TabsTrigger key={l.value} value={l.value}>{l.label}</TabsTrigger>)}
              </TabsList>
            </div>
            <div className="flex-1 overflow-auto px-6 py-4">
              {LANGS.map(({ value: lang, label }) => (
                <TabsContent key={lang} value={lang} className="mt-0 space-y-4">
                  <div className="space-y-1.5">
                    <Label>Title <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder={`Title in ${label}`}
                      value={draft[lang].title}
                      onChange={e => updateTitle(lang, e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description items <span className="text-red-500">*</span></Label>
                    {draft[lang].description.map((d, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={d}
                          onChange={e => updateDesc(lang, i, e.target.value)}
                          placeholder={`Item ${i + 1}`}
                          className="flex-1"
                        />
                        <Button type="button" variant="ghost" size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-red-500"
                          onClick={() => removeDesc(lang, i)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="ghost" size="sm"
                      className="text-blue-600 hover:text-blue-700 gap-1.5 px-0"
                      onClick={() => addDesc(lang)}>
                      <Plus className="h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
        <DialogFooter className="border-t p-6 shrink-0">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { onSave(draft); setOpen(false) }} disabled={!isValid}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
