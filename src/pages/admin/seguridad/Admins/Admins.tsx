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

import { findAll as findAdmins, create as createAdmin, update as updateAdmin, softRemove as deleteAdmin } from '@/modules/seguridad/admins/services'
import { findAll as findUsuarios } from '@/modules/seguridad/usuarios/services'
import { findCombo as findCargosCombo } from '@/modules/seguridad/cargos/services'
import type { Admin } from '@/modules/seguridad/admins/types'
import { toItemsRecord } from '@/lib/combo'

const emptyForm = { usuarioId: 0, cargoId: 0, codigo: '', correo: '' }

export default function Admins() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Admin | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)

  const { data: result, isLoading } = useQuery({ queryKey: ['admins', page], queryFn: () => findAdmins(page) })
  const admins = result?.data || []
  const pageCount = result?.meta?.lastPage || 1
  const { data: usuariosList = [] } = useQuery({ queryKey: ['usuarios-list'], queryFn: () => findUsuarios() })
  const { data: cargosCombo = [] } = useQuery({ queryKey: ['cargos-combo'], queryFn: () => findCargosCombo() })

  const usuarioItems = useMemo(() => Object.fromEntries(usuariosList.map(u => [
    String(u.id),
    u.persona ? `${u.persona.nombres} ${u.persona.apellidoPaterno || ''}`.trim() : `Usuario #${u.id}`,
  ])), [usuariosList])
  const cargoItems = useMemo(() => toItemsRecord(cargosCombo), [cargosCombo])

  const createMutation = useMutation({
    mutationFn: (input: typeof form) => createAdmin({
      usuarioId: Number(input.usuarioId),
      cargoId: Number(input.cargoId),
      codigo: input.codigo,
      correo: input.correo,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admins'] }); toast.success('Admin creado'); handleClose() },
    onError: () => toast.error('Error al crear admin'),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Record<string, unknown> }) => updateAdmin(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admins'] }); toast.success('Admin actualizado'); handleClose() },
    onError: () => toast.error('Error al actualizar admin'),
  })
  const deleteMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admins'] }); toast.success('Admin eliminado') },
    onError: () => toast.error('Error al eliminar admin'),
  })

  function handleClose() { setOpen(false); setEditing(null); setForm({ ...emptyForm }); setErrors({}) }
  function handleEdit(a: Admin) {
    setEditing(a)
    setForm({ usuarioId: a.usuarioId, cargoId: a.cargoId, codigo: a.codigo, correo: a.correo })
    setErrors({}); setOpen(true)
  }
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

  const columns = useMemo<ColumnDef<Admin>[]>(() => [
    { accessorKey: 'codigo', header: 'Código' },
    {
      id: 'persona', header: 'Persona',
      accessorFn: (row) => row.usuario?.persona
        ? `${row.usuario.persona.nombres} ${row.usuario.persona.apellidoPaterno || ''}`.trim()
        : '-',
    },
    { accessorKey: 'correo', header: 'Correo' },
    {
      id: 'cargo', header: 'Cargo',
      accessorFn: (row) => row.cargo?.nombre || '-',
    },
    {
      id: 'acciones', cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(row.original)}
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => {
            if (confirm('¿Eliminar este admin?')) deleteMutation.mutate(row.original.id)
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
        <div><h1 className="text-2xl font-bold text-foreground">Admins</h1><p className="mt-1 text-sm text-muted-foreground">Gestión de administradores</p></div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto"><Plus className="h-4 w-4" /> Nuevo Admin</Button>
      </div>

      <FormModal
        open={open}
        onOpenChange={handleClose}
        title={editing ? 'Editar Admin' : 'Nuevo Admin'}
        description="Ingresa los datos del administrador"
        editing={!!editing}
        saving={saving}
        onSubmit={handleSubmit}
      >
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Usuario</label>
          <Select value={form.usuarioId ? String(form.usuarioId) : undefined} items={usuarioItems} onValueChange={(v) => setForm({ ...form, usuarioId: Number(v) })}>
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
          <Select value={form.cargoId ? String(form.cargoId) : undefined} items={cargoItems} onValueChange={(v) => setForm({ ...form, cargoId: Number(v) })}>
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

      <DataTable columns={columns} data={admins} searchKey="codigo" searchPlaceholder="Buscar por código..." loading={isLoading} page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  )
}
