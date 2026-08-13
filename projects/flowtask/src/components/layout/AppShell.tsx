import { LogOut, Menu, Sparkles } from 'lucide-react'

import { Sidebar } from '@/components/layout/Sidebar'
import { SyncBanner } from '@/components/layout/SyncBanner'
import { TopBar } from '@/components/layout/TopBar'
import { SidebarSkeleton, TaskBoardSkeleton } from '@/components/loading/AppLoading'
import { TaskBoard } from '@/components/tasks/TaskBoard'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useAuth } from '@/context/AuthContext'
import { useTodo } from '@/context/TodoContext'
import { cn } from '@/lib/utils'

export function AppShell() {
  const { signOut } = useAuth()
  const { state, setUi, loading } = useTodo()

  return (
    <TooltipProvider delayDuration={200}>
      <div className="mesh-gradient relative min-h-dvh overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_400px_at_50%_-10%,hsl(var(--primary)/0.12),transparent)]" />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to tasks
        </a>

        <header className="sticky top-0 z-40 border-b border-border/40 bg-background/55 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-accent/20 ring-1 ring-border/60">
                <Sparkles className="size-4 text-primary" aria-hidden />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold tracking-tight">Flowtask</p>
                <p className="text-xs text-muted-foreground">Stay in flow</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Sign out"
                onClick={() => void signOut()}
              >
                <LogOut className="size-4" />
              </Button>
              <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open categories menu">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto scrollbar-thin">
                <SheetHeader>
                  <SheetTitle>Categories</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  {loading ? <SidebarSkeleton /> : <Sidebar embedded />}
                </div>
              </SheetContent>
            </Sheet>
            </div>
          </div>
        </header>

        <div className="relative mx-auto flex w-full max-w-[1600px] gap-4 px-3 pb-10 pt-4 sm:px-5 lg:px-8 lg:pt-8">
          <aside
            className={cn(
              'sticky top-6 hidden h-[calc(100dvh-3rem)] shrink-0 overflow-hidden transition-[width,opacity] duration-300 ease-out lg:block',
              state.ui.sidebarCollapsed ? 'w-0 opacity-0' : 'w-[320px] opacity-100',
            )}
          >
            <div className="glass-panel h-full w-[320px] overflow-hidden rounded-3xl">
              <div className="scrollbar-thin flex h-full flex-col overflow-y-auto p-4">
                {loading ? <SidebarSkeleton /> : <Sidebar embedded={false} />}
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="glass-panel rounded-3xl p-4 shadow-2xl shadow-black/10 sm:p-6 dark:shadow-black/30">
              <TopBar />
              <SyncBanner />
              <main id="main" className="mt-6" tabIndex={-1}>
                {loading ? <TaskBoardSkeleton /> : <TaskBoard />}
              </main>
            </div>

            <button
              type="button"
              onClick={() => setUi({ sidebarCollapsed: !state.ui.sidebarCollapsed })}
              className="fixed bottom-5 left-5 z-30 hidden h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-popover/80 text-sm font-medium text-muted-foreground shadow-lg backdrop-blur-xl transition hover:text-foreground lg:flex"
              aria-label={state.ui.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {state.ui.sidebarCollapsed ? '⟩' : '⟨'}
            </button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
