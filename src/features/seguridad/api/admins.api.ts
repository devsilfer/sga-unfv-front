import apiClient from '@/api/client'
import type { Admin, CreateAdminInput, UpdateAdminInput } from '../types/admin.types'
import type { PaginatedResponse } from '@/types/pagination.types'

export async function findAll(): Promise<Admin[]>
export async function findAll(page: number, limit?: number): Promise<PaginatedResponse<Admin>>
export async function findAll(page?: number, limit?: number): Promise<Admin[] | PaginatedResponse<Admin>> {
  const params: Record<string, number> = {}
  if (page) { params.page = page; params.limit = limit || 10 }
  const { data } = await apiClient.get('/admins', { params })
  return data
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
