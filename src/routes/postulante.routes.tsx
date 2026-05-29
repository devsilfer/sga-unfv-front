import RoleProtectedRoute from './RoleProtectedRoute'

export const postulanteRoutes = {
  path: 'postulante',
  element: <RoleProtectedRoute allowedRoles={['postulante']} />,
  children: [
    { index: true, element: <div className="p-6"><h1 className="text-2xl font-bold">Postulante - Inicio</h1></div> },
  ],
}
