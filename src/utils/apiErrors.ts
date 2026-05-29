import type { AxiosError } from 'axios'
import { showToastError, showToastValidationErrors } from './showToast'
import type { ApiResponse } from '@/shared/types/api'

export const handleApiError = (error: AxiosError) => {
  const { response } = error
  const status = response?.status

  if (status === 422) {
    const { message, errors } = response?.data as ApiResponse
    showToastValidationErrors(message, errors || [])
  }

  if (status === 404) {
    const { message } = response?.data as ApiResponse
    showToastError(message)
  }

  if (status === 409) {
    const { message } = response?.data as ApiResponse
    showToastError(message)
  }

  if (status === 500) {
    const { message, error: err } = response?.data as ApiResponse
    showToastError(message, err)
  }
}
