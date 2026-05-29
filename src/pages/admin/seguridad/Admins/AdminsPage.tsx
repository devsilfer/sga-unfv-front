import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'

import { findAll as findAdmins, softRemove as deleteAdmin } from '@/modules/seguridad/admins/services'
import type { Admin } from '@/modules/seguridad/admins/types'
import AdminForm from './AdminForm'

export default function AdminsPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Admin | null>(null)
  const [page, setPage] = useState(1)

  const { data: result, isLoading } = useQuery({ queryKey: ['admins', page], queryFn: () => findAdmins(page) })
  const admins = result?.data || []
  const pageCount = result?.meta?.lastPage || 1

  const deleteMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admins'] }); toast.success('Admin eliminado') },
    onError: () => toast.error('Error al eliminar admin'),
  })

  function handleClose() { setOpen(false); setEditing(null) }

  const columns = useMemo<ColumnDef<Admin>[]>(() => [
    { accessorKey: 'codigo', header: 'Código' },
    {
      id: 'persona', header: 'Persona',
      accessorFn: (row) => row.usuario?.persona
        ? `${row.usuario.persona.nombres} ${row.usuario.persona.apellidoPaterno || ''}`.trim()
        : '-',
    },
    { accessorKey: 'correo', header: 'Correo' },
    {
      id: 'cargo', header: 'Cargo',
      accessorFn: (row) => row.cargo?.nombre || '-',
    },
    {
      id: 'acciones', cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => { setEditing(row.original); setOpen(true) }}
            className="bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => {
            if (confirm('¿Eliminar este admin?')) deleteMutation.mutate(row.original.id)
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
        <div><h1 className="text-2xl font-bold text-foreground">Admins</h1><p className="mt-1 text-sm text-muted-foreground">Gestión de administradores</p></div>
        <Button variant="info" onClick={() => setOpen(true)} className="w-full sm:w-auto"><Plus className="h-4 w-4" /> Nuevo Admin</Button>
      </div>

      <AdminForm open={open} onOpenChange={handleClose} editing={editing} />

      <DataTable columns={columns} data={admins} searchKey="codigo" searchPlaceholder="Buscar por código..." loading={isLoading} page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  )
}
