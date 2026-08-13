import { useState } from 'react'
import { format } from 'date-fns'
import {
  ArrowDownAZ,
  CalendarClock,
  ListFilter,
  LogOut,
  Moon,
  Search,
  SlidersHorizontal,
  SortAsc,
  Sparkles,
  Sun,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/context/AuthContext'
import { useTodo } from '@/context/TodoContext'
import { cn } from '@/lib/utils'
import type { DueFilter, PriorityFilter, SortMode, StatusFilter } from '@/types/todo'

const statusItems: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

const priorityItems: { value: PriorityFilter; label: string }[] = [
  { value: 'all', label: 'Any priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const dueItems: { value: DueFilter; label: string }[] = [
  { value: 'all', label: 'Any due date' },
  { value: 'none', label: 'No date' },
  { value: 'dated', label: 'Has date' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Next 7 days' },
]

const sortItems: { value: SortMode; label: string; icon: typeof SortAsc }[] = [
  { value: 'manual', label: 'Manual', icon: SlidersHorizontal },
  { value: 'newest', label: 'Newest', icon: Sparkles },
  { value: 'oldest', label: 'Oldest', icon: SortAsc },
  { value: 'priority', label: 'Priority', icon: ListFilter },
  { value: 'alpha', label: 'A → Z', icon: ArrowDownAZ },
]

export function TopBar() {
  const { user, signOut } = useAuth()
  const { state, setUi, setSort, visibleTasks, canReorder } = useTodo()
  const { ui } = state
  const [signingOut, setSigningOut] = useState(false)

  const cat =
    ui.selectedCategoryId === 'all'
      ? null
      : state.categories.find((c) => c.id === ui.selectedCategoryId)

  const title = cat ? cat.name : 'All tasks'
  const subtitle = cat
    ? `${visibleTasks.length} tasks in this list`
    : `${visibleTasks.length} tasks across every list`

  return (
    <header className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-3">
            {cat && (
              <span
                className="size-3 shrink-0 rounded-full ring-2 ring-border/60"
                style={{ background: cat.color }}
                aria-hidden
              />
            )}
            <div>
              <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-lg border-border/70">
              {format(new Date(), 'EEE, MMM d')}
            </Badge>
            {!canReorder && ui.selectedCategoryId !== 'all' && ui.sort !== 'manual' && (
              <Badge variant="secondary" className="rounded-lg">
                Switch to Manual sort to reorder
              </Badge>
            )}
            {ui.selectedCategoryId === 'all' && ui.sort === 'manual' && (
              <Badge variant="secondary" className="rounded-lg">
                Pick a category to drag-reorder
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-xl"
            aria-label={ui.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setUi({ theme: ui.theme === 'dark' ? 'light' : 'dark' })}
          >
            {ui.theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="hidden h-11 rounded-xl sm:inline-flex"
            disabled={signingOut}
            onClick={async () => {
              setSigningOut(true)
              try {
                await signOut()
              } finally {
                setSigningOut(false)
              }
            }}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
          {user?.email && (
            <span className="hidden max-w-[180px] truncate text-xs text-muted-foreground lg:inline">
              {user.email}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="relative">
          <Label htmlFor="search" className="sr-only">
            Search tasks
          </Label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            value={ui.search}
            onChange={(e) => setUi({ search: e.target.value })}
            placeholder="Search tasks…"
            className="h-11 rounded-xl pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Select
            value={ui.statusFilter}
            onValueChange={(v) => setUi({ statusFilter: v as StatusFilter })}
          >
            <SelectTrigger className="h-11 w-[140px] rounded-xl" aria-label="Filter by completion">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusItems.map((i) => (
                <SelectItem key={i.value} value={i.value}>
                  {i.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={ui.priorityFilter}
            onValueChange={(v) => setUi({ priorityFilter: v as PriorityFilter })}
          >
            <SelectTrigger className="h-11 w-[150px] rounded-xl" aria-label="Filter by priority">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {priorityItems.map((i) => (
                <SelectItem key={i.value} value={i.value}>
                  {i.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ui.dueFilter} onValueChange={(v) => setUi({ dueFilter: v as DueFilter })}>
            <SelectTrigger className="h-11 w-[170px] rounded-xl" aria-label="Filter by due date">
              <CalendarClock className="size-4 opacity-70" />
              <SelectValue placeholder="Due" />
            </SelectTrigger>
            <SelectContent>
              {dueItems.map((i) => (
                <SelectItem key={i.value} value={i.value}>
                  {i.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ListFilter className="size-4" aria-hidden />
          <span>Sort</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortItems.map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={ui.sort === value ? 'default' : 'outline'}
              className={cn('rounded-xl', ui.sort === value && 'shadow-md shadow-primary/20')}
              onClick={() => setSort(value)}
            >
              <Icon className="size-4" />
              {label}
            </Button>
          ))}
        </div>
      </div>
    </header>
  )
}
