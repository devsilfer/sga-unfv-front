import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import AppRouter from '@/routes/app.routes'
import { useAuthStore } from '@/store/auth.store'
import LoadingBar from '@/components/LoadingBar'

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
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthInit />
        <LoadingBar />
        <AppRouter />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </BrowserRouter>
  )
}
