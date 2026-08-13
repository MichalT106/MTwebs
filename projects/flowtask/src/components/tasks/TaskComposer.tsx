import { useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTodo } from '@/context/TodoContext'
import type { Priority } from '@/types/todo'
import { isInboxCategory } from '@/types/todo'

export function TaskComposer() {
  const { state, addTask } = useTodo()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [due, setDue] = useState('')
  const defaultCategoryId =
    state.ui.selectedCategoryId === 'all'
      ? (state.categories.find(isInboxCategory)?.id ?? state.categories[0]?.id ?? '')
      : state.ui.selectedCategoryId

  const [categoryId, setCategoryId] = useState(defaultCategoryId)

  const submit = () => {
    const t = title.trim()
    if (!t) return
    addTask({
      title: t,
      categoryId,
      priority,
      dueDate: due ? due : null,
    })
    setTitle('')
    setDue('')
    setPriority('medium')
    setCategoryId(
      state.ui.selectedCategoryId === 'all'
        ? (state.categories.find(isInboxCategory)?.id ?? state.categories[0]?.id ?? categoryId)
        : state.ui.selectedCategoryId,
    )
  }

  return (
    <section
      aria-label="Add new task"
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-background/40 to-accent/10 p-4 shadow-inner shadow-black/5 sm:p-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1 space-y-2">
          <Label htmlFor="new-task-title" className="text-xs uppercase tracking-wide text-muted-foreground">
            New task
          </Label>
          <Input
            id="new-task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="h-11 rounded-xl border-border/70 bg-background/60 text-base"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
          />
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-3 lg:max-w-xl">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">List</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {state.categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-due" className="text-xs text-muted-foreground">
              Due
            </Label>
            <Input
              id="new-due"
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <Button
          type="button"
          className="h-11 shrink-0 rounded-xl px-6"
          onClick={submit}
          disabled={!title.trim()}
        >
          <Plus className="size-4" />
          Add
        </Button>
      </div>
    </section>
  )
}
