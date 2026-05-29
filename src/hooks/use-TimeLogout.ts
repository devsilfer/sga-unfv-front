import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'

const MAX_IDLE_MINUTES = 30

export const useTimeLogout = () => {
  const { logout } = useAuthStore()

  const [timeLeft, setTimeLeft] = useState(MAX_IDLE_MINUTES * 60)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)

    setTimeLeft(MAX_IDLE_MINUTES * 60)

    timeoutRef.current = setTimeout(() => {
      logout()
    }, MAX_IDLE_MINUTES * 60 * 1000)

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)
  }

  useEffect(() => {
    const events = ['mousedown', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => window.addEventListener(event, resetTimer))

    resetTimer()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
      events.forEach(event => window.removeEventListener(event, resetTimer))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { timeLeft }
}
