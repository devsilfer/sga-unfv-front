import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2, UserCheck, UserX, Check, X } from 'lucide-react'

import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import FormModal from '@/components/FormModal'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

import { findAll as findPermisos, create as createPermiso, update as updatePermiso, softRemove as deletePermiso } from '@/modules/seguridad/permisos/services'
import { findAll as findCargos } from '@/modules/seguridad/cargos/services'
import { findAll as findModulos } from '@/modules/seguridad/modulos/services'
import type { Permiso } from '@/modules/seguridad/permisos/types'

const emptyForm = { cargoId: 0, moduloId: 0, crear: false, leer: false, actualizar: false, eliminar: false }

export default function Permisos() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Permiso | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)

  const { data: result, isLoading } = useQuery({ queryKey: ['permisos', page], queryFn: () => findPermisos(page) })
  const permisos = result?.data || []
  const pageCount = result?.meta?.lastPage || 1
  const { data: cargos = [] } = useQuery({ queryKey: ['cargos-list'], queryFn: () => findCargos() })
  const { data: modulos = [] } = useQuery({ queryKey: ['modulos-list'], queryFn: () => findModulos() })

  const cargoItems = useMemo(() => Object.fromEntries(cargos.map(c => [String(c.id), c.nombre])), [cargos])
  const moduloItems = useMemo(() => Object.fromEntries(modulos.map(m => [String(m.id), m.nombre])), [modulos])

  const createMutation = useMutation({
    mutationFn: (input: typeof form) => createPermiso({
      cargoId: Number(input.cargoId),
      moduloId: Number(input.moduloId),
      crear: input.crear ? 1 : 0,
      leer: input.leer ? 1 : 0,
      actualizar: input.actualizar ? 1 : 0,
      eliminar: input.eliminar ? 1 : 0,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['permisos'] }); toast.success('Permiso creado'); handleClose() },
    onError: () => toast.error('Error al crear permiso'),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Record<string, unknown> }) => updatePermiso(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['permisos'] }); toast.success('Permiso actualizado'); handleClose() },
    onError: () => toast.error('Error al actualizar permiso'),
  })
  const deleteMutation = useMutation({
    mutationFn: deletePermiso,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['permisos'] }); toast.success('Permiso eliminado') },
    onError: () => toast.error('Error al eliminar permiso'),
  })

  function handleClose() { setOpen(false); setEditing(null); setForm({ ...emptyForm }); setErrors({}) }
  function handleEdit(p: Permiso) {
    setEditing(p)
    setForm({
      cargoId: p.cargoId,
      moduloId: p.moduloId,
      crear: p.crear === 1,
      leer: p.leer === 1,
      actualizar: p.actualizar === 1,
      eliminar: p.eliminar === 1,
    })
    setErrors({}); setOpen(true)
  }
  function validate() {
    const e: Record<string, string> = {}
    if (!form.cargoId) e.cargoId = 'Seleccione un cargo'
    if (!form.moduloId) e.moduloId = 'Seleccione un módulo'
    setErrors(e); return Object.keys(e).length === 0
  }
  async function handleSubmit() {
    if (!validate()) return; setSaving(true)
    try {
      if (editing) await updateMutation.mutateAsync({ id: editing.id, input: form })
      else await createMutation.mutateAsync(form)
    } finally { setSaving(false) }
  }

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
          <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(row.original)}
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

      <FormModal
        open={open}
        onOpenChange={handleClose}
        title={editing ? 'Editar Permiso' : 'Nuevo Permiso'}
        description="Selecciona el cargo, módulo y permisos CRUD"
        editing={!!editing}
        saving={saving}
        onSubmit={handleSubmit}
      >
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Cargo</label>
          <Select value={form.cargoId ? String(form.cargoId) : undefined} items={cargoItems} onValueChange={(v) => setForm({ ...form, cargoId: Number(v) })}>
            <SelectTrigger><SelectValue placeholder="Seleccionar cargo" /></SelectTrigger>
            <SelectContent>
              {cargos.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.cargoId && <p className="text-xs text-destructive">{errors.cargoId}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Módulo</label>
          <Select value={form.moduloId ? String(form.moduloId) : undefined} items={moduloItems} onValueChange={(v) => setForm({ ...form, moduloId: Number(v) })}>
            <SelectTrigger><SelectValue placeholder="Seleccionar módulo" /></SelectTrigger>
            <SelectContent>
              {modulos.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>{m.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.moduloId && <p className="text-xs text-destructive">{errors.moduloId}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.crear} onCheckedChange={(v: boolean) => setForm({ ...form, crear: v })} />
            Crear
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.leer} onCheckedChange={(v: boolean) => setForm({ ...form, leer: v })} />
            Leer
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.actualizar} onCheckedChange={(v: boolean) => setForm({ ...form, actualizar: v })} />
            Actualizar
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={form.eliminar} onCheckedChange={(v: boolean) => setForm({ ...form, eliminar: v })} />
            Eliminar
          </label>
        </div>
      </FormModal>

      <DataTable columns={columns} data={permisos} searchKey="cargo" searchPlaceholder="Buscar por cargo..." loading={isLoading} page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  )
}
