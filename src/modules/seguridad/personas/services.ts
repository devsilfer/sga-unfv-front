import apiClient from '@/api/client'
import type { Persona } from './types'
import type { PaginatedResponse } from '@/types/pagination.types'

type CreatePersonaInput = Omit<Persona, 'id' | 'tipoIdentificacion' | 'genero' | 'ubigeo' | 'pais'>
type UpdatePersonaInput = Partial<CreatePersonaInput>

export async function findAll(): Promise<Persona[]>
export async function findAll(page: number, limit?: number): Promise<PaginatedResponse<Persona>>
export async function findAll(page?: number, limit?: number): Promise<Persona[] | PaginatedResponse<Persona>> {
  const params: Record<string, number> = {}
  if (page) { params.page = page; params.limit = limit || 10 }
  const { data } = await apiClient.get('/personas', { params })
  return data
}

export async function findOne(id: number): Promise<Persona> {
  const { data } = await apiClient.get<Persona>(`/personas/${id}`)
  return data
}

export async function create(input: CreatePersonaInput): Promise<Persona> {
  const { data } = await apiClient.post<Persona>('/personas', input)
  return data
}

export async function update(id: number, input: UpdatePersonaInput): Promise<Persona> {
  const { data } = await apiClient.patch<Persona>(`/personas/${id}`, input)
  return data
}

export async function softRemove(id: number): Promise<void> {
  await apiClient.delete(`/personas/${id}`)
}

export async function restore(id: number): Promise<void> {
  await apiClient.post(`/personas/${id}/restore`)
}
