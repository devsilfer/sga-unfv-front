export interface Permiso {
  id: number
  cargoId: number
  moduloId: number
  esActivo: number
  crear: number
  leer: number
  actualizar: number
  eliminar: number
  cargo?: {
    id: number
    codigo: string
    nombre: string
  }
  modulo?: {
    id: number
    codigo: string
    nombre: string
  }
}

export type CreatePermisoInput = {
  cargoId: number
  moduloId: number
  esActivo?: number
  crear?: number
  leer?: number
  actualizar?: number
  eliminar?: number
}

export type UpdatePermisoInput = Partial<CreatePermisoInput>
