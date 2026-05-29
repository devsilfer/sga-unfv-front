import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import type { UserRole } from '@/types/auth.types'

type Props = {
  allowedRoles: UserRole[]
}

export default function RoleProtectedRoute({ allowedRoles }: Props) {
  const location = useLocation()
  const { activeRole } = useAuthStore()

  const hasAccess = activeRole !== null && allowedRoles.includes(activeRole)

  if (!hasAccess) {
    return <Navigate to='/' state={{ from: location }} replace />
  }

  return <Outlet />
}
