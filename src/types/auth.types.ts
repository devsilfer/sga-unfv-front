export interface LoginRequest {
  numeroDocumento: string
  contrasenia: string
}

export interface User {
  id: number
  correo: string
  nombres: string
  avatarUrl: string | null
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}
