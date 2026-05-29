import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'
import { withSuspense } from '@/utils/withSuspense'
import { appPath } from '@/utils/publicPath'
import { addRedirectByRoleToTree } from './common.routes'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'
import RoleProtectedRoute from './RoleProtectedRoute'
import ModuleProtectedRoute from './ModuleProtectedRoute'
import DashboardLayout from '@/layouts/DashboardLayout'
import { docenteRoutes } from './docente.routes'
import { estudianteRoutes } from './estudiante.routes'
import { postulanteRoutes } from './postulante.routes'
import PlaceholderModule from '@/components/PlaceholderModule'
import LoginPage from '@/pages/auth/LoginPage'

export const router = createBrowserRouter(
  addRedirectByRoleToTree([
    {
      path: '/login',
      element: (
        <PublicOnlyRoute>
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <LoginPage />
          </div>
        </PublicOnlyRoute>
      ),
    },

    {
      path: '/forgot-password',
      element: (
        <PublicOnlyRoute>
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            {withSuspense(lazy(() => import('@/pages/auth/ForgotPasswordPage')))}
          </div>
        </PublicOnlyRoute>
      ),
    },

    {
      path: '/reset-password',
      element: (
        <PublicOnlyRoute>
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            {withSuspense(lazy(() => import('@/pages/auth/ResetPasswordPage')))}
          </div>
        </PublicOnlyRoute>
      ),
    },

    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        docenteRoutes,
        estudianteRoutes,
        postulanteRoutes,

        // Modulo Dashboard
        {
          path: 'dashboard',
          element: <RoleProtectedRoute allowedRoles={['admin']} />,
          children: [
            { index: true, element: withSuspense(lazy(() => import('@/pages/admin/dashboard/DashboardPage'))) },
          ],
        },

        // Modulo Seguridad
        {
          path: 'seguridad',
          element: <ModuleProtectedRoute moduleKey="seguridad" />,
          children: [
            { path: 'personas', element: withSuspense(lazy(() => import('@/pages/admin/seguridad/Personas/Personas'))) },
            { path: 'usuarios', element: withSuspense(lazy(() => import('@/pages/admin/seguridad/Usuarios/Usuarios'))) },
            { path: 'admins', element: withSuspense(lazy(() => import('@/pages/admin/seguridad/Admins/Admins'))) },
            { path: 'cargos', element: withSuspense(lazy(() => import('@/pages/admin/seguridad/Cargos/Cargos'))) },
            { path: 'modulos', element: withSuspense(lazy(() => import('@/pages/admin/seguridad/Modulos/Modulos'))) },
            { path: 'permisos', element: withSuspense(lazy(() => import('@/pages/admin/seguridad/Permisos/Permisos'))) },
          ],
        },

        // Modulo Admision
        {
          path: 'admision',
          element: <ModuleProtectedRoute moduleKey="admision" />,
          children: [
            { path: 'procesos', element: <PlaceholderModule moduleName="Admisión - Procesos" /> },
            { path: 'examenes', element: <PlaceholderModule moduleName="Admisión - Exámenes" /> },
            { path: 'postulantes', element: <PlaceholderModule moduleName="Admisión - Postulantes" /> },
            { path: 'preguntas', element: <PlaceholderModule moduleName="Admisión - Preguntas" /> },
            { path: 'modalidades', element: <PlaceholderModule moduleName="Admisión - Modalidades" /> },
            { path: 'ambientes', element: <PlaceholderModule moduleName="Admisión - Ambientes" /> },
          ],
        },

        // Modulo Matricula
        {
          path: 'matricula',
          element: <ModuleProtectedRoute moduleKey="matricula" />,
          children: [
            { path: 'estudiantes', element: <PlaceholderModule moduleName="Matrícula - Estudiantes" /> },
            { path: 'horarios', element: <PlaceholderModule moduleName="Matrícula - Horarios" /> },
            { path: 'periodos', element: <PlaceholderModule moduleName="Matrícula - Periodos" /> },
          ],
        },
      ],
    },
  ]), {
  basename: appPath('/'),
})
