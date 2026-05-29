import apiClient from '@/api/client'
import type { Cargo } from './types'
import type { PaginatedResponse } from '@/types/pagination.types'
import type { ComboOption } from '@/types/combo.types'

type CreateCargoInput = Pick<Cargo, 'codigo' | 'nombre'> & { areaId?: number | null; esActivo?: number }
type UpdateCargoInput = Partial<CreateCargoInput>

export async function findCombo(): Promise<ComboOption[]> {
  const { data } = await apiClient.get<ComboOption[]>('/cargos/combo')
  return data
}

export async function findAll(): Promise<Cargo[]>
export async function findAll(page: number, limit?: number): Promise<PaginatedResponse<Cargo>>
export async function findAll(page?: number, limit?: number): Promise<Cargo[] | PaginatedResponse<Cargo>> {
  const params: Record<string, number> = {}
  if (page) { params.page = page; params.limit = limit || 10 }
  const { data } = await apiClient.get('/cargos', { params })
  if (page) return data as PaginatedResponse<Cargo>
  return Array.isArray(data) ? data : (data as PaginatedResponse<Cargo>).data
}

export async function findOne(id: number): Promise<Cargo> {
  const { data } = await apiClient.get<Cargo>(`/cargos/${id}`)
  return data
}

export async function create(input: CreateCargoInput): Promise<Cargo> {
  const { data } = await apiClient.post<Cargo>('/cargos', input)
  return data
}

export async function update(id: number, input: UpdateCargoInput): Promise<Cargo> {
  const { data } = await apiClient.patch<Cargo>(`/cargos/${id}`, input)
  return data
}

export async function softRemove(id: number): Promise<void> {
  await apiClient.delete(`/cargos/${id}`)
}
