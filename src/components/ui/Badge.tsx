import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

type Tone = 'ink' | 'outline' | 'bone' | 'dusty'

const tones: Record<Tone, string> = {
  ink: 'bg-ink text-bone',
  outline: 'border border-ink bg-bone text-ink',
  bone: 'bg-bone text-ink',
  dusty: 'bg-dusty text-ink',
}

export function Badge({ children, tone = 'ink', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 label-caps font-semibold', tones[tone], className)}>
      {children}
    </span>
  )
}
