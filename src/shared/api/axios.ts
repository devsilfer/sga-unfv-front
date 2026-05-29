import axios from 'axios'
import { redirectTo } from '@/utils/navigation'
import { useAuthStore } from '@/store/auth.store'
import { API_URL } from '@/lib/constants'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

let isRefreshing = false
let refreshQueue: Array<(ok: boolean) => void> = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error)
    }

    const url = String(originalRequest?.url || '')
    const isAuthEndpoint =
      url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/logout')

    if (isAuthEndpoint) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      return Promise.reject(error)
    }
    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((ok) => {
          if (ok) resolve(api(originalRequest))
          else reject(error)
        })
      })
    }

    isRefreshing = true

    try {
      await api.post('/auth/refresh', {})

      refreshQueue.forEach((cb) => cb(true))
      refreshQueue = []

      return api(originalRequest)
    } catch (err) {
      refreshQueue.forEach((cb) => cb(false))
      refreshQueue = []

      try {
        await useAuthStore.getState().logout()
      } catch (e) {
        console.warn('Logout local falló:', e)
      }

      redirectTo('login')
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
