import { Sparkles } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'

export function AuthLoadingScreen() {
  return (
    <div className="mesh-gradient flex min-h-dvh flex-col items-center justify-center gap-6 p-6">
      <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 ring-1 ring-border/60">
        <Sparkles className="size-6 animate-pulse text-primary" aria-hidden />
      </div>
      <p className="text-sm text-muted-foreground">Loading your workspace…</p>
    </div>
  )
}

export function TaskBoardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading tasks">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px] w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-1" aria-busy="true">
      <Skeleton className="h-11 w-full rounded-xl" />
      <Skeleton className="h-px w-full" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-xl" />
      ))}
    </div>
  )
}
