import type { TipoIdentificacion } from '@/modules/maestras/tipos-identificacion/types'
import type { Genero } from '@/modules/maestras/generos/types'
import type { Pais } from '@/modules/maestras/paises/types'
import type { Ubigeo } from '@/modules/maestras/ubigeos/types'

export interface Persona {
  id: number
  tipoIdentificacionId: number
  numeroDocumento: string
  correoPersonal: string
  nombres: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  fecNac?: string
  numCelular?: string
  avatarUrl?: string
  generoId: number
  ubigeoId?: string
  paisId?: number
  direccion?: string
  tipoIdentificacion?: TipoIdentificacion
  genero?: Genero
  ubigeo?: Ubigeo
  pais?: Pais
}
