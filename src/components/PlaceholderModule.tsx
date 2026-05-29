import { Construction } from 'lucide-react'

export default function PlaceholderModule({ moduleName }: { moduleName: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-muted-foreground">
      <Construction className="w-16 h-16 text-primary/60" />
      <h2 className="text-2xl font-semibold text-foreground">{moduleName}</h2>
      <p className="text-sm">Módulo en construcción</p>
    </div>
  )
}
