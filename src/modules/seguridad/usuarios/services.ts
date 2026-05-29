import apiClient from '@/api/client'
import type { Usuario } from './types'
import type { PaginatedResponse } from '@/types/pagination.types'

export async function findAll(): Promise<Usuario[]>
export async function findAll(page: number, limit?: number): Promise<PaginatedResponse<Usuario>>
export async function findAll(page?: number, limit?: number): Promise<Usuario[] | PaginatedResponse<Usuario>> {
  const params: Record<string, number> = {}
  if (page) { params.page = page; params.limit = limit || 10 }
  const { data } = await apiClient.get('/usuarios', { params })
  return data
}

export async function findOne(id: number): Promise<Usuario> {
  const { data } = await apiClient.get<Usuario>(`/usuarios/${id}`)
  return data
}

export async function create(input: { personaId: number; contrasenia: string }): Promise<Usuario> {
  const { data } = await apiClient.post<Usuario>('/usuarios', input)
  return data
}

export async function update(id: number, input: Partial<{ personaId: number; contrasenia: string }>): Promise<Usuario> {
  const { data } = await apiClient.patch<Usuario>(`/usuarios/${id}`, input)
  return data
}

export async function softRemove(id: number): Promise<void> {
  await apiClient.delete(`/usuarios/${id}`)
}
