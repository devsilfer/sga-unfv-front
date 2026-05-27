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

import { findAll as findAdmins, create as createAdmin, update as updateAdmin, softRemove as deleteAdmin } from '@/features/seguridad/api/admins.api'
import type { Admin } from '@/features/seguridad/types/admin.types'

const emptyForm = { usuarioId: 0, cargoId: 0, codigo: '', correo: '' }

export default function AdminsPage() {
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
    if (!form.usuarioId) e.usuarioId = 'Requerido'
    if (!form.cargoId) e.cargoId = 'Requerido'
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
        <div><h1 className="text-2xl font-bold">Admins</h1><p className="mt-1 text-sm text-gray-500">Gestión de administradores</p></div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto"><Plus className="h-4 w-4" /> Nuevo Admin</Button>
      </div>
      <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) handleClose() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Editar Admin' : 'Nuevo Admin'}</DialogTitle><DialogDescription>Ingresa los datos del administrador</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">ID Usuario</label>
              <Input type="number" value={form.usuarioId || ''} onChange={(e) => setForm({ ...form, usuarioId: Number(e.target.value) })} />
              {errors.usuarioId && <p className="text-xs text-destructive">{errors.usuarioId}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">ID Cargo</label>
              <Input type="number" value={form.cargoId || ''} onChange={(e) => setForm({ ...form, cargoId: Number(e.target.value) })} />
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={saving}>{saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={admins} searchKey="codigo" searchPlaceholder="Buscar por código..." loading={isLoading} page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  )
}
