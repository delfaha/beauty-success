import { Check } from 'lucide-react'
import { FREE_SHIPPING_THRESHOLD } from '@/config/shop'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'

export function FreeShippingProgress({ subtotal, className }: { subtotal: number; className?: string }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const percent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      <p className="flex items-center gap-2 text-body-sm" aria-live="polite">
        {remaining > 0 ? (
          <span>
            Plus que <strong className="font-extrabold">{formatPrice(remaining)}</strong> pour profiter de la livraison offerte
          </span>
        ) : (
          <>
            <Check className="size-4" strokeWidth={2} aria-hidden="true" />
            <span className="font-semibold">La livraison vous est offerte</span>
          </>
        )}
      </p>
      <div
        className="h-0.5 bg-ink/15"
        role="progressbar"
        aria-label="Progression vers la livraison offerte"
        aria-valuemin={0}
        aria-valuemax={FREE_SHIPPING_THRESHOLD}
        aria-valuenow={Math.round(Math.min(subtotal, FREE_SHIPPING_THRESHOLD))}
      >
        <div className="h-full bg-ink transition-[width] duration-700 ease-expo" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
