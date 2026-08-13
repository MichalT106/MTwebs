import { taskFromRow, taskToInsert, taskToUpdate } from '@/lib/api/mappers'
import { ApiError } from '@/lib/api/categories'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'
import type { Priority, Task } from '@/types/todo'

function wrapError(message: string, error: unknown): ApiError {
  if (error instanceof Error && error.message) {
    return new ApiError(`${message}: ${error.message}`, error)
  }
  return new ApiError(message, error)
}

export async function fetchTasks(userId: string, inboxCategoryId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('order_index', { ascending: true })

  if (error) throw wrapError('Failed to load tasks', error)
  return (data ?? []).map((row) => taskFromRow(row, inboxCategoryId))
}

export async function createTask(
  userId: string,
  input: {
    title: string
    description?: string
    categoryId: string
    priority: Priority
    dueDate: string | null
    order: number
  },
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert(
      taskToInsert(
        {
          title: input.title,
          description: input.description ?? '',
          completed: false,
          priority: input.priority,
          dueDate: input.dueDate,
          categoryId: input.categoryId,
          order: input.order,
        },
        userId,
      ),
    )
    .select()
    .single()

  if (error || !data) throw wrapError('Failed to create task', error)
  return taskFromRow(data, input.categoryId)
}

export async function updateTask(
  id: string,
  patch: Partial<
    Pick<Task, 'title' | 'description' | 'completed' | 'priority' | 'dueDate' | 'categoryId' | 'order'>
  >,
  inboxCategoryId: string,
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(taskToUpdate(patch))
    .eq('id', id)
    .select()
    .single()

  if (error || !data) throw wrapError('Failed to update task', error)
  return taskFromRow(data, inboxCategoryId)
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw wrapError('Failed to delete task', error)
}

export async function reorderTasks(
  updates: { id: string; order: number }[],
  inboxCategoryId: string,
): Promise<Task[]> {
  const results: Task[] = []
  for (const { id, order } of updates) {
    const task = await updateTask(id, { order }, inboxCategoryId)
    results.push(task)
  }
  return results
}

export async function bulkInsertTasks(
  rows: Database['public']['Tables']['tasks']['Insert'][],
): Promise<void> {
  if (rows.length === 0) return
  const { error } = await supabase.from('tasks').insert(rows)
  if (error) throw wrapError('Failed to import tasks', error)
}
