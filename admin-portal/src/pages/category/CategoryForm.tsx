import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, X, Pencil, Trash2, UserCircle2, CheckSquare, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  CustomHeader,
  MultiLanguageInput,
  Uploader,
} from '@/components/shared'
import { mockCategories } from '@/data/categories'
import { mockProducts } from '@/data/products'
import { mockCategoryAddons } from '@/data/categoryAddons'

interface TaskItem {
  id: string
  titleEn: string
  descriptionEn: string[]
}

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

export default function CategoryForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = id !== 'new'

  // Form state
  const [name, setName] = useState<MultiLangVal>(emptyLang())
  const [status, setStatus] = useState(true)
  const [comingSoon, setComingSoon] = useState(false)
  const [recommended, setRecommended] = useState(false)
  const [hasQuantity, setHasQuantity] = useState(false)
  const [note, setNote] = useState('')
  const [taskItems, setTaskItems] = useState<TaskItem[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [equipmentFiles, setEquipmentFiles] = useState<File[]>([])
  const [saveMsg, setSaveMsg] = useState('')

  // Dialog state
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [addonDialogOpen, setAddonDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null)

  // Task dialog draft
  const [taskTitle, setTaskTitle] = useState('')
  const [taskBullets, setTaskBullets] = useState<string[]>([''])

  // Dialog search states
  const [productSearch, setProductSearch] = useState('')
  const [addonSearch, setAddonSearch] = useState('')

  useEffect(() => {
    if (isEdit && id) {
      const cat = (mockCategories as any[]).find((c) => c.id === id)
      if (cat) {
        setName(emptyLang(cat.nameEn))
        setStatus(cat.status)
        setSelectedProducts(cat.products ?? [])
      }
    }
  }, [id, isEdit])

  function openTaskDialog(task?: TaskItem) {
    if (task) {
      setEditingTask(task)
      setTaskTitle(task.titleEn)
      setTaskBullets(task.descriptionEn.length > 0 ? task.descriptionEn : [''])
    } else {
      setEditingTask(null)
      setTaskTitle('')
      setTaskBullets([''])
    }
    setTaskDialogOpen(true)
  }

  function saveTask() {
    const newTask: TaskItem = {
      id: editingTask?.id ?? `task-${Date.now()}`,
      titleEn: taskTitle,
      descriptionEn: taskBullets.filter((b) => b.trim() !== ''),
    }
    if (editingTask) {
      setTaskItems((prev) => prev.map((t) => (t.id === editingTask.id ? newTask : t)))
    } else {
      setTaskItems((prev) => [...prev, newTask])
    }
    setTaskDialogOpen(false)
  }

  function removeTask(taskId: string) {
    setTaskItems((prev) => prev.filter((t) => t.id !== taskId))
  }

  function handleSave() {
    const payload = {
      id: isEdit ? id : undefined,
      name,
      status,
      comingSoon,
      recommended,
      hasQuantity,
      note,
      taskItems,
      selectedProducts,
      selectedAddons,
    }
    console.log('Save category:', payload)
    setSaveMsg('Saved successfully!')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const filteredProducts = (mockProducts as any[]).filter((p) =>
    p.nameEn.toLowerCase().includes(productSearch.toLowerCase())
  )
  const filteredAddons = (mockCategoryAddons as any[]).filter((a) =>
    a.nameEn.toLowerCase().includes(addonSearch.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      <CustomHeader
        title={isEdit ? 'Edit Category' : 'New Category'}
        onBack={() => navigate(-1)}
        onSave={handleSave}
      >
        {saveMsg && (
          <span className="text-sm text-green-600 font-medium">{saveMsg}</span>
        )}
      </CustomHeader>

      <div className="flex gap-6 p-6 overflow-auto">
        {/* Left column */}
        <div className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Profile image placeholder */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-400 transition-colors">
                  <UserCircle2 className="h-10 w-10 text-gray-400" />
                  <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1">
                    <Plus className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <p className="font-medium text-gray-700">Category Image</p>
                  <p>Click to upload a thumbnail</p>
                </div>
              </div>

              {/* Row 1: Name, Status, Platforms */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 space-y-1.5">
                  <Label>
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={name.en}
                    onChange={(e) => setName({ ...name, en: e.target.value })}
                    placeholder="Name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select
                    value={status ? 'active' : 'inactive'}
                    onValueChange={(v) => setStatus(v === 'active')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Platforms</Label>
                  <div className="flex flex-col gap-1.5 border rounded-md p-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox defaultChecked />
                      <span className="text-sm">App</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox defaultChecked />
                      <span className="text-sm">Mini App</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Row 2: Toggle switches */}
              <div className="flex gap-8">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={comingSoon}
                    onCheckedChange={setComingSoon}
                    id="coming-soon"
                  />
                  <Label htmlFor="coming-soon" className="cursor-pointer">
                    Coming Soon
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={recommended}
                    onCheckedChange={setRecommended}
                    id="recommended"
                  />
                  <Label htmlFor="recommended" className="cursor-pointer">
                    Recommended
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={hasQuantity}
                    onCheckedChange={setHasQuantity}
                    id="has-quantity"
                  />
                  <Label htmlFor="has-quantity" className="cursor-pointer">
                    Has Quantity
                  </Label>
                </div>
              </div>

              {/* Equipment Images */}
              <Uploader
                label="Equipment Images"
                accept="image/*"
                multiple
                files={equipmentFiles}
                onFilesSelected={setEquipmentFiles}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="w-80 space-y-4">
          {/* Task Information Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Task Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {taskItems.map((task) => (
                <div
                  key={task.id}
                  className="rounded-md border p-3 space-y-1.5 bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium">{task.titleEn}</span>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => openTaskDialog(task)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-600"
                        onClick={() => removeTask(task.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  {task.descriptionEn.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 pl-1">
                      {task.descriptionEn.map((d, i) => (
                        <li key={i} className="text-xs text-gray-600">
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 gap-1.5 px-0"
                onClick={() => openTaskDialog()}
              >
                <Plus className="h-4 w-4" />
                Add Another
              </Button>
            </CardContent>
          </Card>

          {/* Product Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedProducts.map((pId) => {
                const product = (mockProducts as any[]).find((p) => p.id === pId)
                if (!product) return null
                return (
                  <div
                    key={pId}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm bg-gray-50"
                  >
                    <span className="truncate">{product.nameEn}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 text-gray-400 hover:text-red-500"
                      onClick={() =>
                        setSelectedProducts((prev) => prev.filter((p) => p !== pId))
                      }
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )
              })}
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 gap-1.5 px-0"
                onClick={() => {
                  setProductSearch('')
                  setProductDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </CardContent>
          </Card>

          {/* Category Add-On Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Category Add-On</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedAddons.map((aId) => {
                const addon = (mockCategoryAddons as any[]).find((a) => a.id === aId)
                if (!addon) return null
                return (
                  <div
                    key={aId}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm bg-gray-50"
                  >
                    <span className="truncate">{addon.nameEn}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 text-gray-400 hover:text-red-500"
                      onClick={() =>
                        setSelectedAddons((prev) => prev.filter((a) => a !== aId))
                      }
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )
              })}
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 gap-1.5 px-0"
                onClick={() => {
                  setAddonSearch('')
                  setAddonDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4" />
                Add Category Add-On
              </Button>
            </CardContent>
          </Card>

          {/* Note Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Note</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note"
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Task Information Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={(v) => !v && setTaskDialogOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Task Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Task title (EN)"
              />
            </div>
            <div className="space-y-2">
              <Label>Description Items</Label>
              {taskBullets.map((bullet, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={bullet}
                    onChange={(e) => {
                      const updated = [...taskBullets]
                      updated[idx] = e.target.value
                      setTaskBullets(updated)
                    }}
                    placeholder={`Item ${idx + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-gray-400 hover:text-red-500"
                    onClick={() =>
                      setTaskBullets((prev) => prev.filter((_, i) => i !== idx))
                    }
                    disabled={taskBullets.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 gap-1.5 px-0"
                onClick={() => setTaskBullets((prev) => [...prev, ''])}
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTask} disabled={!taskTitle.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Selection Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Products</DialogTitle>
          </DialogHeader>
          <Input
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Search products..."
          />
          <ScrollArea className="h-64">
            <div className="space-y-1 pr-3">
              {filteredProducts.map((product: any) => (
                <label
                  key={product.id}
                  className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={(checked) => {
                      setSelectedProducts((prev) =>
                        checked
                          ? [...prev, product.id]
                          : prev.filter((p) => p !== product.id)
                      )
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium">{product.nameEn}</p>
                    <p className="text-xs text-gray-500">${product.basePrice}</p>
                  </div>
                </label>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setProductDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Addon Selection Dialog */}
      <Dialog open={addonDialogOpen} onOpenChange={setAddonDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Category Add-Ons</DialogTitle>
          </DialogHeader>
          <Input
            value={addonSearch}
            onChange={(e) => setAddonSearch(e.target.value)}
            placeholder="Search add-ons..."
          />
          <ScrollArea className="h-64">
            <div className="space-y-1 pr-3">
              {filteredAddons.map((addon: any) => (
                <label
                  key={addon.id}
                  className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedAddons.includes(addon.id)}
                    onCheckedChange={(checked) => {
                      setSelectedAddons((prev) =>
                        checked
                          ? [...prev, addon.id]
                          : prev.filter((a) => a !== addon.id)
                      )
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium">{addon.nameEn}</p>
                    <p className="text-xs text-gray-500">
                      {addon.categories.join(', ')}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddonDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddonDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
