import type { LucideIcon } from 'lucide-react'
import {
  Shield, GraduationCap, BookOpen, Building2, ClipboardCheck,
  Presentation, ClipboardList, DollarSign, FileText, Award, Briefcase, Database,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  seguridad: Shield,
  admision: GraduationCap,
  'est-curricular': BookOpen,
  'est-institucional': Building2,
  'gestion-academica': ClipboardCheck,
  docente: Presentation,
  matricula: ClipboardList,
  tesoreria: DollarSign,
  'mesa-partes': FileText,
  titulacion: Award,
  'bolsa-laboral': Briefcase,
  maestras: Database,
}

const labelMap: Record<string, string> = {
  seguridad: 'Seguridad',
  admision: 'Admisión',
  'est-curricular': 'Estructura Curricular',
  'est-institucional': 'Estructura Institucional',
  'gestion-academica': 'Gestión Académica',
  docente: 'Docente',
  matricula: 'Matrícula',
  tesoreria: 'Tesorería',
  'mesa-partes': 'Mesa de Partes',
  titulacion: 'Titulación',
  'bolsa-laboral': 'Bolsa Laboral',
  maestras: 'Maestras',
}

export default function PagePlaceholder({ module }: { module: string }) {
  const Icon = iconMap[module] || Shield
  const label = labelMap[module] || module

  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400 animate-fade-in">
      <div className="rounded-xl bg-gray-100 p-6 transition-transform duration-300 hover:scale-105">
        <Icon className="h-16 w-16 text-gray-300" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-gray-600">{label}</h2>
      <p className="mt-2 text-sm text-gray-400">
        Módulo en desarrollo — Próximamente disponible
      </p>
    </div>
  )
}
