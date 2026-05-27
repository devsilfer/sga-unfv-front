import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const [numeroDocumento, setNumeroDocumento] = useState('')
  const [contrasenia, setContrasenia] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ numeroDocumento, contrasenia })
      navigate('/dashboard')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        setError(axiosErr.response?.data?.message || 'Credenciales inválidas')
      } else {
        setError('Error de conexión con el servidor')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6 rounded-lg border bg-white p-8 shadow-sm animate-scale-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold">SGA UNFV</h1>
        <p className="mt-1 text-sm text-gray-500">Inicia sesión para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="numeroDocumento" className="text-sm font-medium">
            N° Documento
          </label>
          <input
            id="numeroDocumento"
            type="text"
            value={numeroDocumento}
            onChange={(e) => setNumeroDocumento(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Ingrese su documento"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="contrasenia" className="text-sm font-medium">
            Contraseña
          </label>
          <input
            id="contrasenia"
            type="password"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Ingrese su contraseña"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-all duration-200 active:scale-[0.98]"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  )
}
