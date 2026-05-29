import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'

import { findAll as findUsuarios, softRemove as deleteUsuario } from '@/modules/seguridad/usuarios/services'
import type { Usuario } from '@/modules/seguridad/usuarios/types'
import UsuarioForm from './UsuarioForm'

export default function UsuariosPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Usuario | null>(null)
  const [page, setPage] = useState(1)

  const { data: result, isLoading } = useQuery({
    queryKey: ['usuarios', page],
    queryFn: () => findUsuarios(page),
  })
  const usuarios = result?.data || []
  const pageCount = result?.meta?.lastPage || 1

  const deleteMutation = useMutation({
    mutationFn: deleteUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      toast.success('Usuario eliminado correctamente')
    },
    onError: () => toast.error('Error al eliminar el usuario'),
  })

  function handleClose() { setOpen(false); setEditing(null) }

  const columns = useMemo<ColumnDef<Usuario>[]>(
    () => [
      {
        id: 'persona',
        header: 'Persona',
        accessorFn: (row) =>
          row.persona ? `${row.persona.nombres} ${row.persona.apellidoPaterno || ''}`.trim() : '-',
      },
      {
        id: 'documento',
        header: 'N° Documento',
        accessorFn: (row) => row.persona?.numeroDocumento || '-',
      },
      {
        id: 'correo',
        header: 'Correo',
        accessorFn: (row) => row.persona?.correoPersonal || '-',
      },
      {
        id: 'acciones',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => { setEditing(row.original); setOpen(true) }}
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => {
              if (confirm('¿Eliminar este usuario?')) deleteMutation.mutate(row.original.id)
            }}
              className="bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestión de usuarios del sistema</p>
        </div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Nuevo Usuario
        </Button>
      </div>

      <UsuarioForm open={open} onOpenChange={handleClose} editing={editing} />

      <DataTable
        columns={columns}
        data={usuarios}
        searchKey="persona"
        searchPlaceholder="Buscar por persona..."
        loading={isLoading}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  )
}
