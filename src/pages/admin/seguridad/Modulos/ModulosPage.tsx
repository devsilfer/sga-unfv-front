import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2, UserCheck, UserX } from 'lucide-react'

import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { findAll as findModulos, softRemove as deleteModulo } from '@/modules/seguridad/modulos/services'
import type { Modulo } from '@/modules/seguridad/modulos/types'
import ModuloForm from './ModuloForm'

export default function ModulosPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Modulo | null>(null)
  const [page, setPage] = useState(1)

  const { data: result, isLoading } = useQuery({ queryKey: ['modulos', page], queryFn: () => findModulos(page) })
  const modulos = result?.data || []
  const pageCount = result?.meta?.lastPage || 1

  const deleteMutation = useMutation({
    mutationFn: deleteModulo,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['modulos'] }); toast.success('Módulo eliminado') },
    onError: () => toast.error('Error al eliminar módulo'),
  })

  function handleClose() { setOpen(false); setEditing(null) }

  const columns = useMemo<ColumnDef<Modulo>[]>(() => [
    { accessorKey: 'codigo', header: 'Código' },
    { accessorKey: 'nombre', header: 'Nombre' },
    {
      id: 'estado', header: 'Estado',
      cell: ({ row }) => row.original.esActivo
        ? <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><UserCheck className="h-3 w-3" />Activo</Badge>
        : <Badge variant="destructive"><UserX className="h-3 w-3" />Inactivo</Badge>,
    },
    {
      id: 'acciones', cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => { setEditing(row.original); setOpen(true) }}
            className="bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => {
            if (confirm('¿Eliminar este módulo?')) deleteMutation.mutate(row.original.id)
          }}
            className="bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-foreground">Módulos</h1><p className="mt-1 text-sm text-muted-foreground">Gestión de módulos del sistema</p></div>
        <Button variant="info" onClick={() => setOpen(true)} className="w-full sm:w-auto"><Plus className="h-4 w-4" /> Nuevo Módulo</Button>
      </div>

      <ModuloForm open={open} onOpenChange={handleClose} editing={editing} />

      <DataTable columns={columns} data={modulos} searchKey="nombre" searchPlaceholder="Buscar por nombre..." loading={isLoading} page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  )
}
