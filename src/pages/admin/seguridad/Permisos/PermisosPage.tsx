import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2, UserCheck, UserX, Check, X } from 'lucide-react'

import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { findAll as findPermisos, softRemove as deletePermiso } from '@/modules/seguridad/permisos/services'
import type { Permiso } from '@/modules/seguridad/permisos/types'
import PermisoForm from './PermisoForm'

export default function PermisosPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Permiso | null>(null)
  const [page, setPage] = useState(1)

  const { data: result, isLoading } = useQuery({ queryKey: ['permisos', page], queryFn: () => findPermisos(page) })
  const permisos = result?.data || []
  const pageCount = result?.meta?.lastPage || 1

  const deleteMutation = useMutation({
    mutationFn: deletePermiso,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['permisos'] }); toast.success('Permiso eliminado') },
    onError: () => toast.error('Error al eliminar permiso'),
  })

  function handleClose() { setOpen(false); setEditing(null) }

  const columns = useMemo<ColumnDef<Permiso>[]>(() => [
    {
      id: 'cargo', header: 'Cargo',
      accessorFn: (row) => row.cargo?.nombre || '-',
    },
    {
      id: 'modulo', header: 'Módulo',
      accessorFn: (row) => row.modulo?.nombre || '-',
    },
    {
      id: 'crear', header: 'Crear',
      cell: ({ row }) => row.original.crear ? <Check className="h-4 w-4 text-green-600 dark:text-green-400" /> : <X className="h-4 w-4 text-red-400 dark:text-red-500" />,
    },
    {
      id: 'leer', header: 'Leer',
      cell: ({ row }) => row.original.leer ? <Check className="h-4 w-4 text-green-600 dark:text-green-400" /> : <X className="h-4 w-4 text-red-400 dark:text-red-500" />,
    },
    {
      id: 'actualizar', header: 'Actualizar',
      cell: ({ row }) => row.original.actualizar ? <Check className="h-4 w-4 text-green-600 dark:text-green-400" /> : <X className="h-4 w-4 text-red-400 dark:text-red-500" />,
    },
    {
      id: 'eliminar', header: 'Eliminar',
      cell: ({ row }) => row.original.eliminar ? <Check className="h-4 w-4 text-green-600 dark:text-green-400" /> : <X className="h-4 w-4 text-red-400 dark:text-red-500" />,
    },
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
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => {
            if (confirm('¿Eliminar este permiso?')) deleteMutation.mutate(row.original.id)
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
        <div><h1 className="text-2xl font-bold text-foreground">Permisos</h1><p className="mt-1 text-sm text-muted-foreground">Gestión de permisos por cargo y módulo</p></div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto"><Plus className="h-4 w-4" /> Nuevo Permiso</Button>
      </div>

      <PermisoForm open={open} onOpenChange={handleClose} editing={editing} />

      <DataTable columns={columns} data={permisos} searchKey="cargo" searchPlaceholder="Buscar por cargo..." loading={isLoading} page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  )
}
