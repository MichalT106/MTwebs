export type Priority = 'low' | 'medium' | 'high'

export type StatusFilter = 'all' | 'active' | 'completed'

export type PriorityFilter = 'all' | Priority

export type DueFilter = 'all' | 'none' | 'dated' | 'overdue' | 'today' | 'week'

export type SortMode = 'manual' | 'newest' | 'oldest' | 'priority' | 'alpha'

export interface Category {
  id: string
  name: string
  color: string
  createdAt: number
  slug?: string | null
  isSystem?: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: Priority
  dueDate: string | null
  categoryId: string
  order: number
  createdAt: number
  updatedAt: number
}

export interface UiState {
  search: string
  statusFilter: StatusFilter
  priorityFilter: PriorityFilter
  dueFilter: DueFilter
  sort: SortMode
  selectedCategoryId: 'all' | string
  sidebarCollapsed: boolean
  theme: 'light' | 'dark'
}

export interface AppState {
  version: 1
  tasks: Task[]
  categories: Category[]
  ui: UiState
}

/** @deprecated Use {@link isInboxCategory} — inbox id is per-user UUID from Supabase */
export const INBOX_CATEGORY_ID = 'inbox'

export const INBOX_SLUG = 'inbox'

export function isInboxCategory(category: Category): boolean {
  return category.slug === INBOX_SLUG || category.isSystem === true
}

export const CATEGORY_COLOR_PRESETS = [
  'hsl(262 83% 58%)',
  'hsl(188 86% 42%)',
  'hsl(330 81% 60%)',
  'hsl(43 96% 56%)',
  'hsl(142 71% 45%)',
  'hsl(24 95% 58%)',
  'hsl(210 90% 58%)',
] as const
