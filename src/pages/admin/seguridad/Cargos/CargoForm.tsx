import { useMemo, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import Modal from '@/components/Modal'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

import { create as createCargo, update as updateCargo } from '@/modules/seguridad/cargos/services'
import { findCombo as findAreasCombo } from '@/modules/seguridad/areas/services'
import type { Cargo } from '@/modules/seguridad/cargos/types'
import { toItemsRecord } from '@/lib/combo'

const emptyForm = { codigo: '', nombre: '', areaId: 0 }

interface Props {
  open: boolean
  onOpenChange: () => void
  editing: Cargo | null
}

export default function CargoForm({ open, onOpenChange, editing }: Props) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ ...emptyForm })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const { data: areasCombo = [] } = useQuery({ queryKey: ['areas-combo'], queryFn: () => findAreasCombo() })
  const areaItems = useMemo(() => toItemsRecord(areasCombo), [areasCombo])

  useEffect(() => {
    if (editing) {
      setForm({ codigo: editing.codigo, nombre: editing.nombre, areaId: editing.areaId || 0 })
    } else {
      setForm({ ...emptyForm })
    }
    setErrors({})
  }, [editing, open])

  const createMutation = useMutation({
    mutationFn: (input: typeof form) => createCargo({
      codigo: input.codigo,
      nombre: input.nombre,
      areaId: input.areaId || null,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cargos'] }); toast.success('Cargo creado'); onOpenChange() },
    onError: () => toast.error('Error al crear cargo'),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Record<string, unknown> }) => updateCargo(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cargos'] }); toast.success('Cargo actualizado'); onOpenChange() },
    onError: () => toast.error('Error al actualizar cargo'),
  })

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

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
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
        <Select value={form.areaId ? String(form.areaId) : ""} items={areaItems} onValueChange={(v) => setForm({ ...form, areaId: Number(v) })}>
          <SelectTrigger><SelectValue placeholder="Seleccionar área (opcional)" /></SelectTrigger>
          <SelectContent searchable searchPlaceholder="Buscar área...">
            {areasCombo.map((a) => (
              <SelectItem key={a.value} value={String(a.value)}>{a.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Modal>
  )
}
