import apiClient from '@/api/client'
import type { Admin } from './types'
import type { PaginatedResponse } from '@/types/pagination.types'

type CreateAdminInput = Pick<Admin, 'usuarioId' | 'cargoId' | 'codigo' | 'correo'> & { esActivo?: number }
type UpdateAdminInput = Partial<CreateAdminInput>

export async function findAll(): Promise<Admin[]>
export async function findAll(page: number, limit?: number): Promise<PaginatedResponse<Admin>>
export async function findAll(page?: number, limit?: number): Promise<Admin[] | PaginatedResponse<Admin>> {
  const params: Record<string, number> = {}
  if (page) { params.page = page; params.limit = limit || 10 }
  const { data } = await apiClient.get('/admins', { params })
  if (page) return data as PaginatedResponse<Admin>
  return Array.isArray(data) ? data : (data as PaginatedResponse<Admin>).data
}

export async function findOne(id: number): Promise<Admin> {
  const { data } = await apiClient.get<Admin>(`/admins/${id}`)
  return data
}

export async function create(input: CreateAdminInput): Promise<Admin> {
  const { data } = await apiClient.post<Admin>('/admins', input)
  return data
}

export async function update(id: number, input: UpdateAdminInput): Promise<Admin> {
  const { data } = await apiClient.patch<Admin>(`/admins/${id}`, input)
  return data
}

export async function softRemove(id: number): Promise<void> {
  await apiClient.delete(`/admins/${id}`)
}
