import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

export default function RedirectByRole() {
  const { activeRole } = useAuthStore()

  if (activeRole === 'estudiante') return <Navigate to="/estudiante/inicio" />
  if (activeRole === 'docente') return <Navigate to="/docente/inicio" />
  if (activeRole === 'postulante') return <Navigate to="/postulante/inicio" />
  if (activeRole === 'admin') return <Navigate to="/dashboard" />

  return <Navigate to="/login" />
}
