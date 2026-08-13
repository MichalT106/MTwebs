import { useMemo } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { CheckCircle2, Sparkles } from 'lucide-react'

import { SortableTaskRow, StaticTaskRow } from '@/components/tasks/TaskRow'
import { TaskComposer } from '@/components/tasks/TaskComposer'
import { Card, CardContent } from '@/components/ui/card'
import { useTodo } from '@/context/TodoContext'

export function TaskBoard() {
  const { visibleTasks, reorderVisible, canReorder, state } = useTodo()

  const ids = useMemo(() => visibleTasks.map((t) => t.id), [visibleTasks])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    if (!canReorder) return
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = ids.indexOf(String(active.id))
    const newIndex = ids.indexOf(String(over.id))
    if (oldIndex < 0 || newIndex < 0) return
    reorderVisible(arrayMove(ids, oldIndex, newIndex))
  }

  const list = visibleTasks.map((task) =>
    canReorder ? (
      <SortableTaskRow key={task.id} task={task} />
    ) : (
      <StaticTaskRow key={task.id} task={task} />
    ),
  )

  return (
    <div className="space-y-6">
      <TaskComposer key={state.ui.selectedCategoryId} />

      {visibleTasks.length === 0 ? (
        <Card className="border-dashed border-border/70 bg-muted/10">
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/15 ring-1 ring-border/60">
              <CheckCircle2 className="size-8 text-primary" aria-hidden />
            </div>
            <div className="max-w-md space-y-2">
              <h2 className="text-lg font-semibold tracking-tight">You are all caught up</h2>
              <p className="text-sm text-muted-foreground">
                Add your first task, tune filters, or switch lists in the sidebar. Your tasks sync securely to the cloud
                when you are signed in.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="size-3.5" aria-hidden />
              <span>Tip: try priority + due filters to build a focused queue.</span>
            </div>
          </CardContent>
        </Card>
      ) : canReorder ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <motion.div layout className="space-y-3">
              {list}
            </motion.div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="space-y-3">{list}</div>
      )}
    </div>
  )
}
