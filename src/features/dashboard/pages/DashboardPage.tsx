import { Users, Briefcase, GraduationCap, DollarSign, FileText, ClipboardCheck } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'

const stats = [
  { label: 'Estudiantes', value: '2,456', icon: GraduationCap, color: 'bg-blue-500' },
  { label: 'Docentes', value: '189', icon: Users, color: 'bg-green-500' },
  { label: 'Cursos', value: '320', icon: Briefcase, color: 'bg-purple-500' },
  { label: 'Trámites', value: '45', icon: FileText, color: 'bg-orange-500' },
  { label: 'Pagos', value: 'S/ 128K', icon: DollarSign, color: 'bg-cyan-500' },
  { label: 'Matriculados', value: '1,892', icon: ClipboardCheck, color: 'bg-rose-500' },
]

const modules = [
  {
    title: 'Seguridad',
    description: 'Gestión de usuarios, roles y permisos del sistema',
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    count: '6 módulos',
  },
  {
    title: 'Admisión',
    description: 'Procesos de admisión, exámenes y postulantes',
    icon: GraduationCap,
    color: 'text-green-600',
    bg: 'bg-green-50',
    count: '6 módulos',
  },
  {
    title: 'Estructura Curricular',
    description: 'Programas, planes de estudio, cursos y ciclos',
    icon: ClipboardCheck,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    count: '4 módulos',
  },
  {
    title: 'Matrícula',
    description: 'Gestión de matrículas, horarios y periodos',
    icon: GraduationCap,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    count: '3 módulos',
  },
  {
    title: 'Tesorería',
    description: 'Pagos, conceptos y movimientos financieros',
    icon: DollarSign,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    count: '2 módulos',
  },
  {
    title: 'Mesa de Partes',
    description: 'Trámites documentarios y seguimiento',
    icon: FileText,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    count: '1 módulo',
  },
]

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {user?.nombres || 'Usuario'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Panel principal del Sistema de Gestión Académica
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg ${stat.color} p-2.5`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Módulos del Sistema</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod, i) => (
            <div
              key={mod.title}
              className="rounded-xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-lg ${mod.bg} p-3`}>
                  <mod.icon className={`h-6 w-6 ${mod.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{mod.title}</h3>
                  <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">{mod.description}</p>
                  <span className="mt-2 inline-block text-xs font-medium text-gray-400">{mod.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
