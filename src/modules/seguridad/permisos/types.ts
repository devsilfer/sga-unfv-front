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
