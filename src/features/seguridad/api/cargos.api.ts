import apiClient from '@/api/client'
import type { Cargo, CreateCargoInput, UpdateCargoInput } from '../types/cargo.types'
import type { PaginatedResponse } from '@/types/pagination.types'

export async function findAll(): Promise<Cargo[]>
export async function findAll(page: number, limit?: number): Promise<PaginatedResponse<Cargo>>
export async function findAll(page?: number, limit?: number): Promise<Cargo[] | PaginatedResponse<Cargo>> {
  const params: Record<string, number> = {}
  if (page) { params.page = page; params.limit = limit || 10 }
  const { data } = await apiClient.get('/cargos', { params })
  return data
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
