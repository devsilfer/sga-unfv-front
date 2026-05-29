import RoleProtectedRoute from './RoleProtectedRoute'

export const docenteRoutes = {
  path: 'docente',
  element: <RoleProtectedRoute allowedRoles={['docente']} />,
  children: [
    { index: true, element: <div className="p-6"><h1 className="text-2xl font-bold">Docente - Inicio</h1></div> },
  ],
}
