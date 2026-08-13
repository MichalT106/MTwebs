import type { AppState } from '@/types/todo'
import { INBOX_CATEGORY_ID } from '@/types/todo'

const LEGACY_STORAGE_KEY = 'flowtask:v1'

/** @deprecated Tasks/categories now live in Supabase; used only for one-time import */
export function loadLegacyState(): AppState | null {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AppState
    if (
      !parsed ||
      parsed.version !== 1 ||
      !Array.isArray(parsed.tasks) ||
      !Array.isArray(parsed.categories)
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function createInitialState(): AppState {
  const now = Date.now()
  return {
    version: 1,
    categories: [
      {
        id: INBOX_CATEGORY_ID,
        name: 'Inbox',
        color: 'hsl(262 83% 58%)',
        createdAt: now,
      },
    ],
    tasks: [],
    ui: {
      search: '',
      statusFilter: 'all',
      priorityFilter: 'all',
      dueFilter: 'all',
      sort: 'manual',
      selectedCategoryId: 'all',
      sidebarCollapsed: false,
      theme: 'dark',
    },
  }
}
