import { useMemo, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import FormModal from '@/components/FormModal'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

import { create as createPermiso, update as updatePermiso } from '@/modules/seguridad/permisos/services'
import { findAll as findCargos } from '@/modules/seguridad/cargos/services'
import { findAll as findModulos } from '@/modules/seguridad/modulos/services'
import type { Permiso } from '@/modules/seguridad/permisos/types'

const emptyForm = { cargoId: 0, moduloId: 0, crear: false, leer: false, actualizar: false, eliminar: false }

interface Props {
  open: boolean
  onOpenChange: () => void
  editing: Permiso | null
}

export default function PermisoForm({ open, onOpenChange, editing }: Props) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ ...emptyForm })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const { data: cargos = [] } = useQuery({ queryKey: ['cargos-list'], queryFn: () => findCargos() })
  const { data: modulos = [] } = useQuery({ queryKey: ['modulos-list'], queryFn: () => findModulos() })

  const cargoItems = useMemo(() => Object.fromEntries(cargos.map(c => [String(c.id), c.nombre])), [cargos])
  const moduloItems = useMemo(() => Object.fromEntries(modulos.map(m => [String(m.id), m.nombre])), [modulos])

  useEffect(() => {
    if (editing) {
      setForm({
        cargoId: editing.cargoId,
        moduloId: editing.moduloId,
        crear: editing.crear === 1,
        leer: editing.leer === 1,
        actualizar: editing.actualizar === 1,
        eliminar: editing.eliminar === 1,
      })
    } else {
      setForm({ ...emptyForm })
    }
    setErrors({})
  }, [editing, open])

  const createMutation = useMutation({
    mutationFn: (input: typeof form) => createPermiso({
      cargoId: Number(input.cargoId),
      moduloId: Number(input.moduloId),
      crear: input.crear ? 1 : 0,
      leer: input.leer ? 1 : 0,
      actualizar: input.actualizar ? 1 : 0,
      eliminar: input.eliminar ? 1 : 0,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['permisos'] }); toast.success('Permiso creado'); onOpenChange() },
    onError: () => toast.error('Error al crear permiso'),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Record<string, unknown> }) => updatePermiso(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['permisos'] }); toast.success('Permiso actualizado'); onOpenChange() },
    onError: () => toast.error('Error al actualizar permiso'),
  })

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

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? 'Editar Permiso' : 'Nuevo Permiso'}
      description="Selecciona el cargo, módulo y permisos CRUD"
      editing={!!editing}
      saving={saving}
      onSubmit={handleSubmit}
    >
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Cargo</label>
        <Select value={form.cargoId ? String(form.cargoId) : ""} items={cargoItems} onValueChange={(v) => setForm({ ...form, cargoId: Number(v) })}>
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
        <Select value={form.moduloId ? String(form.moduloId) : ""} items={moduloItems} onValueChange={(v) => setForm({ ...form, moduloId: Number(v) })}>
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
  )
}
