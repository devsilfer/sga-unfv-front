export const API_URL = import.meta.env.VITE_API_URL || '/api'

export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'] as const,
  },
}

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SEGURIDAD: {
    PERSONAS: '/seguridad/personas',
    USUARIOS: '/seguridad/usuarios',
    ADMINS: '/seguridad/admins',
    CARGOS: '/seguridad/cargos',
    MODULOS: '/seguridad/modulos',
    PERMISOS: '/seguridad/permisos',
  },
  ADMISION: {
    INDEX: '/admision',
    PROCESOS: '/admision/procesos',
    EXAMENES: '/admision/examenes',
    POSTULANTES: '/admision/postulantes',
    PREGUNTAS: '/admision/preguntas',
    MODALIDADES: '/admision/modalidades',
    AMBIENTES: '/admision/ambientes',
  },
  ESTRUCTURA_CURRICULAR: {
    INDEX: '/est-curricular',
    PROGRAMAS: '/est-curricular/programas',
    PLANES: '/est-curricular/planes',
    CURSOS: '/est-curricular/cursos',
    CICLOS: '/est-curricular/ciclos',
  },
  ESTRUCTURA_INSTITUCIONAL: {
    INDEX: '/est-institucional',
    FACULTADES: '/est-institucional/facultades',
    ESCUELAS: '/est-institucional/escuelas',
    AULAS: '/est-institucional/aulas',
  },
  GESTION_ACADEMICA: {
    INDEX: '/gestion-academica',
    NOTAS: '/gestion-academica/notas',
    CLASES: '/gestion-academica/clases',
    ASISTENCIA: '/gestion-academica/asistencia',
  },
  DOCENTE: {
    INDEX: '/docente',
    DOCENTES: '/docente/docentes',
    ACTIVIDADES: '/docente/actividades',
    CARGA: '/docente/carga',
  },
  MATRICULA: {
    INDEX: '/matricula',
    ESTUDIANTES: '/matricula/estudiantes',
    HORARIOS: '/matricula/horarios',
    PERIODOS: '/matricula/periodos',
  },
  TESORERIA: {
    INDEX: '/tesoreria',
    PAGOS: '/tesoreria/pagos',
    CONCEPTOS: '/tesoreria/conceptos',
  },
  MESA_PARTES: {
    INDEX: '/mesa-partes',
    TRAMITES: '/mesa-partes/tramites',
  },
  TITULACION: {
    INDEX: '/titulacion',
    TRABAJOS: '/titulacion/trabajos',
    ETAPAS: '/titulacion/etapas',
  },
  BOLSA_LABORAL: {
    INDEX: '/bolsa-laboral',
    VACANTES: '/bolsa-laboral/vacantes',
    EMPRESAS: '/bolsa-laboral/empresas',
    POSTULACIONES: '/bolsa-laboral/postulaciones',
  },
  MAESTRAS: {
    INDEX: '/maestras',
    UBIGEOS: '/maestras/ubigeos',
    TIPOS_ID: '/maestras/tipos-identificacion',
  },
} as const
