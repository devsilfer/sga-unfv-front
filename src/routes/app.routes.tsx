import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import LoginPage from '@/pages/auth/LoginPage'
import DashboardPage from '@/pages/admin/dashboard/DashboardPage'
import ProtectedRoute from './ProtectedRoute'

import PersonasPage from '@/pages/admin/seguridad/Personas/PersonasPage'
import UsuariosPage from '@/pages/admin/seguridad/Usuarios/UsuariosPage'
import AdminsPage from '@/pages/admin/seguridad/Admins/AdminsPage'
import CargosPage from '@/pages/admin/seguridad/Cargos/CargosPage'
import ModulosPage from '@/pages/admin/seguridad/Modulos/ModulosPage'
import PermisosPage from '@/pages/admin/seguridad/Permisos/PermisosPage'

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
