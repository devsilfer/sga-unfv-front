import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import LoginPage from '@/features/auth/pages/LoginPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import ProtectedRoute from './ProtectedRoute'

import PersonasPage from '@/features/seguridad/pages/PersonasPage'
import UsuariosPage from '@/features/seguridad/pages/UsuariosPage'
import AdminsPage from '@/features/seguridad/pages/AdminsPage'
import CargosPage from '@/features/seguridad/pages/CargosPage'
import ModulosPage from '@/features/seguridad/pages/ModulosPage'
import PermisosPage from '@/features/seguridad/pages/PermisosPage'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Seguridad */}
          <Route path="/seguridad/personas" element={<PersonasPage />} />
          <Route path="/seguridad/usuarios" element={<UsuariosPage />} />
          <Route path="/seguridad/admins" element={<AdminsPage />} />
          <Route path="/seguridad/cargos" element={<CargosPage />} />
          <Route path="/seguridad/modulos" element={<ModulosPage />} />
          <Route path="/seguridad/permisos" element={<PermisosPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
