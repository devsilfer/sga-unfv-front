import { useMemo, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import Modal from '@/components/Modal'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

import { create as createUsuario, update as updateUsuario } from '@/modules/seguridad/usuarios/services'
import { findAll as findPersonas } from '@/modules/seguridad/personas/services'
import type { Usuario } from '@/modules/seguridad/usuarios/types'

const emptyForm = { personaId: 0, contrasenia: '' }

interface Props {
  open: boolean
  onOpenChange: () => void
  editing: Usuario | null
}

export default function UsuarioForm({ open, onOpenChange, editing }: Props) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ ...emptyForm })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const { data: personas = [] } = useQuery({
    queryKey: ['personas-list'],
    queryFn: () => findPersonas(),
  })
  const personaItems = useMemo(() => Object.fromEntries(personas.map(p => [
    String(p.id),
    `${p.nombres} ${p.apellidoPaterno || ''} - ${p.numeroDocumento}`,
  ])), [personas])

  useEffect(() => {
    if (editing) {
      setForm({ personaId: editing.personaId, contrasenia: '' })
    } else {
      setForm({ ...emptyForm })
    }
    setErrors({})
  }, [editing, open])

  const createMutation = useMutation({
    mutationFn: (input: typeof form) => createUsuario({
      personaId: Number(input.personaId),
      contrasenia: input.contrasenia,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      toast.success('Usuario creado correctamente')
      onOpenChange()
    },
    onError: () => toast.error('Error al crear el usuario'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Record<string, unknown> }) =>
      updateUsuario(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      toast.success('Usuario actualizado correctamente')
      onOpenChange()
    },
    onError: () => toast.error('Error al actualizar el usuario'),
  })

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.personaId) newErrors.personaId = 'ID de persona requerido'
    if (!editing && !form.contrasenia) newErrors.contrasenia = 'Contraseña requerida'
    else if (form.contrasenia && form.contrasenia.length < 6) newErrors.contrasenia = 'Mínimo 6 caracteres'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setSaving(true)
    try {
      if (editing) {
        const payload: Record<string, unknown> = { personaId: form.personaId }
        if (form.contrasenia) payload.contrasenia = form.contrasenia
        await updateMutation.mutateAsync({ id: editing.id, input: payload })
      } else {
        await createMutation.mutateAsync(form)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? 'Editar Usuario' : 'Nuevo Usuario'}
      description="Ingresa los datos del usuario"
      editing={!!editing}
      saving={saving}
      onSubmit={handleSubmit}
    >
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Persona</label>
        <Select value={form.personaId ? String(form.personaId) : ""} items={personaItems} onValueChange={(v) => setForm({ ...form, personaId: Number(v) })}>
          <SelectTrigger><SelectValue placeholder="Seleccionar persona" /></SelectTrigger>
          <SelectContent searchable searchPlaceholder="Buscar persona...">
            {personas.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.nombres} {p.apellidoPaterno || ''} - {p.numeroDocumento}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.personaId && <p className="text-xs text-destructive">{errors.personaId}</p>}
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Contraseña {editing && '(dejar vacío para mantener)'}</label>
        <Input type="password" value={form.contrasenia} onChange={(e) => setForm({ ...form, contrasenia: e.target.value })} />
        {errors.contrasenia && <p className="text-xs text-destructive">{errors.contrasenia}</p>}
      </div>
    </Modal>
  )
}
