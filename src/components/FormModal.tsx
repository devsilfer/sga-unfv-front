import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface FormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  editing?: boolean
  saving?: boolean
  onSubmit?: () => void
  children: ReactNode
  submitLabel?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  hideFooter?: boolean
  footer?: ReactNode
}

const sizeClasses: Record<string, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
}

export default function FormModal({
  open, onOpenChange, title, description, editing, saving, onSubmit,
  children, submitLabel, size = 'md', hideFooter, footer,
}: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onOpenChange(false) }}>
      <DialogContent className={sizeClasses[size]}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <div className="h-5 w-5 rounded-[3px] border-2 border-current" />
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto -mx-1 px-1">
          <div className="space-y-4">
            {children}
          </div>
        </div>

        {!hideFooter && (
          <DialogFooter>
            {footer || (
              <>
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                  Cancelar
                </Button>
                <Button onClick={onSubmit} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {saving
                    ? 'Guardando...'
                    : submitLabel || (editing ? 'Actualizar' : 'Crear')}
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
