import { useState } from 'react'
import { format, isBefore, parseISO, startOfDay } from 'date-fns'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTodo } from '@/context/TodoContext'
import { cn } from '@/lib/utils'
import type { Priority, Task } from '@/types/todo'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const priorityLabel: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

function priorityVariant(p: Priority): 'danger' | 'warning' | 'secondary' {
  if (p === 'high') return 'danger'
  if (p === 'medium') return 'warning'
  return 'secondary'
}

export function StaticTaskRow({ task }: { task: Task }) {
  return <TaskRowCard task={task} />
}

export function SortableTaskRow({ task }: { task: Task }) {
  const { canReorder } = useTodo()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: !canReorder,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && 'z-20')}>
      <TaskRowCard
        task={task}
        dragHandleProps={canReorder ? { ...attributes, ...listeners } : undefined}
        isDragging={isDragging}
      />
    </div>
  )
}

function TaskRowCard({
  task,
  dragHandleProps,
  isDragging,
}: {
  task: Task
  dragHandleProps?: Record<string, unknown>
  isDragging?: boolean
}) {
  const { state, updateTask, deleteTask, setUi } = useTodo()
  const [editOpen, setEditOpen] = useState(false)
  const [draftTitle, setDraftTitle] = useState(task.title)
  const [draftPriority, setDraftPriority] = useState<Priority>(task.priority)
  const [draftCategory, setDraftCategory] = useState(task.categoryId)
  const [draftDue, setDraftDue] = useState(task.dueDate ?? '')
  const [draftDescription, setDraftDescription] = useState(task.description ?? '')

  const category = state.categories.find((c) => c.id === task.categoryId)

  const overdue =
    task.dueDate &&
    !task.completed &&
    isBefore(startOfDay(parseISO(task.dueDate)), startOfDay(new Date()))

  const openEdit = () => {
    setDraftTitle(task.title)
    setDraftPriority(task.priority)
    setDraftCategory(task.categoryId)
    setDraftDue(task.dueDate ?? '')
    setDraftDescription(task.description ?? '')
    setEditOpen(true)
  }

  const saveEdit = () => {
    const title = draftTitle.trim()
    if (!title) return
    updateTask(task.id, {
      title,
      description: draftDescription.trim(),
      priority: draftPriority,
      categoryId: draftCategory,
      dueDate: draftDue ? draftDue : null,
    })
    setEditOpen(false)
  }

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'group relative flex gap-3 rounded-2xl border border-border/60 bg-card/50 p-3 shadow-sm backdrop-blur-md transition hover:border-border hover:bg-card/70 sm:p-4',
          task.completed && 'opacity-70',
          isDragging && 'scale-[1.01] shadow-xl ring-2 ring-primary/30',
        )}
      >
        <div className="flex items-start gap-2 pt-0.5">
          {dragHandleProps ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
                  aria-label="Drag to reorder"
                  {...dragHandleProps}
                >
                  <GripVertical className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Drag to reorder</TooltipContent>
            </Tooltip>
          ) : (
            <div className="w-2 shrink-0" aria-hidden />
          )}

          <Checkbox
            checked={task.completed}
            onCheckedChange={(v) => updateTask(task.id, { completed: Boolean(v) })}
            aria-label={task.completed ? 'Mark as active' : 'Mark as completed'}
          />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <button
              type="button"
              className={cn(
                'w-full text-left text-[15px] font-medium leading-snug sm:text-base',
                task.completed && 'line-through',
              )}
              onClick={openEdit}
            >
              {task.title}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 opacity-70 transition group-hover:opacity-100"
                  aria-label={`Task actions for ${task.title}`}
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    setUi({ selectedCategoryId: task.categoryId })
                  }}
                >
                  Focus list
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openEdit}>
                  <Pencil className="size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={priorityVariant(task.priority)} className="rounded-lg capitalize">
              {priorityLabel[task.priority]}
            </Badge>
            {state.ui.selectedCategoryId === 'all' && category && (
              <Badge variant="outline" className="rounded-lg border-border/70">
                <span
                  className="mr-1.5 inline-block size-2 rounded-full"
                  style={{ background: category.color }}
                  aria-hidden
                />
                {category.name}
              </Badge>
            )}
            {task.dueDate && (
              <Badge
                variant={overdue ? 'danger' : 'outline'}
                className={cn('rounded-lg', overdue && 'border-destructive/40')}
              >
                <CalendarDays className="size-3.5" />
                {format(parseISO(task.dueDate), 'MMM d')}
              </Badge>
            )}
          </div>
        </div>
      </motion.article>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
            <DialogDescription>Update details and save when you are ready.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor={`title-${task.id}`}>Title</Label>
              <Input
                id={`title-${task.id}`}
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`desc-${task.id}`}>Notes</Label>
              <Textarea
                id={`desc-${task.id}`}
                value={draftDescription}
                onChange={(e) => setDraftDescription(e.target.value)}
                rows={3}
                placeholder="Optional details…"
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={draftCategory} onValueChange={setDraftCategory}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Category" />
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
              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select value={draftPriority} onValueChange={(v) => setDraftPriority(v as Priority)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`due-${task.id}`}>Due date</Label>
              <Input
                id={`due-${task.id}`}
                type="date"
                value={draftDue}
                onChange={(e) => setDraftDue(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={saveEdit} disabled={!draftTitle.trim()}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
