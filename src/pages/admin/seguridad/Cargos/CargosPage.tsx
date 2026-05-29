import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'

import { findAll as findCargos, softRemove as deleteCargo } from '@/modules/seguridad/cargos/services'
import type { Cargo } from '@/modules/seguridad/cargos/types'
import CargoForm from './CargoForm'

export default function CargosPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Cargo | null>(null)
  const [page, setPage] = useState(1)

  const { data: result, isLoading } = useQuery({ queryKey: ['cargos', page], queryFn: () => findCargos(page) })
  const cargos = result?.data || []
  const pageCount = result?.meta?.lastPage || 1

  const deleteMutation = useMutation({
    mutationFn: deleteCargo,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cargos'] }); toast.success('Cargo eliminado') },
    onError: () => toast.error('Error al eliminar cargo'),
  })

  function handleClose() { setOpen(false); setEditing(null) }

  const columns = useMemo<ColumnDef<Cargo>[]>(() => [
    { accessorKey: 'codigo', header: 'Código' },
    { accessorKey: 'nombre', header: 'Nombre' },
    {
      id: 'area', header: 'Área',
      accessorFn: (row) => row.area?.nombre || '-',
    },
    {
      id: 'acciones', cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => { setEditing(row.original); setOpen(true) }}
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => {
            if (confirm('¿Eliminar este cargo?')) deleteMutation.mutate(row.original.id)
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
        <div><h1 className="text-2xl font-bold text-foreground">Cargos</h1><p className="mt-1 text-sm text-muted-foreground">Gestión de cargos institucionales</p></div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto"><Plus className="h-4 w-4" /> Nuevo Cargo</Button>
      </div>

      <CargoForm open={open} onOpenChange={handleClose} editing={editing} />

      <DataTable columns={columns} data={cargos} searchKey="nombre" searchPlaceholder="Buscar por nombre..." loading={isLoading} page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  )
}
