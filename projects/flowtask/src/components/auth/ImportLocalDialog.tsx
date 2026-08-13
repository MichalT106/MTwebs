import { useState } from 'react'
import { CloudUpload, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { importLocalDataToSupabase, markImportedForUser } from '@/lib/api/import-local'

interface ImportLocalDialogProps {
  open: boolean
  userId: string
  onComplete: () => void
  onDismiss: () => void
}

export function ImportLocalDialog({ open, userId, onComplete, onDismiss }: ImportLocalDialogProps) {
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImport = async () => {
    setImporting(true)
    setError(null)
    try {
      await importLocalDataToSupabase(userId)
      onComplete()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed. Please try again.')
    } finally {
      setImporting(false)
    }
  }

  const handleSkip = () => {
    markImportedForUser(userId)
    onDismiss()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !importing && handleSkip()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CloudUpload className="size-5 text-primary" aria-hidden />
            Import local tasks?
          </DialogTitle>
          <DialogDescription>
            We found tasks saved in this browser from before you signed in. Import them to your cloud account so they
            sync across devices.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="secondary" className="rounded-xl" onClick={handleSkip} disabled={importing}>
            Skip
          </Button>
          <Button type="button" className="rounded-xl" onClick={handleImport} disabled={importing}>
            {importing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Importing…
              </>
            ) : (
              'Import to cloud'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
