import { endOfDay, isBefore, isSameDay, isWithinInterval, parseISO, startOfDay } from 'date-fns'

import type { AppState, Priority, SortMode, Task, UiState } from '@/types/todo'

export type TaskListState = {
  tasks: Task[]
  categories: AppState['categories']
  ui: UiState
}

export function priorityWeight(p: Priority): number {
  if (p === 'high') return 3
  if (p === 'medium') return 2
  return 1
}

export function sortTasks(tasks: Task[], sort: SortMode): Task[] {
  const copy = [...tasks]
  switch (sort) {
    case 'manual':
      return copy.sort((a, b) => a.order - b.order)
    case 'newest':
      return copy.sort((a, b) => b.createdAt - a.createdAt)
    case 'oldest':
      return copy.sort((a, b) => a.createdAt - b.createdAt)
    case 'priority':
      return copy.sort((a, b) => {
        const d = priorityWeight(b.priority) - priorityWeight(a.priority)
        if (d !== 0) return d
        return a.title.localeCompare(b.title)
      })
    case 'alpha':
      return copy.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return copy
  }
}

function matchesDueFilter(
  task: Task,
  dueFilter: UiState['dueFilter'],
  now = new Date(),
): boolean {
  const today = startOfDay(now)

  if (dueFilter === 'all') return true
  if (dueFilter === 'none') return task.dueDate === null
  if (dueFilter === 'dated') return task.dueDate !== null

  if (!task.dueDate) return false

  const d = startOfDay(parseISO(task.dueDate))

  if (dueFilter === 'overdue') {
    return isBefore(d, today) && !task.completed
  }
  if (dueFilter === 'today') {
    return isSameDay(d, today)
  }
  if (dueFilter === 'week') {
    const end = endOfDay(new Date(today.getTime() + 6 * 86400000))
    return isWithinInterval(d, { start: today, end })
  }
  return true
}

export function filterTasks(state: TaskListState): Task[] {
  const { tasks, ui } = state
  const q = ui.search.trim().toLowerCase()

  return tasks.filter((t) => {
    if (ui.selectedCategoryId !== 'all' && t.categoryId !== ui.selectedCategoryId) return false
    if (q) {
      const inTitle = t.title.toLowerCase().includes(q)
      const inDescription = (t.description ?? '').toLowerCase().includes(q)
      if (!inTitle && !inDescription) return false
    }
    if (ui.statusFilter === 'active' && t.completed) return false
    if (ui.statusFilter === 'completed' && !t.completed) return false
    if (ui.priorityFilter !== 'all' && t.priority !== ui.priorityFilter) return false
    if (!matchesDueFilter(t, ui.dueFilter)) return false
    return true
  })
}

export function getOrderedVisibleTasks(state: TaskListState): Task[] {
  return sortTasks(filterTasks(state), state.ui.sort)
}

export function getVisibleIdsInManualGlobalOrder(state: TaskListState): string[] {
  const visibleSet = new Set(filterTasks(state).map((t) => t.id))
  return sortTasks([...state.tasks], 'manual')
    .filter((t) => visibleSet.has(t.id))
    .map((t) => t.id)
}

export function mergeOrderAfterDrag(
  allSorted: Task[],
  visibleOrderedIds: string[],
  reorderedVisibleIds: string[],
): Task[] {
  const vis = new Set(visibleOrderedIds)
  const map = new Map(allSorted.map((t) => [t.id, t]))
  let k = 0
  const merged: Task[] = []
  for (const t of allSorted) {
    if (!vis.has(t.id)) merged.push(t)
    else {
      const id = reorderedVisibleIds[k++]
      const task = map.get(id)
      if (task) merged.push(task)
    }
  }
  return merged.map((t, order) => ({ ...t, order }))
}
