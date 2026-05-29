import { create } from 'zustand'
import type { User, LoginRequest } from '@/types/auth.types'
import * as authApi from '@/api/auth.api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (credentials) => {
    set({ isLoading: true })
    await authApi.login(credentials)
    const user = await authApi.getMe()
    set({ user, isAuthenticated: true, isLoading: false })
  },

  logout: async () => {
    try {
      await authApi.logout()
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  fetchMe: async () => {
    try {
      const user = await authApi.getMe()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}))
