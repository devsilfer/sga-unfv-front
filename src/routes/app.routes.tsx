import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import LoginPage from '@/pages/auth/LoginPage'
import DashboardPage from '@/pages/admin/dashboard/DashboardPage'
import ProtectedRoute from './ProtectedRoute'

import Personas from '@/pages/admin/seguridad/Personas/Personas'
import Usuarios from '@/pages/admin/seguridad/Usuarios/Usuarios'
import Admins from '@/pages/admin/seguridad/Admins/Admins'
import Cargos from '@/pages/admin/seguridad/Cargos/Cargos'
import Modulos from '@/pages/admin/seguridad/Modulos/Modulos'
import Permisos from '@/pages/admin/seguridad/Permisos/Permisos'

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
          <Route path="/seguridad/personas" element={<Personas />} />
          <Route path="/seguridad/usuarios" element={<Usuarios />} />
          <Route path="/seguridad/admins" element={<Admins />} />
          <Route path="/seguridad/cargos" element={<Cargos />} />
          <Route path="/seguridad/modulos" element={<Modulos />} />
          <Route path="/seguridad/permisos" element={<Permisos />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
