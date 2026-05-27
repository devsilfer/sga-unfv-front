import apiClient from './client'
import type { LoginRequest, User } from '@/types/auth.types'

export async function login(data: LoginRequest): Promise<void> {
  await apiClient.post('/auth/login', data)
}

export async function refreshTokens(): Promise<void> {
  await apiClient.post('/auth/refresh')
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me')
  return data
}
