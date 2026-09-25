import type { CSSProperties } from 'react'
import { cn } from '@/utils/cn'

/** Logotype typographique : lettres qui roulent en cascade au survol du lien parent. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('wordmark inline-flex font-extrabold uppercase leading-none tracking-[-0.05em]', className)} aria-hidden="true">
      {[...'BEAUTY SUCCESS'].map((char, index) =>
        char === ' ' ? (
          <span key={index} className="w-[0.28em]" />
        ) : (
          <span key={index} className="wordmark-letter" style={{ '--i': index } as CSSProperties}>
            <span>{char}</span>
            <span>{char}</span>
          </span>
        ),
      )}
    </span>
  )
}
