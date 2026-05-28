import { useMemo, useState, useEffect } from 'react'
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

import { findAll as findPersonas, create as createPersona, update as updatePersona, softRemove as deletePersona } from '@/features/seguridad/api/personas.api'
import { findCombo as findTiposIdCombo } from '@/features/maestras/api/tipos-identificacion.api'
import { findCombo as findGenerosCombo } from '@/features/maestras/api/generos.api'
import { findCombo as findPaisesCombo } from '@/features/maestras/api/paises.api'
import { findDepartamentos, findProvincias, findDistritos } from '@/features/maestras/api/ubigeos.api'
import type { Persona } from '@/features/seguridad/types/persona.types'
import { toItemsRecord } from '@/lib/combo'

const emptyForm = {
  tipoIdentificacionId: 0,
  numeroDocumento: '',
  correoPersonal: '',
  nombres: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  fecNac: '',
  numCelular: '',
  generoId: 0,
  ubigeoId: '',
  paisId: 0,
  direccion: '',
}

export default function PersonasPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Persona | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)

  const [departamento, setDepartamento] = useState('')
  const [provincia, setProvincia] = useState('')

  const { data: result, isLoading } = useQuery({
    queryKey: ['personas', page],
    queryFn: () => findPersonas(page),
  })
  const personas = result?.data || []
  const pageCount = result?.meta?.lastPage || 1

  const { data: tiposId = [] } = useQuery({ queryKey: ['tipos-id-combo'], queryFn: () => findTiposIdCombo() })
  const { data: generos = [] } = useQuery({ queryKey: ['generos-combo'], queryFn: () => findGenerosCombo() })
  const { data: paises = [] } = useQuery({ queryKey: ['paises-combo'], queryFn: () => findPaisesCombo() })
  const { data: departamentos = [] } = useQuery({ queryKey: ['ubigeos-departamentos'], queryFn: () => findDepartamentos() })
  const { data: provincias = [] } = useQuery({
    queryKey: ['ubigeos-provincias', departamento],
    queryFn: () => findProvincias(departamento),
    enabled: !!departamento,
  })
  const { data: distritos = [] } = useQuery({
    queryKey: ['ubigeos-distritos', departamento, provincia],
    queryFn: () => findDistritos(departamento, provincia),
    enabled: !!departamento && !!provincia,
  })

  const tipoIdItems = useMemo(() => toItemsRecord(tiposId), [tiposId])
  const generoItems = useMemo(() => toItemsRecord(generos), [generos])
  const paisItems = useMemo(() => toItemsRecord(paises), [paises])
  const distritoItems = useMemo(() => toItemsRecord(distritos), [distritos])

  useEffect(() => {
    if (editing && editing.ubigeo) {
      const ub = editing.ubigeo
      if (ub.departamento) setDepartamento(ub.departamento)
      if (ub.provincia) setProvincia(ub.provincia)
    } else if (!open) {
      setDepartamento('')
      setProvincia('')
    }
  }, [editing, open])

  const createMutation = useMutation({
    mutationFn: createPersona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] })
      toast.success('Persona creada correctamente')
      handleClose()
    },
    onError: () => toast.error('Error al crear la persona'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Record<string, unknown> }) =>
      updatePersona(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] })
      toast.success('Persona actualizada correctamente')
      handleClose()
    },
    onError: () => toast.error('Error al actualizar la persona'),
  })

  const deleteMutation = useMutation({
    mutationFn: deletePersona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] })
      toast.success('Persona eliminada correctamente')
    },
    onError: () => toast.error('Error al eliminar la persona'),
  })

  function handleClose() {
    setOpen(false)
    setEditing(null)
    setForm({ ...emptyForm })
    setErrors({})
    setDepartamento('')
    setProvincia('')
  }

  function handleEdit(persona: Persona) {
    setEditing(persona)
    setForm({
      tipoIdentificacionId: persona.tipoIdentificacionId,
      numeroDocumento: persona.numeroDocumento,
      correoPersonal: persona.correoPersonal,
      nombres: persona.nombres,
      apellidoPaterno: persona.apellidoPaterno || '',
      apellidoMaterno: persona.apellidoMaterno || '',
      fecNac: persona.fecNac || '',
      numCelular: persona.numCelular || '',
      generoId: persona.generoId,
      ubigeoId: persona.ubigeoId || '',
      paisId: persona.paisId || 0,
      direccion: persona.direccion || '',
    })
    setErrors({})
    setOpen(true)
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.tipoIdentificacionId) newErrors.tipoIdentificacionId = 'Seleccione un tipo'
    if (!form.numeroDocumento || form.numeroDocumento.length < 8) newErrors.numeroDocumento = 'Mínimo 8 caracteres'
    if (!form.nombres || form.nombres.length < 2) newErrors.nombres = 'Mínimo 2 caracteres'
    if (!form.correoPersonal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correoPersonal)) newErrors.correoPersonal = 'Correo inválido'
    if (!form.generoId) newErrors.generoId = 'Seleccione un género'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setSaving(true)
    try {
      const payload: Record<string, unknown> = { ...form }
      if (!payload.fecNac) delete payload.fecNac
      if (!payload.numCelular) delete payload.numCelular
      if (!payload.direccion) delete payload.direccion
      if (!payload.apellidoPaterno) delete payload.apellidoPaterno
      if (!payload.apellidoMaterno) delete payload.apellidoMaterno
      if (!payload.ubigeoId) delete payload.ubigeoId
      if (!payload.paisId) delete payload.paisId

      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, input: payload })
      } else {
        await createMutation.mutateAsync(payload as Parameters<typeof createPersona>[0])
      }
    } finally {
      setSaving(false)
    }
  }

  const columns = useMemo<ColumnDef<Persona>[]>(
    () => [
      { accessorKey: 'numeroDocumento', header: 'N° Documento' },
      {
        id: 'tipoIdentificacion',
        header: 'Tipo Ident.',
        accessorFn: (row) => row.tipoIdentificacion?.nombre || '-',
      },
      {
        id: 'nombreCompleto',
        header: 'Nombres y Apellidos',
        accessorFn: (row) => `${row.nombres} ${row.apellidoPaterno || ''} ${row.apellidoMaterno || ''}`.trim(),
      },
      { accessorKey: 'correoPersonal', header: 'Correo' },
      { accessorKey: 'numCelular', header: 'Celular' },
      {
        id: 'genero',
        header: 'Género',
        accessorFn: (row) => row.genero?.nombre || '-',
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
              if (confirm('¿Eliminar esta persona?')) deleteMutation.mutate(row.original.id)
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
          <h1 className="text-2xl font-bold text-foreground">Personas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestión de personas registradas en el sistema</p>
        </div>
        <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Nueva Persona
        </Button>
      </div>

      <FormModal
        open={open}
        onOpenChange={handleClose}
        title={editing ? 'Editar Persona' : 'Nueva Persona'}
        description={editing ? 'Modifica los datos de la persona' : 'Ingresa los datos de la nueva persona'}
        editing={!!editing}
        saving={saving}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tipo Identificación</label>
            <Select value={form.tipoIdentificacionId ? String(form.tipoIdentificacionId) : undefined} items={tipoIdItems} onValueChange={(v) => setForm({ ...form, tipoIdentificacionId: Number(v) })}>
              <SelectTrigger><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
              <SelectContent>
                {tiposId.map((t) => (
                  <SelectItem key={t.value} value={String(t.value)}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipoIdentificacionId && <p className="text-xs text-destructive">{errors.tipoIdentificacionId}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">N° Documento</label>
            <Input value={form.numeroDocumento} onChange={(e) => setForm({ ...form, numeroDocumento: e.target.value })} />
            {errors.numeroDocumento && <p className="text-xs text-destructive">{errors.numeroDocumento}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Nombres</label>
          <Input value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} />
          {errors.nombres && <p className="text-xs text-destructive">{errors.nombres}</p>}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Apellido Paterno</label>
            <Input value={form.apellidoPaterno} onChange={(e) => setForm({ ...form, apellidoPaterno: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Apellido Materno</label>
            <Input value={form.apellidoMaterno} onChange={(e) => setForm({ ...form, apellidoMaterno: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Correo Personal</label>
            <Input type="email" value={form.correoPersonal} onChange={(e) => setForm({ ...form, correoPersonal: e.target.value })} />
            {errors.correoPersonal && <p className="text-xs text-destructive">{errors.correoPersonal}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Celular</label>
            <Input value={form.numCelular} onChange={(e) => setForm({ ...form, numCelular: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Fecha Nacimiento</label>
            <Input type="date" value={form.fecNac} onChange={(e) => setForm({ ...form, fecNac: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Género</label>
            <Select value={form.generoId ? String(form.generoId) : undefined} items={generoItems} onValueChange={(v) => setForm({ ...form, generoId: Number(v) })}>
              <SelectTrigger><SelectValue placeholder="Seleccionar género" /></SelectTrigger>
              <SelectContent>
                {generos.map((g) => (
                  <SelectItem key={g.value} value={String(g.value)}>{g.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.generoId && <p className="text-xs text-destructive">{errors.generoId}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Departamento</label>
            <Select value={departamento} onValueChange={(v) => { setDepartamento(v || ''); setProvincia(''); setForm({ ...form, ubigeoId: '' }) }}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>
                {departamentos.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Provincia</label>
            <Select value={provincia} onValueChange={(v) => { setProvincia(v || ''); setForm({ ...form, ubigeoId: '' }) }} disabled={!departamento}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>
                {provincias.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Distrito</label>
            <Select value={form.ubigeoId} items={distritoItems} onValueChange={(v) => setForm({ ...form, ubigeoId: v || '' })} disabled={!provincia}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>
                {distritos.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">País</label>
            <Select value={form.paisId ? String(form.paisId) : undefined} items={paisItems} onValueChange={(v) => setForm({ ...form, paisId: Number(v) })}>
              <SelectTrigger><SelectValue placeholder="Seleccionar país (opcional)" /></SelectTrigger>
              <SelectContent>
                {paises.map((p) => (
                  <SelectItem key={p.value} value={String(p.value)}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Dirección</label>
            <Input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
          </div>
        </div>
      </FormModal>

      <DataTable
        columns={columns}
        data={personas}
        searchKey="numeroDocumento"
        searchPlaceholder="Buscar por documento..."
        loading={isLoading}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  )
}
