import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import Modal from '@/components/Modal'
import { Input } from '@/components/ui/input'

import { create as createModulo, update as updateModulo } from '@/modules/seguridad/modulos/services'
import type { Modulo } from '@/modules/seguridad/modulos/types'

const emptyForm = { codigo: '', nombre: '' }

interface Props {
  open: boolean
  onOpenChange: () => void
  editing: Modulo | null
}

export default function ModuloForm({ open, onOpenChange, editing }: Props) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ ...emptyForm })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editing) {
      setForm({ codigo: editing.codigo, nombre: editing.nombre })
    } else {
      setForm({ ...emptyForm })
    }
    setErrors({})
  }, [editing, open])

  const createMutation = useMutation({
    mutationFn: createModulo,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['modulos'] }); toast.success('Módulo creado'); onOpenChange() },
    onError: () => toast.error('Error al crear módulo'),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Record<string, unknown> }) => updateModulo(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['modulos'] }); toast.success('Módulo actualizado'); onOpenChange() },
    onError: () => toast.error('Error al actualizar módulo'),
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
      if (editing) await updateMutation.mutateAsync({ id: editing.id, input: form })
      else await createMutation.mutateAsync(form)
    } finally { setSaving(false) }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? 'Editar Módulo' : 'Nuevo Módulo'}
      description="Ingresa los datos del módulo"
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
    </Modal>
  )
}
