import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatRating } from '@/utils/format'

/** Note sur 5 : étoiles dorées (seul usage de la couleur d'accent) + nombre d'avis. */
export function Rating({ value, count, className, showValue = false }: { value: number; count?: number; className?: string; showValue?: boolean }) {
  const percent = Math.max(0, Math.min(100, (value / 5) * 100))
  const label = `Note : ${formatRating(value)} sur 5${count !== undefined ? `, ${count} avis` : ''}`
  const stars = (className: string) => (
    <span className={cn('flex gap-0.5', className)}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className="size-3.5 shrink-0" strokeWidth={1.25} fill="currentColor" />
      ))}
    </span>
  )
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="relative inline-flex" role="img" aria-label={label}>
        {stars('text-ink/15')}
        <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${percent}%` }}>
          {stars('text-gold')}
        </span>
      </span>
      {(showValue || count !== undefined) && (
        <span className="text-caption text-muted" aria-hidden="true">
          {showValue && <span className="font-semibold text-ink">{formatRating(value)} </span>}
          {count !== undefined && `(${count})`}
        </span>
      )}
    </div>
  )
}
