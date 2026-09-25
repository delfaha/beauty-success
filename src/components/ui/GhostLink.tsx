import { ArrowRight } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '@/utils/cn'

const ghost = 'group inline-flex items-center gap-2 label-caps font-semibold'

function Arrow() {
  return (
    <ArrowRight
      aria-hidden="true"
      className="size-3.5 shrink-0 transition-transform duration-500 ease-expo group-hover:translate-x-1"
      strokeWidth={1.5}
    />
  )
}

/**
 * Bouton « fantôme » : texte capitales espacées, sans fond ni bordure,
 * soulignement qui se dessine au survol — le style d'action signature.
 */
export function GhostLink({
  children,
  className,
  arrow = true,
  ...rest
}: LinkProps & { children: ReactNode; arrow?: boolean }) {
  return (
    <Link className={cn(ghost, className)} {...rest}>
      <span className="link-underline">{children}</span>
      {arrow && <Arrow />}
    </Link>
  )
}

export function GhostButton({
  children,
  className,
  arrow = false,
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; arrow?: boolean }) {
  return (
    <button type={type} className={cn(ghost, 'disabled:opacity-40', className)} {...rest}>
      <span className="link-underline">{children}</span>
      {arrow && <Arrow />}
    </button>
  )
}
