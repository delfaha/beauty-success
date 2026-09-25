import { ArrowRight, CircleAlert, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import { ProductImage } from '@/components/product/ProductImage'
import type { Toast } from '@/context/ToastContext'
import { useToast } from '@/hooks/useStore'
import { cn } from '@/utils/cn'

/** Notifications éphémères (ajout au panier, favoris…) annoncées aux lecteurs d'écran. */
export function Toaster() {
  const { toasts, dismiss } = useToast()
  return createPortal(
    <section
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[95] flex justify-center p-3 sm:justify-end sm:p-6"
      style={{ paddingBottom: 'calc(0.75rem + var(--sticky-offset, 0px))' }}
    >
      <ol aria-live="polite" className="flex w-full max-w-sm flex-col gap-2.5">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </ol>
    </section>,
    document.body,
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = useState(false)
  const duration = toast.duration ?? 4500
  const remaining = useRef(duration)
  const error = toast.tone === 'error'

  useEffect(() => {
    if (paused) return
    const startedAt = Date.now()
    const timer = window.setTimeout(() => onDismiss(toast.id), remaining.current)
    return () => {
      window.clearTimeout(timer)
      remaining.current -= Date.now() - startedAt
    }
  }, [paused, onDismiss, toast.id])

  const close = () => onDismiss(toast.id)
  const actionClass = 'group mt-2 inline-flex items-center gap-2 label-caps font-semibold'

  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- pause du minuteur au survol/focus (WCAG 2.2.1)
    <li
      className={cn(
        'toast pointer-events-auto relative flex gap-4 overflow-hidden border border-ink p-3 pr-10',
        error ? 'bg-ink text-bone' : 'bg-bone text-ink',
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {toast.image ? (
        <div className="h-20 w-16 shrink-0 overflow-hidden bg-sand">
          <ProductImage src={toast.image} alt={toast.imageAlt ?? ''} />
        </div>
      ) : (
        error && <CircleAlert className="mt-0.5 size-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      )}
      <div className="min-w-0 flex-1 py-0.5">
        {toast.eyebrow && <p className="label-caps text-current/70">{toast.eyebrow}</p>}
        <p className="font-extrabold leading-tight">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-body-sm opacity-75">{toast.description}</p>}
        {toast.action &&
          (toast.action.to ? (
            <Link to={toast.action.to} className={actionClass} onClick={close}>
              <span className="link-underline">{toast.action.label}</span>
              <ArrowRight className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              className={actionClass}
              onClick={() => {
                toast.action?.onClick?.()
                close()
              }}
            >
              <span className="link-underline">{toast.action.label}</span>
              <ArrowRight className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
            </button>
          ))}
      </div>
      <button type="button" onClick={close} className="absolute right-2 top-2 grid size-7 place-items-center" aria-label="Fermer la notification">
        <X className="size-4" strokeWidth={1.5} />
      </button>
      <span
        aria-hidden="true"
        className={cn('toast-progress absolute inset-x-0 bottom-0 h-0.5', error ? 'bg-bone' : 'bg-ink')}
        style={{ animationDuration: `${duration}ms`, animationPlayState: paused ? 'paused' : 'running' }}
      />
    </li>
  )
}
