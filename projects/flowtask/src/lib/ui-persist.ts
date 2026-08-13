import type { UiState } from '@/types/todo'

const UI_STORAGE_KEY = 'flowtask:ui:v1'

const defaultUi = (): UiState => ({
  search: '',
  statusFilter: 'all',
  priorityFilter: 'all',
  dueFilter: 'all',
  sort: 'manual',
  selectedCategoryId: 'all',
  sidebarCollapsed: false,
  theme: 'dark',
})

export function loadUiState(): UiState {
  try {
    const raw = localStorage.getItem(UI_STORAGE_KEY)
    if (!raw) return defaultUi()
    const parsed = JSON.parse(raw) as Partial<UiState>
    return {
      ...defaultUi(),
      ...parsed,
      theme: parsed.theme === 'light' ? 'light' : 'dark',
    }
  } catch {
    return defaultUi()
  }
}

export function saveUiState(ui: UiState): void {
  try {
    localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(ui))
  } catch {
    // ignore quota / private mode
  }
}
