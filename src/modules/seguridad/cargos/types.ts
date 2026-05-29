export interface Cargo {
  id: number
  codigo: string
  nombre: string
  esActivo: number
  areaId?: number | null
  area?: {
    id: number
    nombre: string
  }
}
