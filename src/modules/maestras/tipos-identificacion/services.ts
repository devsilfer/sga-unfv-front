import apiClient from '@/api/client'
import type { ComboOption } from '@/types/combo.types'

export async function findCombo(): Promise<ComboOption[]> {
  const { data } = await apiClient.get<ComboOption[]>('/tipos-identificacion/combo')
  return data
}
