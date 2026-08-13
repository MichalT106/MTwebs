import { useMemo, useState } from 'react'
import { LayoutGrid, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useTodo } from '@/context/TodoContext'
import { cn } from '@/lib/utils'
import { CATEGORY_COLOR_PRESETS, isInboxCategory } from '@/types/todo'

export function Sidebar({ embedded }: { embedded?: boolean }) {
  const { state, setUi, addCategory, updateCategory, deleteCategory } = useTodo()
  const [newOpen, setNewOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState<string>(CATEGORY_COLOR_PRESETS[0])
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [renameColor, setRenameColor] = useState<string>(CATEGORY_COLOR_PRESETS[0])

  const selected = state.ui.selectedCategoryId

  const sortedCategories = useMemo(
    () => [...state.categories].sort((a, b) => a.createdAt - b.createdAt),
    [state.categories],
  )

  const openRename = (id: string, name: string, color: string) => {
    setRenameId(id)
    setRenameValue(name)
    setRenameColor(color)
    setRenameOpen(true)
  }

  const submitNew = () => {
    const name = newName.trim()
    if (!name) return
    addCategory(name, newColor)
    setNewName('')
    setNewColor(CATEGORY_COLOR_PRESETS[0])
    setNewOpen(false)
  }

  const submitRename = () => {
    if (!renameId) return
    updateCategory(renameId, { name: renameValue, color: renameColor })
    setRenameOpen(false)
  }

  return (
    <div className={cn('flex flex-col gap-4', embedded ? '' : 'pr-1')}>
      {!embedded && (
        <div className="flex items-center gap-3 px-1">
          <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 ring-1 ring-border/60 shadow-lg shadow-primary/10">
            <LayoutGrid className="size-5 text-primary" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-tight">Flowtask</p>
            <p className="text-xs text-muted-foreground">Lists, focus, finish.</p>
          </div>
        </div>
      )}

      <div className="px-1">
        <Button
          type="button"
          variant={selected === 'all' ? 'default' : 'ghost'}
          className={cn(
            'h-11 w-full justify-start gap-2 rounded-xl',
            selected === 'all' ? 'shadow-lg shadow-primary/15' : 'hover:bg-muted/60',
          )}
          onClick={() => setUi({ selectedCategoryId: 'all' })}
        >
          <LayoutGrid className="size-4 opacity-80" aria-hidden />
          All tasks
        </Button>
      </div>

      <Separator className="bg-border/60" />

      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Categories
        </p>
        <Dialog
          open={newOpen}
          onOpenChange={(o) => {
            setNewOpen(o)
            if (!o) {
              setNewName('')
              setNewColor(CATEGORY_COLOR_PRESETS[0])
            }
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="h-8 rounded-lg px-2">
              <Plus className="size-4" />
              <span className="sr-only sm:not-sr-only sm:pl-1">New</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create category</DialogTitle>
              <DialogDescription>Name your list and pick an accent color.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="cat-name">Name</Label>
                <Input
                  id="cat-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Work, Personal…"
                />
              </div>
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_COLOR_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={cn(
                        'size-8 rounded-full ring-2 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-ring',
                        newColor === c ? 'ring-primary' : 'ring-transparent',
                      )}
                      style={{ background: c }}
                      aria-label="Select category color"
                      onClick={() => setNewColor(c)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setNewOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={submitNew} disabled={!newName.trim()}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <nav className="scrollbar-thin flex max-h-[55dvh] flex-col gap-1 overflow-y-auto pr-1 lg:max-h-[calc(100dvh-18rem)]">
        {sortedCategories.map((c) => {
          const isInbox = isInboxCategory(c)
          const active = selected === c.id
          return (
            <div
              key={c.id}
              className={cn(
                'group flex items-center gap-2 rounded-xl border border-transparent px-2 py-1 transition-colors',
                active ? 'border-border/70 bg-muted/40' : 'hover:border-border/50 hover:bg-muted/30',
              )}
            >
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-2 text-left"
                onClick={() => setUi({ selectedCategoryId: c.id })}
              >
                <span
                  className="size-3 shrink-0 rounded-full ring-2 ring-background shadow-sm"
                  style={{ background: c.color }}
                  aria-hidden
                />
                <span className="truncate text-sm font-medium">{c.name}</span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 opacity-60 transition group-hover:opacity-100"
                    aria-label={`Category actions for ${c.name}`}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => openRename(c.id, c.name, c.color)}>
                    <Pencil className="size-4" />
                    Rename
                  </DropdownMenuItem>
                  {!isInbox && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteCategory(c.id)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        })}
      </nav>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
            <DialogDescription>Update the list name and accent.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="rename-cat">Name</Label>
              <Input
                id="rename-cat"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Accent</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      'size-8 rounded-full ring-2 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-ring',
                      renameColor === c ? 'ring-primary' : 'ring-transparent',
                    )}
                    style={{ background: c }}
                    aria-label="Select category color"
                    onClick={() => setRenameColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={submitRename}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
