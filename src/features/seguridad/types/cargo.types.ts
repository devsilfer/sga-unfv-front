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

export type CreateCargoInput = {
  codigo: string
  nombre: string
  areaId?: number | null
  esActivo?: number
}

export type UpdateCargoInput = Partial<CreateCargoInput>
