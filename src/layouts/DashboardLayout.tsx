import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useTheme } from '@/store/theme.store'
import { useAdminModulesStore } from '@/store/adminModules.store'
import { LogOut, Bell, ChevronRight, Home, Menu, Sun, Moon } from 'lucide-react'
import Sidebar, { MobileSidebar } from '@/components/Sidebar'

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/seguridad/personas': 'Personas',
  '/seguridad/usuarios': 'Usuarios',
  '/seguridad/admins': 'Admins',
  '/seguridad/cargos': 'Cargos',
  '/seguridad/modulos': 'Módulos',
  '/seguridad/permisos': 'Permisos',
}

const moduleGroupMap: Record<string, string> = {
  seguridad: 'Seguridad',
}

export default function DashboardLayout() {
  const { user, logout, activeRole } = useAuthStore()
  const { actualTheme, setTheme } = useTheme()
  const { fetchModules } = useAdminModulesStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    if (activeRole === 'admin') {
      fetchModules()
    }
  }, [activeRole, fetchModules])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const pathname = location.pathname
  const currentLabel = breadcrumbMap[pathname] || ''
  const moduleKey = pathname.split('/')[1]
  const moduleLabel = moduleKey ? moduleGroupMap[moduleKey] : ''

  const toggleTheme = () => {
    setTheme(actualTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <MobileSidebar open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground min-w-0">
              <Home className="h-4 w-4 shrink-0" />
              <span
                className="cursor-pointer hover:text-foreground transition-colors whitespace-nowrap"
                onClick={() => navigate('/dashboard')}
              >
                Inicio
              </span>
              {moduleLabel && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-muted-foreground font-medium truncate">{moduleLabel}</span>
                </>
              )}
              {currentLabel && currentLabel !== moduleLabel && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-foreground font-semibold truncate">{currentLabel}</span>
                </>
              )}
            </div>

            {!moduleLabel && (
              <span className="sm:hidden text-sm font-semibold text-foreground truncate">
                {currentLabel || 'SGA UNFV'}
              </span>
            )}
            {moduleLabel && (
              <span className="sm:hidden text-sm font-semibold text-foreground truncate">
                {currentLabel || moduleLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title={actualTheme === 'light' ? 'Modo oscuro' : 'Modo claro'}
            >
              {actualTheme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
            </button>

            <div className="flex items-center gap-3 border-l border-border pl-2 md:pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                {user?.nombres?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground leading-tight">
                  {user?.nombres || 'Usuario'}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {user?.correo || ''}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-2 md:px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-muted p-4 md:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
