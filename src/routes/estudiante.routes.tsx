import RoleProtectedRoute from './RoleProtectedRoute'

export const estudianteRoutes = {
  path: 'estudiante',
  element: <RoleProtectedRoute allowedRoles={['estudiante']} />,
  children: [
    { index: true, element: <div className="p-6"><h1 className="text-2xl font-bold">Estudiante - Inicio</h1></div> },
  ],
}
