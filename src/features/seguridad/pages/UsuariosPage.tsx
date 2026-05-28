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

import { findAll as findUsuarios, create as createUsuario, update as updateUsuario, softRemove as deleteUsuario } from '@/features/seguridad/api/usuarios.api'
import { findAll as findPersonas } from '@/features/seguridad/api/personas.api'
import type { Usuario } from '@/features/seguridad/types/usuario.types'

const emptyForm = { personaId: 0, contrasenia: '' }

export default function UsuariosPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Usuario | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)

  const { data: result, isLoading } = useQuery({
    queryKey: ['usuarios', page],
    queryFn: () => findUsuarios(page),
  })
  const usuarios = result?.data || []
  const pageCount = result?.meta?.lastPage || 1
  const { data: personas = [] } = useQuery({
    queryKey: ['personas-list'],
    queryFn: () => findPersonas(),
  })
  const personaItems = useMemo(() => Object.fromEntries(personas.map(p => [
    String(p.id),
    `${p.nombres} ${p.apellidoPaterno || ''} - ${p.numeroDocumento}`,
  ])), [personas])

  const createMutation = useMutation({
    mutationFn: (input: typeof form) => createUsuario({
      personaId: Number(input.personaId),
      contrasenia: input.contrasenia,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      toast.success('Usuario creado correctamente')
      handleClose()
    },
    onError: () => toast.error('Error al crear el usuario'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Record<string, unknown> }) =>
      updateUsuario(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      toast.success('Usuario actualizado correctamente')
      handleClose()
    },
    onError: () => toast.error('Error al actualizar el usuario'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      toast.success('Usuario eliminado correctamente')
    },
    onError: () => toast.error('Error al eliminar el usuario'),
  })

  function handleClose() {
    setOpen(false)
    setEditing(null)
    setForm({ ...emptyForm })
    setErrors({})
  }

  function handleEdit(usuario: Usuario) {
    setEditing(usuario)
    setForm({ personaId: usuario.personaId, contrasenia: '' })
    setErrors({})
    setOpen(true)
  }

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

  const columns = useMemo<ColumnDef<Usuario>[]>(
    () => [
      {
        id: 'persona',
        header: 'Persona',
        accessorFn: (row) =>
          row.persona ? `${row.persona.nombres} ${row.persona.apellidoPaterno || ''}`.trim() : '-',
      },
      {
        id: 'documento',
        header: 'N° Documento',
        accessorFn: (row) => row.persona?.numeroDocumento || '-',
      },
      {
        id: 'correo',
        header: 'Correo',
        accessorFn: (row) => row.persona?.correoPersonal || '-',
      },
      {
        id: 'acciones',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(row.original)}
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => {
              if (confirm('¿Eliminar este usuario?')) deleteMutation.mutate(row.original.id)
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
          <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestión de usuarios del sistema</p>
        </div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Nuevo Usuario
        </Button>
      </div>

      <FormModal
        open={open}
        onOpenChange={handleClose}
        title={editing ? 'Editar Usuario' : 'Nuevo Usuario'}
        description="Ingresa los datos del usuario"
        editing={!!editing}
        saving={saving}
        onSubmit={handleSubmit}
      >
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Persona</label>
          <Select value={form.personaId ? String(form.personaId) : undefined} items={personaItems} onValueChange={(v) => setForm({ ...form, personaId: Number(v) })}>
            <SelectTrigger><SelectValue placeholder="Seleccionar persona" /></SelectTrigger>
            <SelectContent>
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
      </FormModal>

      <DataTable
        columns={columns}
        data={usuarios}
        searchKey="persona"
        searchPlaceholder="Buscar por persona..."
        loading={isLoading}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  )
}
