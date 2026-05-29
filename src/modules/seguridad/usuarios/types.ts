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
