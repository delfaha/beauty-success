import type { ReactNode } from 'react'
import type { OrderTotals } from '@/types/order'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'

interface OrderSummaryProps {
  totals: OrderTotals
  promoCode?: string | null
  shippingLabel?: string
  /** Afficher « Calculée à l'étape suivante » au lieu du montant de livraison. */
  shippingPending?: boolean
  className?: string
  children?: ReactNode
}

function Row({ label, value, strong = false }: { label: ReactNode; value: ReactNode; strong?: boolean }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4', strong ? 'text-subheading font-extrabold' : 'text-body-sm')}>
      <dt>{label}</dt>
      <dd className="tabular">{value}</dd>
    </div>
  )
}

export function OrderSummary({ totals, promoCode, shippingLabel, shippingPending, className, children }: OrderSummaryProps) {
  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <dl className="flex flex-col gap-2.5">
        <Row label={`Sous-total (${totals.itemCount} article${totals.itemCount > 1 ? 's' : ''})`} value={formatPrice(totals.subtotal)} />
        {totals.discount > 0 && <Row label={`Code ${promoCode ?? ''}`} value={`−${formatPrice(totals.discount)}`} />}
        <Row
          label={shippingLabel ? `Livraison — ${shippingLabel}` : 'Livraison'}
          value={shippingPending ? 'À l’étape suivante' : totals.shipping === 0 ? 'Offerte' : formatPrice(totals.shipping)}
        />
        <div className="mt-2 border-t border-ink pt-4">
          <Row label="Total TTC" value={formatPrice(totals.total)} strong />
        </div>
      </dl>
      {totals.savings > 0 && (
        <p className="bg-dusty px-3 py-2 text-body-sm">
          Vous économisez <strong className="font-extrabold">{formatPrice(totals.savings + totals.discount)}</strong> sur cette commande.
        </p>
      )}
      {children}
    </div>
  )
}
