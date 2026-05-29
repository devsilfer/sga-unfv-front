import { fetchMyAdminModules } from '@/shared/services/sharedServices'
import { create } from 'zustand'

interface AdminModuleState {
  activeModules: string[]
  isLoadedFromApi: boolean
  fetchModules: () => Promise<void>
}

const LOCAL_STORAGE_KEY = 'adminModules'

const getInitialModules = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error parsing admin modules from localStorage:', error)
    return []
  }
}

export const useAdminModulesStore = create<AdminModuleState>((set) => ({
  activeModules: getInitialModules(),
  isLoadedFromApi: false,
  fetchModules: async () => {
    try {
      const { myAdminModules } = await fetchMyAdminModules()
      const activeShortNames = myAdminModules.map(
        (module: { codigo: string }) => module.codigo.toLowerCase().replace(/_/g, '-')
      )
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activeShortNames))
      set({ activeModules: activeShortNames, isLoadedFromApi: true })
    } catch (error) {
      console.error('Error fetching admin modules:', error)
    }
  },
}))
