import { create } from 'zustand'

type Theme = 'system' | 'light' | 'dark'

interface ThemeState {
  theme: Theme
  actualTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    return 'dark'
  return 'light'
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  localStorage.setItem('theme', theme)
}

const initial: Theme = (typeof localStorage !== 'undefined' ? (localStorage.getItem('theme') as Theme) : 'system') || 'system'
applyTheme(initial)

export const useTheme = create<ThemeState>((set) => ({
  theme: initial,
  actualTheme: initial === 'system' ? getSystemTheme() : initial,
  setTheme: (theme: Theme) => {
    applyTheme(theme)
    const actualTheme = theme === 'system' ? getSystemTheme() : theme
    set({ theme, actualTheme })
  },
}))
