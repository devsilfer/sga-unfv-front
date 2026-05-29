import apiClient from '@/api/client'
import type { ComboOptionStr } from '@/types/combo.types'

export async function findDepartamentos(): Promise<string[]> {
  const { data } = await apiClient.get<string[]>('/ubigeos/departamentos')
  return data
}

export async function findProvincias(departamento: string): Promise<string[]> {
  const { data } = await apiClient.get<string[]>('/ubigeos/provincias', { params: { departamento } })
  return data
}

export async function findDistritos(departamento: string, provincia: string): Promise<ComboOptionStr[]> {
  const { data } = await apiClient.get<ComboOptionStr[]>('/ubigeos/distritos', { params: { departamento, provincia } })
  return data
}
