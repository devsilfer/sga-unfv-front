import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Pencil, Trash2, UserCheck, UserX } from 'lucide-react'

import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import FormModal from '@/components/FormModal'
import { Input } from '@/components/ui/input'

import { findAll as findModulos, create as createModulo, update as updateModulo, softRemove as deleteModulo } from '@/modules/seguridad/modulos/services'
import type { Modulo } from '@/modules/seguridad/modulos/types'

const emptyForm = { codigo: '', nombre: '' }

export default function Modulos() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Modulo | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)

  const { data: result, isLoading } = useQuery({ queryKey: ['modulos', page], queryFn: () => findModulos(page) })
  const modulos = result?.data || []
  const pageCount = result?.meta?.lastPage || 1
  const createMutation = useMutation({
    mutationFn: createModulo,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['modulos'] }); toast.success('Módulo creado'); handleClose() },
    onError: () => toast.error('Error al crear módulo'),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Record<string, unknown> }) => updateModulo(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['modulos'] }); toast.success('Módulo actualizado'); handleClose() },
    onError: () => toast.error('Error al actualizar módulo'),
  })
  const deleteMutation = useMutation({
    mutationFn: deleteModulo,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['modulos'] }); toast.success('Módulo eliminado') },
    onError: () => toast.error('Error al eliminar módulo'),
  })

  function handleClose() { setOpen(false); setEditing(null); setForm({ ...emptyForm }); setErrors({}) }
  function handleEdit(m: Modulo) { setEditing(m); setForm({ codigo: m.codigo, nombre: m.nombre }); setErrors({}); setOpen(true) }
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

  const columns = useMemo<ColumnDef<Modulo>[]>(() => [
    { accessorKey: 'codigo', header: 'Código' },
    { accessorKey: 'nombre', header: 'Nombre' },
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
            if (confirm('¿Eliminar este módulo?')) deleteMutation.mutate(row.original.id)
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
        <div><h1 className="text-2xl font-bold text-foreground">Módulos</h1><p className="mt-1 text-sm text-muted-foreground">Gestión de módulos del sistema</p></div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto"><Plus className="h-4 w-4" /> Nuevo Módulo</Button>
      </div>

      <FormModal
        open={open}
        onOpenChange={handleClose}
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
      </FormModal>

      <DataTable columns={columns} data={modulos} searchKey="nombre" searchPlaceholder="Buscar por nombre..." loading={isLoading} page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  )
}
