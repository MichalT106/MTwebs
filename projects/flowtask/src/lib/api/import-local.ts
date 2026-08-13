import { createCategory, ensureInboxCategory, fetchCategories } from '@/lib/api/categories'
import { bulkInsertTasks } from '@/lib/api/tasks'
import { loadLegacyState } from '@/lib/persist'
import type { Category, Task } from '@/types/todo'
import { INBOX_CATEGORY_ID, isInboxCategory } from '@/types/todo'
import type { Database } from '@/types/database'

const IMPORT_FLAG_PREFIX = 'flowtask:imported:'

export function hasImportedForUser(userId: string): boolean {
  try {
    return localStorage.getItem(`${IMPORT_FLAG_PREFIX}${userId}`) === '1'
  } catch {
    return false
  }
}

export function markImportedForUser(userId: string): void {
  try {
    localStorage.setItem(`${IMPORT_FLAG_PREFIX}${userId}`, '1')
  } catch {
    // ignore
  }
}

export function hasLocalDataToImport(): boolean {
  const legacy = loadLegacyState()
  if (!legacy) return false
  return legacy.tasks.length > 0 || legacy.categories.some((c) => !isInboxCategory(c) && c.id !== INBOX_CATEGORY_ID)
}

export async function importLocalDataToSupabase(userId: string): Promise<{ tasks: number; categories: number }> {
  const legacy = loadLegacyState()
  if (!legacy) return { tasks: 0, categories: 0 }

  const inbox = await ensureInboxCategory(userId)
  const remoteCategories = await fetchCategories(userId)
  const categoryIdMap = new Map<string, string>()
  categoryIdMap.set(INBOX_CATEGORY_ID, inbox.id)

  let categoriesImported = 0
  for (const cat of legacy.categories) {
    if (cat.id === INBOX_CATEGORY_ID || isInboxCategory(cat)) {
      categoryIdMap.set(cat.id, inbox.id)
      continue
    }
    const exists = remoteCategories.find((r) => r.name === cat.name && r.color === cat.color)
    if (exists) {
      categoryIdMap.set(cat.id, exists.id)
      continue
    }
    const created = await createCategory(userId, { name: cat.name, color: cat.color })
    categoryIdMap.set(cat.id, created.id)
    categoriesImported += 1
  }

  const taskRows: Database['public']['Tables']['tasks']['Insert'][] = legacy.tasks.map((t, index) => {
    const categoryId = categoryIdMap.get(t.categoryId) ?? inbox.id
    return {
      user_id: userId,
      title: t.title.trim() || 'Untitled',
      description: '',
      completed: t.completed,
      priority: t.priority,
      due_date: t.dueDate,
      category_id: categoryId,
      order_index: t.order ?? index,
    }
  })

  await bulkInsertTasks(taskRows)
  markImportedForUser(userId)

  return { tasks: taskRows.length, categories: categoriesImported }
}

export function shouldOfferImport(userId: string, remoteTasks: Task[], remoteCategories: Category[]): boolean {
  if (hasImportedForUser(userId)) return false
  if (!hasLocalDataToImport()) return false
  if (remoteTasks.length > 0) return false
  const customCategories = remoteCategories.filter((c) => !isInboxCategory(c))
  return customCategories.length === 0
}
