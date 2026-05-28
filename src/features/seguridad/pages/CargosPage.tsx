import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2 } from 'lucide-react'

import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import FormModal from '@/components/FormModal'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

import { findAll as findCargos, create as createCargo, update as updateCargo, softRemove as deleteCargo } from '@/features/seguridad/api/cargos.api'
import { findCombo as findAreasCombo } from '@/features/seguridad/api/areas.api'
import type { Cargo } from '@/features/seguridad/types/cargo.types'
import { toItemsRecord } from '@/lib/combo'

const emptyForm = { codigo: '', nombre: '', areaId: 0 }

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
  const { data: areasCombo = [] } = useQuery({ queryKey: ['areas-combo'], queryFn: () => findAreasCombo() })
  const areaItems = useMemo(() => toItemsRecord(areasCombo), [areasCombo])

  const createMutation = useMutation({
    mutationFn: (input: typeof form) => createCargo({
      codigo: input.codigo,
      nombre: input.nombre,
      areaId: input.areaId || null,
    }),
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
  function handleEdit(c: Cargo) {
    setEditing(c)
    setForm({ codigo: c.codigo, nombre: c.nombre, areaId: c.areaId || 0 })
    setErrors({}); setOpen(true)
  }
  function validate() {
    const e: Record<string, string> = {}
    if (!form.codigo) e.codigo = 'Requerido'
    if (!form.nombre || form.nombre.length < 2) e.nombre = 'Mínimo 2 caracteres'
    setErrors(e); return Object.keys(e).length === 0
  }
  async function handleSubmit() {
    if (!validate()) return; setSaving(true)
    try {
      const payload: Record<string, unknown> = { codigo: form.codigo, nombre: form.nombre }
      if (form.areaId) payload.areaId = form.areaId
      if (editing) await updateMutation.mutateAsync({ id: editing.id, input: payload })
      else await createMutation.mutateAsync(payload as typeof form)
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
      id: 'acciones', cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(row.original)}
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

      <FormModal
        open={open}
        onOpenChange={handleClose}
        title={editing ? 'Editar Cargo' : 'Nuevo Cargo'}
        description="Ingresa los datos del cargo"
        editing={!!editing}
        saving={saving}
        onSubmit={handleSubmit}
      >
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
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Área</label>
          <Select value={form.areaId ? String(form.areaId) : undefined} items={areaItems} onValueChange={(v) => setForm({ ...form, areaId: Number(v) })}>
            <SelectTrigger><SelectValue placeholder="Seleccionar área (opcional)" /></SelectTrigger>
            <SelectContent>
              {areasCombo.map((a) => (
                <SelectItem key={a.value} value={String(a.value)}>{a.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FormModal>

      <DataTable columns={columns} data={cargos} searchKey="nombre" searchPlaceholder="Buscar por nombre..." loading={isLoading} page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  )
}
