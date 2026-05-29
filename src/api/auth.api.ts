import apiClient from './client'
import type { LoginRequest, ForgotPasswordRequest, ResetPasswordRequest, User } from '@/types/auth.types'

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

export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
  await apiClient.post('/auth/olvidar-contrasenia', data)
}

export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  await apiClient.post('/auth/restablecer-contrasenia', data)
}
