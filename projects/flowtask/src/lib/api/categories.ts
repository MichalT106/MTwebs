import { categoryFromRow } from '@/lib/api/mappers'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types/todo'
import { INBOX_SLUG, isInboxCategory } from '@/types/todo'

export class ApiError extends Error {
  override cause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.cause = cause
  }
}

function wrapError(message: string, error: unknown): ApiError {
  if (error instanceof Error && error.message) {
    return new ApiError(`${message}: ${error.message}`, error)
  }
  return new ApiError(message, error)
}

export async function fetchCategories(userId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) throw wrapError('Failed to load categories', error)
  return (data ?? []).map(categoryFromRow)
}

export function getInboxCategory(categories: Category[]): Category | undefined {
  return categories.find(isInboxCategory)
}

export async function createCategory(
  userId: string,
  input: { name: string; color: string },
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      user_id: userId,
      name: input.name.trim() || 'Untitled',
      color: input.color,
    })
    .select()
    .single()

  if (error || !data) throw wrapError('Failed to create category', error)
  return categoryFromRow(data)
}

export async function updateCategory(
  id: string,
  patch: { name?: string; color?: string },
): Promise<Category> {
  const update: { name?: string; color?: string } = {}
  if (patch.name !== undefined) update.name = patch.name.trim() || 'Untitled'
  if (patch.color !== undefined) update.color = patch.color

  const { data, error } = await supabase.from('categories').update(update).eq('id', id).select().single()

  if (error || !data) throw wrapError('Failed to update category', error)
  return categoryFromRow(data)
}

export async function deleteCategory(id: string, inboxId: string): Promise<void> {
  const { error: taskError } = await supabase
    .from('tasks')
    .update({ category_id: inboxId })
    .eq('category_id', id)

  if (taskError) throw wrapError('Failed to reassign tasks', taskError)

  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw wrapError('Failed to delete category', error)
}

export async function ensureInboxCategory(userId: string): Promise<Category> {
  const existing = await fetchCategories(userId)
  const inbox = getInboxCategory(existing)
  if (inbox) return inbox

  const { data, error } = await supabase
    .from('categories')
    .insert({
      user_id: userId,
      name: 'Inbox',
      color: 'hsl(262 83% 58%)',
      slug: INBOX_SLUG,
      is_system: true,
    })
    .select()
    .single()

  if (error || !data) throw wrapError('Failed to create inbox', error)
  return categoryFromRow(data)
}
