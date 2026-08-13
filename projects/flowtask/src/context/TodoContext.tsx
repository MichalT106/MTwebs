import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { ImportLocalDialog } from '@/components/auth/ImportLocalDialog'
import {
  createCategory as apiCreateCategory,
  deleteCategory as apiDeleteCategory,
  ensureInboxCategory,
  fetchCategories,
  getInboxCategory,
  updateCategory as apiUpdateCategory,
} from '@/lib/api/categories'
import { shouldOfferImport } from '@/lib/api/import-local'
import {
  createTask as apiCreateTask,
  deleteTask as apiDeleteTask,
  fetchTasks,
  updateTask as apiUpdateTask,
} from '@/lib/api/tasks'
import {
  filterTasks,
  getOrderedVisibleTasks,
  getVisibleIdsInManualGlobalOrder,
  mergeOrderAfterDrag,
  sortTasks,
} from '@/lib/selectors'
import { supabase } from '@/lib/supabase'
import { loadUiState, saveUiState } from '@/lib/ui-persist'
import { useAuth } from '@/context/AuthContext'
import type { Category, Priority, SortMode, Task, UiState } from '@/types/todo'
import { CATEGORY_COLOR_PRESETS, isInboxCategory } from '@/types/todo'

interface DataState {
  tasks: Task[]
  categories: Category[]
  ui: UiState
}

type Action =
  | { type: 'SET_DATA'; tasks: Task[]; categories: Category[] }
  | { type: 'SET_UI'; patch: Partial<UiState> }
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'UPDATE_TASK'; id: string; patch: Partial<Task> }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'REORDER'; visibleIdsBefore: string[]; reorderedVisibleIds: string[] }
  | { type: 'ADD_CATEGORY'; category: Category }
  | { type: 'UPDATE_CATEGORY'; id: string; patch: Partial<Category> }
  | { type: 'DELETE_CATEGORY'; id: string; inboxId: string }

function nextGlobalOrder(tasks: Task[]): number {
  if (tasks.length === 0) return 0
  return Math.max(...tasks.map((t) => t.order)) + 1
}

function reducer(state: DataState, action: Action): DataState {
  const now = Date.now()
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, tasks: action.tasks, categories: action.categories }
    case 'SET_UI':
      return { ...state, ui: { ...state.ui, ...action.patch } }
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.task] }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, ...action.patch, updatedAt: now } : t,
        ),
      }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) }
    case 'REORDER': {
      const allSorted = sortTasks([...state.tasks], 'manual')
      const merged = mergeOrderAfterDrag(
        allSorted,
        action.visibleIdsBefore,
        action.reorderedVisibleIds,
      )
      return { ...state, tasks: merged }
    }
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.category] }
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.id ? { ...c, ...action.patch } : c,
        ),
      }
    case 'DELETE_CATEGORY': {
      const inboxId = action.inboxId
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.id),
        tasks: state.tasks.map((t) =>
          t.categoryId === action.id ? { ...t, categoryId: inboxId, updatedAt: now } : t,
        ),
        ui:
          state.ui.selectedCategoryId === action.id
            ? { ...state.ui, selectedCategoryId: 'all' }
            : state.ui,
      }
    }
    default:
      return state
  }
}

function assignGlobalOrders(tasks: Task[]): Task[] {
  return [...tasks]
    .sort((a, b) => a.order - b.order || a.createdAt - b.createdAt)
    .map((t, i) => ({ ...t, order: i }))
}

interface TodoContextValue {
  state: DataState
  visibleTasks: Task[]
  filteredTasks: Task[]
  loading: boolean
  syncing: boolean
  error: string | null
  clearError: () => void
  refresh: () => Promise<void>
  addTask: (input: {
    title: string
    description?: string
    categoryId: string
    priority: Priority
    dueDate: string | null
  }) => Promise<void>
  updateTask: (
    id: string,
    patch: Partial<Pick<Task, 'title' | 'description' | 'completed' | 'priority' | 'dueDate' | 'categoryId'>>,
  ) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  reorderVisible: (reorderedIds: string[]) => Promise<void>
  addCategory: (name: string, color?: string) => Promise<void>
  updateCategory: (id: string, patch: { name?: string; color?: string }) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  setUi: (patch: Partial<UiState>) => void
  setSort: (sort: SortMode) => void
  canReorder: boolean
}

const TodoContext = createContext<TodoContextValue | null>(null)

const initialDataState = (): DataState => ({
  tasks: [],
  categories: [],
  ui: loadUiState(),
})

