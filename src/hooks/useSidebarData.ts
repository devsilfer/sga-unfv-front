import { useMemo } from 'react'
import {
  Shield, GraduationCap, ClipboardList, Building2, BookOpen, Users,
  CreditCard, FileText, Award, Briefcase, Database, Clock, ClipboardCheck,
  BarChart3, Calendar, User, type LucideIcon,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useAdminModulesStore } from '@/store/adminModules.store'
import { ROUTES } from '@/lib/constants'

const MODULE_MAP: Record<string, { title: string; icon: LucideIcon; items: { title: string; url: string }[] }> = {
  seguridad: {
    title: 'Seguridad', icon: Shield,
    items: [
      { title: 'Personas', url: ROUTES.SEGURIDAD.PERSONAS },
      { title: 'Usuarios', url: ROUTES.SEGURIDAD.USUARIOS },
      { title: 'Admins', url: ROUTES.SEGURIDAD.ADMINS },
      { title: 'Cargos', url: ROUTES.SEGURIDAD.CARGOS },
      { title: 'Módulos', url: ROUTES.SEGURIDAD.MODULOS },
      { title: 'Permisos', url: ROUTES.SEGURIDAD.PERMISOS },
    ],
  },
  admision: {
    title: 'Admisión', icon: ClipboardList,
    items: [
      { title: 'Procesos', url: ROUTES.ADMISION.PROCESOS },
      { title: 'Exámenes', url: ROUTES.ADMISION.EXAMENES },
      { title: 'Postulantes', url: ROUTES.ADMISION.POSTULANTES },
      { title: 'Preguntas', url: ROUTES.ADMISION.PREGUNTAS },
      { title: 'Modalidades', url: ROUTES.ADMISION.MODALIDADES },
      { title: 'Ambientes', url: ROUTES.ADMISION.AMBIENTES },
    ],
  },
  'est-curricular': {
    title: 'Estructura Curricular', icon: BookOpen,
    items: [
      { title: 'Programas', url: ROUTES.ESTRUCTURA_CURRICULAR.PROGRAMAS },
      { title: 'Planes', url: ROUTES.ESTRUCTURA_CURRICULAR.PLANES },
      { title: 'Cursos', url: ROUTES.ESTRUCTURA_CURRICULAR.CURSOS },
      { title: 'Ciclos', url: ROUTES.ESTRUCTURA_CURRICULAR.CICLOS },
    ],
  },
  'est-institucional': {
    title: 'Estructura Institucional', icon: Building2,
    items: [
      { title: 'Facultades', url: ROUTES.ESTRUCTURA_INSTITUCIONAL.FACULTADES },
      { title: 'Escuelas', url: ROUTES.ESTRUCTURA_INSTITUCIONAL.ESCUELAS },
      { title: 'Aulas', url: ROUTES.ESTRUCTURA_INSTITUCIONAL.AULAS },
    ],
  },
  'gestion-academica': {
    title: 'Gestión Académica', icon: GraduationCap,
    items: [
      { title: 'Notas', url: ROUTES.GESTION_ACADEMICA.NOTAS },
      { title: 'Clases', url: ROUTES.GESTION_ACADEMICA.CLASES },
      { title: 'Asistencia', url: ROUTES.GESTION_ACADEMICA.ASISTENCIA },
    ],
  },
  docente: {
    title: 'Docente', icon: Users,
    items: [
      { title: 'Docentes', url: ROUTES.DOCENTE.DOCENTES },
      { title: 'Actividades', url: ROUTES.DOCENTE.ACTIVIDADES },
      { title: 'Carga', url: ROUTES.DOCENTE.CARGA },
    ],
  },
  matricula: {
    title: 'Matrícula', icon: ClipboardList,
    items: [
      { title: 'Estudiantes', url: ROUTES.MATRICULA.ESTUDIANTES },
      { title: 'Horarios', url: ROUTES.MATRICULA.HORARIOS },
      { title: 'Periodos', url: ROUTES.MATRICULA.PERIODOS },
    ],
  },
  tesoreria: {
    title: 'Tesorería', icon: CreditCard,
    items: [
      { title: 'Pagos', url: ROUTES.TESORERIA.PAGOS },
      { title: 'Conceptos', url: ROUTES.TESORERIA.CONCEPTOS },
    ],
  },
  'mesa-partes': {
    title: 'Mesa de Partes', icon: FileText,
    items: [{ title: 'Trámites', url: ROUTES.MESA_PARTES.TRAMITES }],
  },
  titulacion: {
    title: 'Titulación', icon: Award,
    items: [
      { title: 'Trabajos', url: ROUTES.TITULACION.TRABAJOS },
      { title: 'Etapas', url: ROUTES.TITULACION.ETAPAS },
    ],
  },
  'bolsa-laboral': {
    title: 'Bolsa Laboral', icon: Briefcase,
    items: [
      { title: 'Vacantes', url: ROUTES.BOLSA_LABORAL.VACANTES },
      { title: 'Empresas', url: ROUTES.BOLSA_LABORAL.EMPRESAS },
      { title: 'Postulaciones', url: ROUTES.BOLSA_LABORAL.POSTULACIONES },
    ],
  },
  maestras: {
    title: 'Maestras', icon: Database,
    items: [
      { title: 'Ubigeos', url: ROUTES.MAESTRAS.UBIGEOS },
      { title: 'Tipos ID', url: ROUTES.MAESTRAS.TIPOS_ID },
    ],
  },
}

