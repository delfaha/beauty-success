import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function EmptyState({
  title,
  description,
  children,
  className,
  headingLevel: Heading = 'h2',
}: {
  title: string
  description?: ReactNode
  children?: ReactNode
  className?: string
  headingLevel?: 'h1' | 'h2' | 'h3'
}) {
  return (
    <div className={cn('flex flex-col items-start gap-6 border-t border-ink py-12 md:py-16', className)}>
      <Heading className="max-w-3xl text-heading font-extrabold">{title}</Heading>
      {description && <div className="max-w-xl text-body text-muted">{description}</div>}
      {children && <div className="flex flex-wrap items-center gap-x-8 gap-y-4">{children}</div>}
    </div>
  )
}
