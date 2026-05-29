import Modal from '@/components/Modal'
import type { Persona } from '@/modules/seguridad/personas/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  persona: Persona | null
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value ?? '-'}</p>
    </div>
  )
}

export default function PersonaDetail({ open, onOpenChange, persona }: Props) {
  if (!persona) return null

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle de Persona"
      description="Información completa de la persona"
      hideFooter
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        <Field label="Tipo Identificación" value={persona.tipoIdentificacion?.nombre} />
        <Field label="N° Documento" value={persona.numeroDocumento} />
        <Field label="Nombres" value={persona.nombres} />
        <Field label="Apellido Paterno" value={persona.apellidoPaterno} />
        <Field label="Apellido Materno" value={persona.apellidoMaterno} />
        <Field label="Correo Personal" value={persona.correoPersonal} />
        <Field label="Celular" value={persona.numCelular} />
        <Field label="Fecha Nacimiento" value={persona.fecNac} />
        <Field label="Género" value={persona.genero?.nombre} />
        <div className="col-span-2">
          <Field label="Dirección" value={persona.direccion} />
        </div>
        <Field
          label="Ubigeo"
          value={
            persona.ubigeo
              ? `${persona.ubigeo.departamento} / ${persona.ubigeo.provincia} / ${persona.ubigeo.distrito}`
              : undefined
          }
        />
        <Field label="País" value={persona.pais?.nombre} />
      </div>
    </Modal>
  )
}
