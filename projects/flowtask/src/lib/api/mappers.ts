import type { Database } from '@/types/database'
import type { Category, Task } from '@/types/todo'

type DbCategory = Database['public']['Tables']['categories']['Row']
type DbTask = Database['public']['Tables']['tasks']['Row']

export function categoryFromRow(row: DbCategory): Category {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    createdAt: new Date(row.created_at).getTime(),
    slug: row.slug,
    isSystem: row.is_system,
  }
}

export function taskFromRow(row: DbTask, fallbackCategoryId: string): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    completed: row.completed,
    priority: row.priority,
    dueDate: row.due_date,
    categoryId: row.category_id ?? fallbackCategoryId,
    order: row.order_index,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  }
}

export function taskToInsert(
  task: Pick<Task, 'title' | 'description' | 'completed' | 'priority' | 'dueDate' | 'categoryId' | 'order'>,
  userId: string,
): Database['public']['Tables']['tasks']['Insert'] {
  return {
    user_id: userId,
    title: task.title.trim(),
    description: task.description ?? '',
    completed: task.completed,
    priority: task.priority,
    due_date: task.dueDate,
    category_id: task.categoryId,
    order_index: task.order,
  }
}

export function taskToUpdate(
  patch: Partial<
    Pick<Task, 'title' | 'description' | 'completed' | 'priority' | 'dueDate' | 'categoryId' | 'order'>
  >,
): Database['public']['Tables']['tasks']['Update'] {
  const update: Database['public']['Tables']['tasks']['Update'] = {}
  if (patch.title !== undefined) update.title = patch.title.trim()
  if (patch.description !== undefined) update.description = patch.description
  if (patch.completed !== undefined) update.completed = patch.completed
  if (patch.priority !== undefined) update.priority = patch.priority
  if (patch.dueDate !== undefined) update.due_date = patch.dueDate
  if (patch.categoryId !== undefined) update.category_id = patch.categoryId
  if (patch.order !== undefined) update.order_index = patch.order
  return update
}
