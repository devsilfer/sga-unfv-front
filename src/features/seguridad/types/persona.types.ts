export interface TipoIdentificacion {
  id: number
  codigo: string
  nombre: string
}

export interface Genero {
  id: number
  codigo: string
  nombre: string
}

export interface Ubigeo {
  id: string
  departamento: string
  provincia: string
  distrito: string
}

export interface Pais {
  id: number
  codigo: string
  nombre: string
}

export interface Persona {
  id: number
  tipoIdentificacionId: number
  numeroDocumento: string
  correoPersonal: string
  nombres: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  fecNac?: string
  numCelular?: string
  avatarUrl?: string
  generoId: number
  ubigeoId?: string
  paisId?: number
  direccion?: string
  tipoIdentificacion?: TipoIdentificacion
  genero?: Genero
  ubigeo?: Ubigeo
  pais?: Pais
}

export type CreatePersonaInput = {
  numeroDocumento: string
  correoPersonal: string
  nombres: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  fecNac?: string
  numCelular?: string
  avatarUrl?: string
  ubigeoId?: string
  direccion?: string
}

export type UpdatePersonaInput = Partial<CreatePersonaInput>
