import { Minus, Plus } from 'lucide-react'
import { cn } from '@/utils/cn'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max: number
  label: string
  size?: 'sm' | 'md'
  className?: string
}

export function QuantitySelector({ value, onChange, min = 1, max, label, size = 'md', className }: QuantitySelectorProps) {
  const height = size === 'sm' ? 'h-9' : 'h-12'
  const button = cn(
    'grid place-items-center transition-colors hover:bg-ink hover:text-bone disabled:pointer-events-none disabled:opacity-30',
    size === 'sm' ? 'w-9' : 'w-11',
  )
  return (
    <div className={cn('inline-flex items-stretch border border-ink', height, className)} role="group" aria-label={label}>
      <button type="button" className={button} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Diminuer la quantité">
        <Minus className="size-3.5" strokeWidth={1.5} />
      </button>
      <output className="grid min-w-9 place-items-center text-body-sm font-semibold tabular" aria-live="polite">
        {value}
      </output>
      <button type="button" className={button} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Augmenter la quantité">
        <Plus className="size-3.5" strokeWidth={1.5} />
      </button>
    </div>
  )
}