const DOCENTE_NAV = [
  { title: 'Inicio', url: '/docente/inicio', icon: GraduationCap },
  { title: 'Horarios', url: '/docente/horarios', icon: Clock },
  { title: 'Materiales y Recursos', url: '/docente/materiales-recursos', icon: BookOpen },
  { title: 'Asistencias', url: '/docente/asistencias', icon: ClipboardCheck },
  { title: 'Reporte de Asistencias', url: '/docente/reporte-asistencias', icon: BarChart3 },
  { title: 'Reprogramación', url: '/docente/reprogramacion', icon: Calendar },
  {
    title: 'Evaluaciones', icon: ClipboardList,
    items: [
      { title: 'Tipos de Evaluaciones', url: '/docente/evaluaciones/tipos' },
      { title: 'Calificaciones', url: '/docente/evaluaciones/calificaciones-estudiantes' },
      { title: 'Promedios', url: '/docente/evaluaciones/promedios-estudiantes' },
    ],
  },
  {
    title: 'Tesis', icon: Award,
    items: [
      { title: 'Investigaciones', url: '/docente/tesis/investigaciones' },
      { title: 'Plan de Tesis', url: '/docente/tesis/plan-de-tesis' },
      { title: 'Tesis', url: '/docente/tesis/tesis' },
      { title: 'Sustentaciones', url: '/docente/tesis/sustentaciones' },
    ],
  },
]

const ESTUDIANTE_NAV = [
  { title: 'Inicio', url: '/estudiante/inicio', icon: GraduationCap },
  { title: 'Mis Horarios', url: '/estudiante/horarios', icon: Clock },
  { title: 'Malla Curricular', url: '/estudiante/malla-curricular', icon: BookOpen },
  { title: 'Materiales', url: '/estudiante/materiales', icon: FileText },
  { title: 'Mis Asistencias', url: '/estudiante/asistencias', icon: ClipboardCheck },
  { title: 'Mis Notas', url: '/estudiante/notas', icon: BarChart3 },
  { title: 'Matrícula', url: '/estudiante/matricula', icon: ClipboardList },
  { title: 'Pagos', url: '/estudiante/pagos-niubis', icon: CreditCard },
  {
    title: 'Tesis', icon: Award,
    items: [
      { title: 'Investigaciones', url: '/estudiante/tesis/investigaciones' },
      { title: 'Plan de Tesis', url: '/estudiante/tesis/plan-de-tesis' },
      { title: 'Tesis', url: '/estudiante/tesis/tesis' },
      { title: 'Sustentaciones', url: '/estudiante/tesis/sustentaciones' },
      { title: 'Documentos', url: '/estudiante/tesis/documentos' },
    ],
  },
]

const POSTULANTE_NAV = [
  { title: 'Bienvenido', url: '/postulante/bienvenido', icon: ClipboardList },
  { title: 'Documentos de Admisión', url: '/postulante/documentos-admisión', icon: FileText },
  { title: 'Mi Perfil', url: '/postulante/perfil-usuario', icon: User },
]

export function useSidebarData() {
  const { user, activeRole } = useAuthStore()
  const { activeModules } = useAdminModulesStore()

  const sidebarData = useMemo(() => {
    let navMain: { title: string; url?: string; icon: LucideIcon; items?: { title: string; url: string }[] }[] = []

    if (activeRole === 'admin') {
      navMain = activeModules
        .map((key) => MODULE_MAP[key])
        .filter(Boolean)
        .map((mod) => ({
          title: mod.title,
          url: mod.items[0]?.url || '#',
          icon: mod.icon,
          items: mod.items,
        }))
      navMain.unshift({
        title: 'Dashboard',
        url: '/dashboard',
        icon: GraduationCap,
      })
    } else if (activeRole === 'docente') {
      navMain = DOCENTE_NAV
    } else if (activeRole === 'estudiante') {
      navMain = ESTUDIANTE_NAV
    } else if (activeRole === 'postulante') {
      navMain = POSTULANTE_NAV
    }

    return {
      navMain,
      user: {
        name: user?.nombres || 'Usuario',
        email: user?.correo || '',
        avatar: user?.avatarUrl || '',
      },
    }
  }, [activeRole, activeModules, user])

  return { sidebarData }
}
