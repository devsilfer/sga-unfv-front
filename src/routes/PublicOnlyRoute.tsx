import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import type { ReactNode } from 'react'

interface PublicOnlyRouteProps { children: ReactNode }

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}
