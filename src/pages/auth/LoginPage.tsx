import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { LogIn } from 'lucide-react'
import ReCAPTCHA from 'react-google-recaptcha'
import { toast } from 'sonner'
import axios from 'axios'

export default function LoginPage() {
  const [numeroDocumento, setNumeroDocumento] = useState('')
  const [contrasenia, setContrasenia] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''

  useEffect(() => {
    if (!siteKey) {
      console.warn('VITE_RECAPTCHA_SITE_KEY no está definida')
    }
  }, [siteKey])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (siteKey && !captchaToken) {
      toast.error('Por favor, completa el CAPTCHA para continuar.')
      return
    }

    setLoading(true)

    try {
      const payload = siteKey
        ? { numeroDocumento, contrasenia, captchaToken: captchaToken ?? undefined }
        : { numeroDocumento, contrasenia }

      await login(payload)
      navigate('/dashboard')
    } catch (err: unknown) {
      let msg = 'Error al iniciar sesión. Intenta nuevamente.'

      if (axios.isAxiosError(err)) {
        msg =
          (err.response?.data as { message?: string; error?: string })?.message ??
          (err.response?.data as { message?: string; error?: string })?.error ??
          err.message ??
          msg
      } else if (err instanceof Error) {
        msg = err.message
      }

      toast.error(msg)
    } finally {
      setLoading(false)
      recaptchaRef.current?.reset()
      setCaptchaToken(null)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-8 shadow-sm animate-scale-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">SGA UNFV</h1>
        <p className="mt-1 text-sm text-muted-foreground">Inicia sesión para continuar</p>
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
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Ingrese su contraseña"
          />
        </div>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {siteKey && (
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey={siteKey}
              onChange={(token: string | null) => setCaptchaToken(token)}
              ref={recaptchaRef}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all duration-200 active:scale-[0.98]"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  )
}
