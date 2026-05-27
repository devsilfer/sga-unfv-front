export interface Modulo {
  id: number
  codigo: string
  nombre: string
  esActivo: number
}

export type CreateModuloInput = {
  codigo: string
  nombre: string
  esActivo?: number
}

export type UpdateModuloInput = Partial<CreateModuloInput>
