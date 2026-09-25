import type { ReactNode } from 'react'
import type { NavLink } from '@/data/navigation'
import { cn } from '@/utils/cn'
import { GhostLink } from './GhostLink'
import { SplitText } from './SplitText'

interface SectionHeaderProps {
  title: string
  eyebrow?: string
  id?: string
  link?: NavLink
  children?: ReactNode
  className?: string
  tone?: 'ink' | 'bone'
}

/** En-tête de section éditorial : filet noir, sur-titre, grand titre révélé mot à mot. */
export function SectionHeader({ title, eyebrow, id, link, children, className, tone = 'ink' }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col gap-6 border-t pt-5 md:mb-10 md:flex-row md:items-end md:justify-between',
        tone === 'ink' ? 'border-ink' : 'border-bone/60',
        className,
      )}
    >
      <div>
        {eyebrow && <p className="mb-4 label-caps">{eyebrow}</p>}
        <SplitText as="h2" id={id} text={title} className="text-heading font-extrabold" />
      </div>
      {(link || children) && (
        <div className="flex items-center gap-6">
          {link && <GhostLink to={link.to}>{link.label}</GhostLink>}
          {children}
        </div>
      )}
    </div>
  )
}

/** Libellé vertical en marge de section (desktop large uniquement). */
export function VerticalLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span aria-hidden="true" className={cn('writing-vertical hidden label-caps 2xl:block', className)}>
      {children}
    </span>
  )
}
