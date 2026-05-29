import { useAdminModulesStore } from '@/store/adminModules.store'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

type Props = {
  moduleKey: string
}

export default function ModuleProtectedRoute({ moduleKey }: Props) {
  const { activeModules } = useAdminModulesStore()
  const { activeRole } = useAuthStore()
  const location = useLocation()

  const hasAccess = activeRole === 'admin' && activeModules.includes(moduleKey)

  if (!hasAccess) {
    return <Navigate to='/' state={{ from: location }} replace />
  }

  return <Outlet />
}
