import { AlertCircle, Loader2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTodo } from '@/context/TodoContext'

export function SyncBanner() {
  const { error, syncing, clearError } = useTodo()

  if (!error && !syncing) return null

  return (
    <div
      className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/30 px-4 py-2 text-sm"
      role="status"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        {syncing ? (
          <>
            <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
            <span>Syncing with cloud…</span>
          </>
        ) : (
          <>
            <AlertCircle className="size-4 text-destructive" aria-hidden />
            <span className="text-destructive">{error}</span>
          </>
        )}
      </div>
      {error && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 rounded-lg"
          aria-label="Dismiss error"
          onClick={clearError}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  )
}
