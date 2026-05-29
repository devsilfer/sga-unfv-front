export type UserRole = 'admin' | 'docente' | 'estudiante' | 'postulante'

export interface LoginRequest {
  numeroDocumento: string
  contrasenia: string
  captchaToken?: string
}

export interface User {
  id: number
  correo: string
  nombres: string
  avatarUrl: string | null
  roles: UserRole[]
  cargo?: { codigo: string; nombre: string }
  modulos?: Array<{
    codigo: string
    nombre: string
    permisos: { crear: boolean; leer: boolean; actualizar: boolean; eliminar: boolean }
  }>
}

export interface ForgotPasswordRequest {
  correo: string
}

export interface ResetPasswordRequest {
  token: string
  nuevaContrasenia: string
}
