import api from '../api/axios'

export const fetchMyAdminModules = async () => {
  const { data } = await api.get('/auth/me')
  return { myAdminModules: data.modulos ?? [] }
}
