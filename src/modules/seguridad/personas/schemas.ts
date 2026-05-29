import { z } from 'zod'

export const personaSchema = z.object({
  numeroDocumento: z.string().min(8, 'Mínimo 8 caracteres').max(20, 'Máximo 20 caracteres'),
  nombres: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  apellidoPaterno: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  apellidoMaterno: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  correo: z.string().email('Correo inválido'),
  telefono: z.string().max(20, 'Máximo 20 caracteres').optional().or(z.literal('')),
  fechaNacimiento: z.string().optional().or(z.literal('')),
  genero: z.string().optional().or(z.literal('')),
  direccion: z.string().max(200, 'Máximo 200 caracteres').optional().or(z.literal('')),
})

export type PersonaFormValues = z.infer<typeof personaSchema>