export function TodoProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id
  const [state, dispatch] = useReducer(reducer, undefined, initialDataState)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importOpen, setImportOpen] = useState(false)
  const inboxIdRef = useRef<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const loadRemoteTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const loadRemote = useCallback(async () => {
    if (!userId) return
    setSyncing(true)
    try {
      const categories = await fetchCategories(userId)
      const inbox = (await ensureInboxCategory(userId)) ?? getInboxCategory(categories)
      const inboxId = inbox?.id ?? categories[0]?.id
      if (!inboxId) throw new Error('Inbox category is missing.')
      inboxIdRef.current = inboxId

      const tasks = assignGlobalOrders(await fetchTasks(userId, inboxId))
      const mergedCategories = categories.some((c) => c.id === inboxId)
        ? categories
        : inbox
          ? [inbox, ...categories]
          : categories

      dispatch({ type: 'SET_DATA', tasks, categories: mergedCategories })

      if (shouldOfferImport(userId, tasks, mergedCategories)) {
        setImportOpen(true)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load your data.')
    } finally {
      setSyncing(false)
      setLoading(false)
    }
  }, [userId])

  const scheduleLoadRemote = useCallback(() => {
    if (loadRemoteTimer.current) clearTimeout(loadRemoteTimer.current)
    loadRemoteTimer.current = setTimeout(() => {
      void loadRemote()
    }, 400)
  }, [loadRemote])

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    setLoading(true)
    void loadRemote()
  }, [userId, loadRemote])

  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`flowtask-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${userId}` },
        () => {
          scheduleLoadRemote()
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories', filter: `user_id=eq.${userId}` },
        () => {
          scheduleLoadRemote()
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [userId, scheduleLoadRemote])

  useEffect(() => {
    saveUiState(state.ui)
  }, [state.ui])

  useEffect(() => {
    const root = document.documentElement
    if (state.ui.theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [state.ui.theme])

  const getInboxId = useCallback(() => {
    if (inboxIdRef.current) return inboxIdRef.current
    const inbox = getInboxCategory(state.categories)
    if (inbox) inboxIdRef.current = inbox.id
    return inbox?.id ?? ''
  }, [state.categories])

  const filteredTasks = useMemo(() => filterTasks(state), [state])
  const visibleTasks = useMemo(() => getOrderedVisibleTasks(state), [state])

  const canReorder = useMemo(() => {
    if (state.ui.sort !== 'manual') return false
    if (state.ui.selectedCategoryId === 'all') return false
    return true
  }, [state.ui.sort, state.ui.selectedCategoryId])

  const addTask = useCallback(
    async (input: {
      title: string
      description?: string
      categoryId: string
      priority: Priority
      dueDate: string | null
    }) => {
      if (!userId) return
      const title = input.title.trim()
      if (!title) return
      const inboxId = getInboxId()
      const catOk = state.categories.some((c) => c.id === input.categoryId)
      const categoryId = catOk ? input.categoryId : inboxId
      const order = nextGlobalOrder(state.tasks)

      const optimistic: Task = {
        id: crypto.randomUUID(),
        title,
        description: input.description ?? '',
        completed: false,
        priority: input.priority,
        dueDate: input.dueDate,
        categoryId,
        order,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      dispatch({ type: 'ADD_TASK', task: optimistic })

      try {
        await apiCreateTask(userId, {
          title,
          description: input.description,
          categoryId,
          priority: input.priority,
          dueDate: input.dueDate,
          order,
        })
        await loadRemote()
      } catch (e) {
        dispatch({ type: 'DELETE_TASK', id: optimistic.id })
        setError(e instanceof Error ? e.message : 'Failed to create task.')
      }
    },
    [userId, state.tasks, state.categories, getInboxId, loadRemote],
  )

  const updateTask = useCallback(
    async (
      id: string,
      patch: Partial<Pick<Task, 'title' | 'description' | 'completed' | 'priority' | 'dueDate' | 'categoryId'>>,
    ) => {
      const prev = state.tasks.find((t) => t.id === id)
      if (!prev) return
      dispatch({ type: 'UPDATE_TASK', id, patch })

      try {
        await apiUpdateTask(id, patch, getInboxId())
      } catch (e) {
        dispatch({ type: 'UPDATE_TASK', id, patch: prev })
        setError(e instanceof Error ? e.message : 'Failed to update task.')
      }
    },
    [state.tasks, getInboxId],
  )

  const deleteTask = useCallback(
    async (id: string) => {
      const prev = state.tasks
      dispatch({ type: 'DELETE_TASK', id })
      try {
        await apiDeleteTask(id)
      } catch (e) {
        dispatch({ type: 'SET_DATA', tasks: prev, categories: state.categories })
        setError(e instanceof Error ? e.message : 'Failed to delete task.')
      }
    },
    [state.tasks, state.categories],
  )

  const reorderVisible = useCallback(
    async (reorderedIds: string[]) => {
      const before = getVisibleIdsInManualGlobalOrder(state)
      const allSorted = sortTasks([...state.tasks], 'manual')
      const visibleSet = new Set(before)
      const merged = mergeOrderAfterDrag(allSorted, before, reorderedIds)
      dispatch({ type: 'REORDER', visibleIdsBefore: before, reorderedVisibleIds: reorderedIds })

      const updates = merged
        .map((t, order) => ({ id: t.id, order }))
        .filter((u) => visibleSet.has(u.id))

      try {
        await Promise.all(updates.map(({ id, order }) => apiUpdateTask(id, { order }, getInboxId())))
      } catch (e) {
        await loadRemote()
        setError(e instanceof Error ? e.message : 'Failed to save task order.')
      }
    },
    [state, getInboxId, loadRemote],
  )

  const addCategory = useCallback(
    async (name: string, color?: string) => {
      if (!userId) return
      const resolvedColor =
        color ?? CATEGORY_COLOR_PRESETS[state.categories.length % CATEGORY_COLOR_PRESETS.length]
      try {
        const created = await apiCreateCategory(userId, { name, color: resolvedColor })
        dispatch({ type: 'ADD_CATEGORY', category: created })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to create category.')
      }
    },
    [userId, state.categories.length],
  )

  const updateCategory = useCallback(async (id: string, patch: { name?: string; color?: string }) => {
    const prev = state.categories.find((c) => c.id === id)
    if (!prev) return
    dispatch({ type: 'UPDATE_CATEGORY', id, patch })
    try {
      await apiUpdateCategory(id, patch)
    } catch (e) {
      dispatch({ type: 'UPDATE_CATEGORY', id, patch: prev })
      setError(e instanceof Error ? e.message : 'Failed to update category.')
    }
  }, [state.categories])

  const deleteCategory = useCallback(
    async (id: string) => {
      const cat = state.categories.find((c) => c.id === id)
      if (!cat || isInboxCategory(cat)) return
      const inboxId = getInboxId()
      const prevTasks = state.tasks
      const prevCategories = state.categories
      dispatch({ type: 'DELETE_CATEGORY', id, inboxId })
      try {
        await apiDeleteCategory(id, inboxId)
      } catch (e) {
        dispatch({ type: 'SET_DATA', tasks: prevTasks, categories: prevCategories })
        setError(e instanceof Error ? e.message : 'Failed to delete category.')
      }
    },
    [state.tasks, state.categories, getInboxId],
  )

  const setUi = useCallback((patch: Partial<UiState>) => {
    dispatch({ type: 'SET_UI', patch })
  }, [])

  const setSort = useCallback((sort: SortMode) => {
    dispatch({ type: 'SET_UI', patch: { sort } })
  }, [])

  const value = useMemo(
    () => ({
      state,
      visibleTasks,
      filteredTasks,
      loading,
      syncing,
      error,
      clearError,
      refresh: loadRemote,
      addTask,
      updateTask,
      deleteTask,
      reorderVisible,
      addCategory,
      updateCategory,
      deleteCategory,
      setUi,
      setSort,
      canReorder,
    }),
    [
      state,
      visibleTasks,
      filteredTasks,
      loading,
      syncing,
      error,
      clearError,
      loadRemote,
      addTask,
      updateTask,
      deleteTask,
      reorderVisible,
      addCategory,
      updateCategory,
      deleteCategory,
      setUi,
      setSort,
      canReorder,
    ],
  )

  return (
    <TodoContext.Provider value={value}>
      {userId && (
        <ImportLocalDialog
          open={importOpen}
          userId={userId}
          onComplete={() => {
            setImportOpen(false)
            void loadRemote()
          }}
          onDismiss={() => setImportOpen(false)}
        />
      )}
      {children}
    </TodoContext.Provider>
  )
}

export function useTodo(): TodoContextValue {
  const ctx = useContext(TodoContext)
  if (!ctx) throw new Error('useTodo must be used within TodoProvider')
  return ctx
}
