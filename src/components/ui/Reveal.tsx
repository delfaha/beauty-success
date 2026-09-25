import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/utils/cn'

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  delay?: number
  variant?: 'up' | 'fade' | 'clip' | 'scale'
  children?: ReactNode
}

/** Fait apparaître son contenu lorsqu'il entre dans l'écran (une seule fois). */
export function Reveal({ as: Tag = 'div', delay = 0, variant = 'up', className, style, children, ...rest }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>()
  return (
    <Tag
      ref={ref}
      className={cn('reveal', variant !== 'up' && `reveal-${variant}`, inView && 'is-visible', className)}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  )
}
