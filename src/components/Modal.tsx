import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ModalProps {
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
  width?: string
  height?: string
  hideFooter?: boolean
  footer?: ReactNode
}

const sizeClasses: Record<string, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
}

export default function Modal({
  open, onOpenChange, title, description, editing, saving, onSubmit,
  children, submitLabel, size = 'md', width, height, hideFooter, footer,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onOpenChange(false) }}>
      <DialogContent className={width || sizeClasses[size]}>
        <DialogHeader>
          <div className="flex items-start gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm ring-1 ring-primary/25">
              <div className="h-4 w-4 rounded-[2px] border-[1.5px] border-current" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <DialogTitle className="text-[15px] font-semibold tracking-tight">{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-1 text-sm leading-relaxed text-muted-foreground/70">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="-mx-4 border-t" />

        <div className={cn("overflow-y-auto scrollbar-thin", height || "max-h-[55vh]")}>
          <div className="space-y-5">
            {children}
          </div>
        </div>

        {!hideFooter && (
          <>
            <div className="-mx-4 border-t" />
            <DialogFooter>
              {footer || (
                <div className="flex w-full gap-2 sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={saving}
                    className="flex-1 sm:flex-initial"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={onSubmit}
                    disabled={saving}
                    className="flex-1 gap-1.5 sm:flex-initial"
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {saving
                      ? 'Guardando...'
                      : submitLabel || (editing ? 'Actualizar' : 'Crear')}
                  </Button>
                </div>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
