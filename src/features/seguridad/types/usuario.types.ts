export interface Usuario {
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

export type CreateUsuarioInput = {
  personaId: number
  contrasenia: string
}

export type UpdateUsuarioInput = Partial<CreateUsuarioInput>
