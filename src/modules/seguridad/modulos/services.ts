import apiClient from '@/api/client'
import type { Modulo } from './types'
import type { PaginatedResponse } from '@/types/pagination.types'

type CreateModuloInput = Pick<Modulo, 'codigo' | 'nombre'> & { esActivo?: number }
type UpdateModuloInput = Partial<CreateModuloInput>

export async function findAll(): Promise<Modulo[]>
export async function findAll(page: number, limit?: number): Promise<PaginatedResponse<Modulo>>
export async function findAll(page?: number, limit?: number): Promise<Modulo[] | PaginatedResponse<Modulo>> {
  const params: Record<string, number> = {}
  if (page) { params.page = page; params.limit = limit || 10 }
  const { data } = await apiClient.get('/modulos', { params })
  return data
}

export async function findOne(id: number): Promise<Modulo> {
  const { data } = await apiClient.get<Modulo>(`/modulos/${id}`)
  return data
}

export async function create(input: CreateModuloInput): Promise<Modulo> {
  const { data } = await apiClient.post<Modulo>('/modulos', input)
  return data
}

export async function update(id: number, input: UpdateModuloInput): Promise<Modulo> {
  const { data } = await apiClient.patch<Modulo>(`/modulos/${id}`, input)
  return data
}

export async function softRemove(id: number): Promise<void> {
  await apiClient.delete(`/modulos/${id}`)
}
