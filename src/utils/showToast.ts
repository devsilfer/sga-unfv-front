import { toast } from 'sonner'

const DEFAULT_DELAY = 1000

export const showToastValidationErrors = (message: string, errors: []) => {
  let delay = 0
  Object.entries(errors).forEach(([key, value]) => {
    const messages = Array.isArray(value) ? value : [value]

    messages.forEach((msg) => {
      setTimeout(() => {
        toast.warning(message, {
          description: `${key}: ${msg}`,
        })
      }, delay)
      delay += DEFAULT_DELAY
    })
  })
}

export const showToastError = (message: string, error?: string) => {
  if (error) {
    toast.error(message, { description: error })
    return
  }
  toast.error(message)
}

export const showToastSuccess = (message: string) => {
  toast.success('Éxito', { description: message })
}

export const showToastWarning = (message: string) => {
  toast.warning(message)
}
