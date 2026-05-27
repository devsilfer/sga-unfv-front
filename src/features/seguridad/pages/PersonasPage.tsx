import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2, EllipsisVertical, UserCheck } from 'lucide-react'

import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

import { findAll as findPersonas, create as createPersona, update as updatePersona, softRemove as deletePersona } from '@/features/seguridad/api/personas.api'
import type { Persona } from '@/features/seguridad/types/persona.types'

const emptyForm = {
  numeroDocumento: '',
  correoPersonal: '',
  nombres: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  fecNac: '',
  numCelular: '',
  direccion: '',
}

export default function PersonasPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Persona | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)

  const { data: result, isLoading } = useQuery({
    queryKey: ['personas', page],
    queryFn: () => findPersonas(page),
  })
  const personas = result?.data || []
  const pageCount = result?.meta?.lastPage || 1

  const createMutation = useMutation({
    mutationFn: createPersona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] })
      toast.success('Persona creada correctamente')
      handleClose()
    },
    onError: () => toast.error('Error al crear la persona'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Record<string, unknown> }) =>
      updatePersona(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] })
      toast.success('Persona actualizada correctamente')
      handleClose()
    },
    onError: () => toast.error('Error al actualizar la persona'),
  })

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
    setForm({ ...emptyForm })
    setErrors({})
  }

  function handleEdit(persona: Persona) {
    setEditing(persona)
    setForm({
      numeroDocumento: persona.numeroDocumento,
      correoPersonal: persona.correoPersonal,
      nombres: persona.nombres,
      apellidoPaterno: persona.apellidoPaterno || '',
      apellidoMaterno: persona.apellidoMaterno || '',
      fecNac: persona.fecNac || '',
      numCelular: persona.numCelular || '',
      direccion: persona.direccion || '',
    })
    setErrors({})
    setOpen(true)
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.numeroDocumento || form.numeroDocumento.length < 8) newErrors.numeroDocumento = 'Mínimo 8 caracteres'
    if (!form.nombres || form.nombres.length < 2) newErrors.nombres = 'Mínimo 2 caracteres'
    if (!form.correoPersonal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correoPersonal)) newErrors.correoPersonal = 'Correo inválido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setSaving(true)
    try {
      if (editing) {
        const payload: Record<string, unknown> = { ...form }
        if (!payload.fecNac) delete payload.fecNac
        if (!payload.numCelular) delete payload.numCelular
        if (!payload.direccion) delete payload.direccion
        if (!payload.apellidoPaterno) delete payload.apellidoPaterno
        if (!payload.apellidoMaterno) delete payload.apellidoMaterno
        await updateMutation.mutateAsync({ id: editing.id, input: payload })
      } else {
        await createMutation.mutateAsync(form)
      }
    } finally {
      setSaving(false)
    }
  }

  const columns = useMemo<ColumnDef<Persona>[]>(
    () => [
      { accessorKey: 'numeroDocumento', header: 'N° Documento' },
      {
        id: 'tipoIdentificacion',
        header: 'Tipo Ident.',
        accessorFn: (row) => row.tipoIdentificacion?.nombre || '-',
      },
      {
        id: 'nombreCompleto',
        header: 'Nombres y Apellidos',
        accessorFn: (row) => `${row.nombres} ${row.apellidoPaterno || ''} ${row.apellidoMaterno || ''}`.trim(),
      },
      { accessorKey: 'correoPersonal', header: 'Correo' },
      { accessorKey: 'numCelular', header: 'Celular' },
      {
        id: 'genero',
        header: 'Género',
        accessorFn: (row) => row.genero?.nombre || '-',
      },
      {
        id: 'esActivo',
        header: 'Estado',
        cell: () => (
          <Badge className="bg-green-100 text-green-700">
            <UserCheck className="h-3 w-3" />Activo
          </Badge>
        ),
      },
      {
        id: 'acciones',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon-sm"><EllipsisVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                <Pencil className="h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => {
                if (confirm('¿Eliminar esta persona?')) deleteMutation.mutate(row.original.id)
              }}>
                <Trash2 className="h-4 w-4" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personas</h1>
          <p className="mt-1 text-sm text-gray-500">Gestión de personas registradas en el sistema</p>
        </div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Nueva Persona
        </Button>
      </div>

      <Dialog open={open} onOpenChange={(v: boolean | undefined) => { if (!v) handleClose() }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Persona' : 'Nueva Persona'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Modifica los datos de la persona' : 'Ingresa los datos de la nueva persona'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">N° Documento</label>
                <Input value={form.numeroDocumento} onChange={(e) => setForm({ ...form, numeroDocumento: e.target.value })} />
                {errors.numeroDocumento && <p className="text-xs text-destructive">{errors.numeroDocumento}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Correo Personal</label>
                <Input value={form.correoPersonal} onChange={(e) => setForm({ ...form, correoPersonal: e.target.value })} />
                {errors.correoPersonal && <p className="text-xs text-destructive">{errors.correoPersonal}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nombres</label>
              <Input value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} />
              {errors.nombres && <p className="text-xs text-destructive">{errors.nombres}</p>}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Apellido Paterno</label>
                <Input value={form.apellidoPaterno} onChange={(e) => setForm({ ...form, apellidoPaterno: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Apellido Materno</label>
                <Input value={form.apellidoMaterno} onChange={(e) => setForm({ ...form, apellidoMaterno: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Fecha Nacimiento</label>
                <Input type="date" value={form.fecNac} onChange={(e) => setForm({ ...form, fecNac: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Celular</label>
                <Input value={form.numCelular} onChange={(e) => setForm({ ...form, numCelular: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Dirección</label>
              <Input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DataTable
        columns={columns}
        data={personas}
        searchKey="numeroDocumento"
        searchPlaceholder="Buscar por documento..."
        loading={isLoading}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  )
}
