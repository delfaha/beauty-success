import { createContext } from 'react'

export interface ToastInput {
  title: string
  eyebrow?: string
  description?: string
  /** Visuel produit (URL ou référence `art:`). */
  image?: string
  imageAlt?: string
  action?: { label: string; onClick?: () => void; to?: string }
  tone?: 'default' | 'error'
  duration?: number
}

export interface Toast extends ToastInput {
  id: number
}

export interface ToastContextValue {
  toasts: Toast[]
  push: (toast: ToastInput) => number
  dismiss: (id: number) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
