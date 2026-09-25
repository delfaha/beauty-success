import { useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { cn } from '@/utils/cn'

type Side = 'left' | 'right' | 'top'

const positions: Record<Side, string> = {
  right: 'inset-y-0 right-0 w-full sm:max-w-[27rem] border-l border-ink',
  left: 'inset-y-0 left-0 w-full sm:max-w-[27rem] border-r border-ink',
  top: 'inset-x-0 top-0 max-h-dvh border-b border-ink',
}

interface DrawerProps {
  open: boolean
  onClose: () => void
  label: string
  side?: Side
  className?: string
  children: ReactNode
}

/**
 * Panneau modal accessible (panier, menu mobile, filtres, recherche) :
 * rôle dialog, focus piégé, fermeture par Échap ou clic sur le voile,
 * défilement de la page bloqué. Reste monté pour animer l'ouverture et la fermeture.
 */
export function Drawer({ open, onClose, label, side = 'right', className, children }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  useFocusTrap(panelRef, open, onClose)
  useLockBodyScroll(open)

  return createPortal(
    <div className="drawer-root fixed inset-0 z-[90]" data-open={open} inert={!open}>
      <div className="drawer-backdrop absolute inset-0 bg-ink/45" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        data-side={side}
        className={cn('drawer-panel absolute flex flex-col bg-bone outline-none', positions[side], className)}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
