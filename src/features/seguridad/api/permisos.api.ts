import apiClient from '@/api/client'
import type { Permiso, CreatePermisoInput, UpdatePermisoInput } from '../types/permiso.types'
import type { PaginatedResponse } from '@/types/pagination.types'

export async function findAll(): Promise<Permiso[]>
export async function findAll(page: number, limit?: number): Promise<PaginatedResponse<Permiso>>
export async function findAll(page?: number, limit?: number): Promise<Permiso[] | PaginatedResponse<Permiso>> {
  const params: Record<string, number> = {}
  if (page) { params.page = page; params.limit = limit || 10 }
  const { data } = await apiClient.get('/permisos', { params })
  return data
}

export async function findOne(id: number): Promise<Permiso> {
  const { data } = await apiClient.get<Permiso>(`/permisos/${id}`)
  return data
}

export async function create(input: CreatePermisoInput): Promise<Permiso> {
  const { data } = await apiClient.post<Permiso>('/permisos', input)
  return data
}

export async function update(id: number, input: UpdatePermisoInput): Promise<Permiso> {
  const { data } = await apiClient.patch<Permiso>(`/permisos/${id}`, input)
  return data
}

export async function softRemove(id: number): Promise<void> {
  await apiClient.delete(`/permisos/${id}`)
}
