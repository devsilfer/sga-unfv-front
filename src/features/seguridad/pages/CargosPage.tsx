import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2, EllipsisVertical, UserCheck, UserX } from 'lucide-react'

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

import { findAll as findCargos, create as createCargo, update as updateCargo, softRemove as deleteCargo } from '@/features/seguridad/api/cargos.api'
import type { Cargo } from '@/features/seguridad/types/cargo.types'

const emptyForm = { codigo: '', nombre: '' }

export default function CargosPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Cargo | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)

  const { data: result, isLoading } = useQuery({ queryKey: ['cargos', page], queryFn: () => findCargos(page) })
  const cargos = result?.data || []
  const pageCount = result?.meta?.lastPage || 1
  const createMutation = useMutation({
    mutationFn: createCargo,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cargos'] }); toast.success('Cargo creado'); handleClose() },
    onError: () => toast.error('Error al crear cargo'),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Record<string, unknown> }) => updateCargo(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cargos'] }); toast.success('Cargo actualizado'); handleClose() },
    onError: () => toast.error('Error al actualizar cargo'),
  })
  const deleteMutation = useMutation({
    mutationFn: deleteCargo,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cargos'] }); toast.success('Cargo eliminado') },
    onError: () => toast.error('Error al eliminar cargo'),
  })

  function handleClose() { setOpen(false); setEditing(null); setForm({ ...emptyForm }); setErrors({}) }
  function handleEdit(c: Cargo) { setEditing(c); setForm({ codigo: c.codigo, nombre: c.nombre }); setErrors({}); setOpen(true) }
  function validate() {
    const e: Record<string, string> = {}
    if (!form.codigo) e.codigo = 'Requerido'
    if (!form.nombre || form.nombre.length < 2) e.nombre = 'Mínimo 2 caracteres'
    setErrors(e); return Object.keys(e).length === 0
  }
  async function handleSubmit() {
    if (!validate()) return; setSaving(true)
    try {
      if (editing) await updateMutation.mutateAsync({ id: editing.id, input: form })
      else await createMutation.mutateAsync(form)
    } finally { setSaving(false) }
  }

  const columns = useMemo<ColumnDef<Cargo>[]>(() => [
    { accessorKey: 'codigo', header: 'Código' },
    { accessorKey: 'nombre', header: 'Nombre' },
    {
      id: 'area', header: 'Área',
      accessorFn: (row) => row.area?.nombre || '-',
    },
    {
      id: 'esActivo', header: 'Estado',
      cell: ({ row }) => row.original.esActivo
        ? <Badge className="bg-green-100 text-green-700"><UserCheck className="h-3 w-3" />Activo</Badge>
        : <Badge variant="destructive"><UserX className="h-3 w-3" />Inactivo</Badge>,
    },
    {
      id: 'acciones', cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger><Button variant="ghost" size="icon-sm"><EllipsisVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleEdit(row.original)}><Pencil className="h-4 w-4" /> Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => { if (confirm('¿Eliminar?')) deleteMutation.mutate(row.original.id) }}><Trash2 className="h-4 w-4" /> Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-bold">Cargos</h1><p className="mt-1 text-sm text-gray-500">Gestión de cargos institucionales</p></div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto"><Plus className="h-4 w-4" /> Nuevo Cargo</Button>
      </div>
      <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) handleClose() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Editar Cargo' : 'Nuevo Cargo'}</DialogTitle><DialogDescription>Ingresa los datos del cargo</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Código</label>
              <Input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
              {errors.codigo && <p className="text-xs text-destructive">{errors.codigo}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nombre</label>
              <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={saving}>{saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={cargos} searchKey="nombre" searchPlaceholder="Buscar por nombre..." loading={isLoading} page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  )
}
