import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Shield,
  Users,
  UserCog,
  ShieldCheck,
  Briefcase,
  Boxes,
  KeyRound,
  GraduationCap,
  BookOpen,
  Building2,
  ClipboardCheck,
  Presentation,
  ClipboardList,
  DollarSign,
  FileText,
  Award,
  Database,
  ChevronDown,
  ChevronRight,
  Clock,
  Calendar,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent } from '@/components/ui/sheet'

interface NavChild {
  label: string
  icon: LucideIcon
  path: string
}

type NavItem = {
  type: 'link'
  label: string
  icon: LucideIcon
  path: string
} | {
  type: 'group'
  label: string
  icon: LucideIcon
  children: NavChild[]
}

const navigation: NavItem[] = [
  { type: 'link', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  {
    type: 'group', label: 'Seguridad', icon: Shield,
    children: [
      { label: 'Personas', icon: Users, path: '/seguridad/personas' },
      { label: 'Usuarios', icon: UserCog, path: '/seguridad/usuarios' },
      { label: 'Admins', icon: ShieldCheck, path: '/seguridad/admins' },
      { label: 'Cargos', icon: Briefcase, path: '/seguridad/cargos' },
      { label: 'Módulos', icon: Boxes, path: '/seguridad/modulos' },
      { label: 'Permisos', icon: KeyRound, path: '/seguridad/permisos' },
    ],
  },
  {
    type: 'group', label: 'Admisión', icon: GraduationCap,
    children: [
      { label: 'Procesos', icon: ClipboardList, path: '/admision/procesos' },
      { label: 'Exámenes', icon: FileText, path: '/admision/examenes' },
      { label: 'Postulantes', icon: Users, path: '/admision/postulantes' },
      { label: 'Preguntas', icon: Boxes, path: '/admision/preguntas' },
      { label: 'Modalidades', icon: Briefcase, path: '/admision/modalidades' },
      { label: 'Ambientes', icon: Building2, path: '/admision/ambientes' },
    ],
  },
  {
    type: 'group', label: 'Estructura Curricular', icon: BookOpen,
    children: [
      { label: 'Programas', icon: BookOpen, path: '/est-curricular/programas' },
      { label: 'Planes', icon: FileText, path: '/est-curricular/planes' },
      { label: 'Cursos', icon: BookOpen, path: '/est-curricular/cursos' },
      { label: 'Ciclos', icon: Boxes, path: '/est-curricular/ciclos' },
    ],
  },
  {
    type: 'group', label: 'Estructura Institucional', icon: Building2,
    children: [
      { label: 'Facultades', icon: Building2, path: '/est-institucional/facultades' },
      { label: 'Escuelas', icon: GraduationCap, path: '/est-institucional/escuelas' },
      { label: 'Aulas', icon: Presentation, path: '/est-institucional/aulas' },
    ],
  },
  {
    type: 'group', label: 'Gestión Académica', icon: ClipboardCheck,
    children: [
      { label: 'Notas', icon: ClipboardCheck, path: '/gestion-academica/notas' },
      { label: 'Clases', icon: Presentation, path: '/gestion-academica/clases' },
      { label: 'Asistencia', icon: ClipboardList, path: '/gestion-academica/asistencia' },
    ],
  },
  {
    type: 'group', label: 'Docente', icon: Presentation,
    children: [
      { label: 'Docentes', icon: Users, path: '/docente/docentes' },
      { label: 'Actividades', icon: ClipboardList, path: '/docente/actividades' },
      { label: 'Carga', icon: Briefcase, path: '/docente/carga' },
    ],
  },
  {
    type: 'group', label: 'Matrícula', icon: ClipboardList,
    children: [
      { label: 'Estudiantes', icon: Users, path: '/matricula/estudiantes' },
      { label: 'Horarios', icon: Clock, path: '/matricula/horarios' },
      { label: 'Periodos', icon: Calendar, path: '/matricula/periodos' },
    ],
  },
  {
    type: 'group', label: 'Tesorería', icon: DollarSign,
    children: [
      { label: 'Pagos', icon: DollarSign, path: '/tesoreria/pagos' },
      { label: 'Conceptos', icon: FileText, path: '/tesoreria/conceptos' },
    ],
  },
  {
    type: 'group', label: 'Mesa de Partes', icon: FileText,
    children: [
      { label: 'Trámites', icon: FileText, path: '/mesa-partes/tramites' },
    ],
  },
  {
    type: 'group', label: 'Titulación', icon: Award,
    children: [
      { label: 'Trabajos', icon: FileText, path: '/titulacion/trabajos' },
      { label: 'Etapas', icon: Boxes, path: '/titulacion/etapas' },
    ],
  },
  {
    type: 'group', label: 'Bolsa Laboral', icon: Briefcase,
    children: [
      { label: 'Vacantes', icon: Briefcase, path: '/bolsa-laboral/vacantes' },
      { label: 'Empresas', icon: Building2, path: '/bolsa-laboral/empresas' },
      { label: 'Postulaciones', icon: Users, path: '/bolsa-laboral/postulaciones' },
    ],
  },
  {
    type: 'group', label: 'Maestras', icon: Database,
    children: [
      { label: 'Ubigeos', icon: Database, path: '/maestras/ubigeos' },
      { label: 'Tipos Identificación', icon: KeyRound, path: '/maestras/tipos-identificacion' },
    ],
  },
]

function NavLink({ icon: Icon, label, active, onClick }: {
  icon: LucideIcon
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white',
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  )
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const path = location.pathname
    const set = new Set<string>()
    navigation.forEach((item) => {
      if (item.type === 'group') {
        const isActive = item.children.some((c) => path.startsWith(c.path))
        if (isActive) set.add(item.label)
      }
    })
    return set
  })

  function toggleGroup(label: string) {
    setExpandedGroups((prev) => {
      if (prev.has(label)) {
        const next = new Set(prev)
        next.delete(label)
        return next
      }
      return new Set([label])
    })
  }

  function handleNavigate(path: string) {
    navigate(path)
    onNavigate?.()
  }

  const pathname = location.pathname

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-gray-700">
      <div className="space-y-1">
        {navigation.map((item) => {
          if (item.type === 'link') {
            const active = pathname === item.path
            return (
              <NavLink
                key={item.path}
                icon={item.icon}
                label={item.label}
                active={active}
                onClick={() => handleNavigate(item.path)}
              />
            )
          }

          const isExpanded = expandedGroups.has(item.label)
          const groupActive = item.children.some((c) => pathname.startsWith(c.path))

          return (
            <div key={item.label} className="py-0.5">
              <button
                onClick={() => toggleGroup(item.label)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  groupActive
                    ? 'text-blue-400'
                    : 'text-gray-300 hover:text-white',
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left truncate">{item.label}</span>
                {isExpanded
                  ? <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                  : <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                }
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-gray-800 pl-2">
                  {item.children.map((child) => {
                    const active = pathname === child.path
                    return (
                      <button
                        key={child.path}
                        onClick={() => handleNavigate(child.path)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors animate-fade-in',
                          active
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200',
                        )}
                      >
                        <child.icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{child.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </nav>
  )
}

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-gray-950 text-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-6">
        <GraduationCap className="h-6 w-6 text-blue-400" />
        <span className="text-lg font-bold tracking-tight">SGA UNFV</span>
      </div>
      <SidebarContent />
      <div className="border-t border-gray-800 px-4 py-3">
        <p className="text-xs text-gray-500">Sistema de Gestión Académica</p>
      </div>
    </aside>
  )
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <SheetContent side="left" className="w-64 bg-gray-950 text-white p-0 border-r-gray-800">
        <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-6">
          <GraduationCap className="h-6 w-6 text-blue-400" />
          <span className="text-lg font-bold tracking-tight">SGA UNFV</span>
        </div>
        <SidebarContent onNavigate={onClose} />
        <div className="border-t border-gray-800 px-4 py-3">
          <p className="text-xs text-gray-500">Sistema de Gestión Académica</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
