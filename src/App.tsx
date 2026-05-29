import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { router } from '@/routes/app.routes'
import { useAuthStore } from '@/store/auth.store'

const queryClient = new QueryClient()

function AuthInit() {
  const fetchMe = useAuthStore((s) => s.fetchMe)

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInit />
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}
