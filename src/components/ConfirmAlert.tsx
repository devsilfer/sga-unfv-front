import { AlertTriangle } from 'lucide-react'

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmAlertProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'destructive' | 'warning'
  onConfirm: () => void
  loading?: boolean
}

export default function ConfirmAlert({
  open, onOpenChange, title, description,
  confirmLabel = 'Confirmar', cancelLabel = 'Cancelar',
  variant = 'destructive', onConfirm, loading,
}: ConfirmAlertProps) {
  return (
    <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onOpenChange(false) }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex items-start gap-3.5">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              variant === 'destructive'
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
            }`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <DialogTitle className="text-[15px] font-semibold tracking-tight">{title}</DialogTitle>
              <DialogDescription className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="-mx-4 border-t" />

        <DialogFooter>
          <div className="flex w-full gap-2 sm:justify-end">
            <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading} className="flex-1 sm:flex-initial">
              {cancelLabel}
            </Button>
            <Button
              variant={variant === 'destructive' ? 'destructive' : 'warning'}
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 sm:flex-initial"
            >
              {loading ? 'Eliminando...' : confirmLabel}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
