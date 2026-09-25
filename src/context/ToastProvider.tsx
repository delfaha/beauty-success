import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { ToastContext, type Toast, type ToastContextValue } from './ToastContext'

const MAX_TOASTS = 3

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback<ToastContextValue['push']>((toast) => {
    const id = nextId.current++
    setToasts((current) => [...current, { ...toast, id }].slice(-MAX_TOASTS))
    return id
  }, [])

  const value = useMemo(() => ({ toasts, push, dismiss }), [toasts, push, dismiss])

  return <ToastContext value={value}>{children}</ToastContext>
}
