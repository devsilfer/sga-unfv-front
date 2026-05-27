export interface Admin {
  id: number
  usuarioId: number
  cargoId: number
  codigo: string
  correo: string
  esActivo: number
  usuario?: {
    id: number
    personaId: number
    persona?: {
      id: number
      numeroDocumento: string
      nombres: string
      apellidoPaterno?: string
      apellidoMaterno?: string
      correoPersonal: string
    }
  }
  cargo?: {
    id: number
    codigo: string
    nombre: string
  }
}

export type CreateAdminInput = {
  usuarioId: number
  cargoId: number
  codigo: string
  correo: string
  esActivo?: number
}

export type UpdateAdminInput = Partial<CreateAdminInput>
