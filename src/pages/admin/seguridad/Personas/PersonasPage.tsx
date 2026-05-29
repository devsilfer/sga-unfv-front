import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'

import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'

import { findAll as findPersonas, softRemove as deletePersona } from '@/modules/seguridad/personas/services'
import type { Persona } from '@/modules/seguridad/personas/types'
import PersonaForm from './PersonaForm'
import PersonaDetail from './PersonaDetail'

export default function PersonasPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Persona | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailPersona, setDetailPersona] = useState<Persona | null>(null)
  const [page, setPage] = useState(1)

  const { data: result, isLoading } = useQuery({
    queryKey: ['personas', page],
    queryFn: () => findPersonas(page),
  })
  const personas = result?.data || []
  const pageCount = result?.meta?.lastPage || 1

  const deleteMutation = useMutation({
    mutationFn: deletePersona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] })
      toast.success('Persona eliminada correctamente')
    },
    onError: () => toast.error('Error al eliminar la persona'),
  })

  function handleClose() {
    setOpen(false)
    setEditing(null)
  }

  const columns = useMemo<ColumnDef<Persona>[]>(
    () => [
      {
        id: 'numeroIdentificacion',
        header: 'N° Identificación',
        accessorFn: (row) =>
          row.tipoIdentificacion
            ? `${row.tipoIdentificacion.nombre} - ${row.numeroDocumento}`
            : row.numeroDocumento,
      },
      {
        id: 'nombreCompleto',
        header: 'Nombres y Apellidos',
        accessorFn: (row) => `${row.nombres} ${row.apellidoPaterno || ''} ${row.apellidoMaterno || ''}`.trim(),
      },
      { accessorKey: 'correoPersonal', header: 'Correo' },
      { accessorKey: 'numCelular', header: 'Celular' },
      {
        id: 'acciones',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" tooltip="Ver detalle" onClick={() => { setDetailPersona(row.original); setDetailOpen(true) }}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:hover:bg-gray-800/50">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" tooltip="Editar" onClick={() => { setEditing(row.original); setOpen(true) }}
              className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary dark:hover:bg-primary/30">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" tooltip="Eliminar" onClick={() => {
              if (confirm('¿Eliminar esta persona?')) deleteMutation.mutate(row.original.id)
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
          <h1 className="text-2xl font-bold text-foreground">Personas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestión de personas registradas en el sistema</p>
        </div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Nueva Persona
        </Button>
      </div>

      <PersonaForm
        open={open}
        onOpenChange={handleClose}
        editing={editing}
      />

      <PersonaDetail
        open={detailOpen}
        onOpenChange={setDetailOpen}
        persona={detailPersona}
      />

      <DataTable
        columns={columns}
        data={personas}
        searchKey="nombreCompleto"
        searchPlaceholder="Buscar por nombre..."
        loading={isLoading}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  )
}
