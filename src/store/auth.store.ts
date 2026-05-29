import { create } from 'zustand'
import type { User, UserRole, LoginRequest } from '@/types/auth.types'
import * as authApi from '@/api/auth.api'

interface AuthState {
  user: User | null
  roles: UserRole[]
  activeRole: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  checkAuth: () => Promise<void>
  setActiveRole: (role: UserRole) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  roles: [],
  activeRole: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (credentials) => {
    set({ isLoading: true })
    await authApi.login(credentials)
    const user = await authApi.getMe()
    const roles = user.roles || []
    const activeRole = roles[0] || null
    set({ user, roles, activeRole, isAuthenticated: true, isLoading: false })
  },

  logout: async () => {
    try {
      await authApi.logout()
    } finally {
      set({ user: null, roles: [], activeRole: null, isAuthenticated: false, isLoading: false })
    }
  },

  fetchMe: async () => {
    try {
      const user = await authApi.getMe()
      const roles = user.roles || []
      const activeRole = roles[0] || null
      set({ user, roles, activeRole, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, roles: [], activeRole: null, isAuthenticated: false, isLoading: false })
    }
  },

  checkAuth: async () => {
    const { isLoading } = get()
    if (!isLoading) set({ isLoading: true })
    try {
      const user = await authApi.getMe()
      const roles = user.roles || []
      const activeRole = roles[0] || null
      set({ user, roles, activeRole, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, roles: [], activeRole: null, isAuthenticated: false, isLoading: false })
    }
  },

  setActiveRole: (role) => set({ activeRole: role }),
}))
