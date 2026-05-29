import { useEffect, useRef } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/store/auth.store"
import type { ReactNode } from "react"

interface Props { children: ReactNode }

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isLoading, checkAuth, activeRole } = useAuthStore()
  const hasChecked = useRef(false)
  const location = useLocation()

  useEffect(() => {
    if (hasChecked.current) return
    hasChecked.current = true
    if (isAuthenticated) return

    checkAuth()
  }, [checkAuth, isAuthenticated])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (isAuthenticated && location.pathname === "/login") {
    if (activeRole === 'docente') return <Navigate to="/docente/inicio" replace />
    if (activeRole === 'estudiante') return <Navigate to="/estudiante/inicio" replace />
    if (activeRole === 'postulante') return <Navigate to="/postulante/inicio" replace />
    return <Navigate to="/dashboard" replace />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
