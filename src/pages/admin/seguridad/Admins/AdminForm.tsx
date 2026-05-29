import { useMemo, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import FormModal from '@/components/FormModal'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

import { create as createAdmin, update as updateAdmin } from '@/modules/seguridad/admins/services'
import { findAll as findUsuarios } from '@/modules/seguridad/usuarios/services'
import { findCombo as findCargosCombo } from '@/modules/seguridad/cargos/services'
import type { Admin } from '@/modules/seguridad/admins/types'
import { toItemsRecord } from '@/lib/combo'

const emptyForm = { usuarioId: 0, cargoId: 0, codigo: '', correo: '' }

interface Props {
  open: boolean
  onOpenChange: () => void
  editing: Admin | null
}

export default function AdminForm({ open, onOpenChange, editing }: Props) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ ...emptyForm })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const { data: usuariosList = [] } = useQuery({ queryKey: ['usuarios-list'], queryFn: () => findUsuarios() })
  const { data: cargosCombo = [] } = useQuery({ queryKey: ['cargos-combo'], queryFn: () => findCargosCombo() })

  const usuarioItems = useMemo(() => Object.fromEntries(usuariosList.map(u => [
    String(u.id),
    u.persona ? `${u.persona.nombres} ${u.persona.apellidoPaterno || ''}`.trim() : `Usuario #${u.id}`,
  ])), [usuariosList])
  const cargoItems = useMemo(() => toItemsRecord(cargosCombo), [cargosCombo])

  useEffect(() => {
    if (editing) {
      setForm({ usuarioId: editing.usuarioId, cargoId: editing.cargoId, codigo: editing.codigo, correo: editing.correo })
    } else {
      setForm({ ...emptyForm })
    }
    setErrors({})
  }, [editing, open])

  const createMutation = useMutation({
    mutationFn: (input: typeof form) => createAdmin({
      usuarioId: Number(input.usuarioId),
      cargoId: Number(input.cargoId),
      codigo: input.codigo,
      correo: input.correo,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admins'] }); toast.success('Admin creado'); onOpenChange() },
    onError: () => toast.error('Error al crear admin'),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Record<string, unknown> }) => updateAdmin(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admins'] }); toast.success('Admin actualizado'); onOpenChange() },
    onError: () => toast.error('Error al actualizar admin'),
  })

  function validate() {
    const e: Record<string, string> = {}
    if (!form.usuarioId) e.usuarioId = 'Seleccione un usuario'
    if (!form.cargoId) e.cargoId = 'Seleccione un cargo'
    if (!form.codigo) e.codigo = 'Requerido'
    if (!form.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) e.correo = 'Correo inválido'
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
      title={editing ? 'Editar Admin' : 'Nuevo Admin'}
      description="Ingresa los datos del administrador"
      editing={!!editing}
      saving={saving}
      onSubmit={handleSubmit}
    >
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Usuario</label>
        <Select value={form.usuarioId ? String(form.usuarioId) : ""} items={usuarioItems} onValueChange={(v) => setForm({ ...form, usuarioId: Number(v) })}>
          <SelectTrigger><SelectValue placeholder="Seleccionar usuario" /></SelectTrigger>
          <SelectContent>
            {usuariosList.map((u) => (
              <SelectItem key={u.id} value={String(u.id)}>
                {u.persona ? `${u.persona.nombres} ${u.persona.apellidoPaterno || ''}`.trim() : `Usuario #${u.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.usuarioId && <p className="text-xs text-destructive">{errors.usuarioId}</p>}
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Cargo</label>
        <Select value={form.cargoId ? String(form.cargoId) : ""} items={cargoItems} onValueChange={(v) => setForm({ ...form, cargoId: Number(v) })}>
          <SelectTrigger><SelectValue placeholder="Seleccionar cargo" /></SelectTrigger>
          <SelectContent>
            {cargosCombo.map((c) => (
              <SelectItem key={c.value} value={String(c.value)}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.cargoId && <p className="text-xs text-destructive">{errors.cargoId}</p>}
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Código</label>
        <Input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
        {errors.codigo && <p className="text-xs text-destructive">{errors.codigo}</p>}
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Correo</label>
        <Input value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
        {errors.correo && <p className="text-xs text-destructive">{errors.correo}</p>}
      </div>
    </FormModal>
  )
}
