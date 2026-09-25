import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'

interface PriceProps {
  price: number
  oldPrice?: number | null
  discount?: number | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'text-body-sm',
  md: 'text-body',
  lg: 'text-heading-sm',
}

export function Price({ price, oldPrice, discount, size = 'md', className }: PriceProps) {
  const onSale = Boolean(oldPrice && oldPrice > price)
  return (
    <p className={cn('flex flex-wrap items-baseline gap-x-2.5 gap-y-1', className)}>
      <span className={cn('font-extrabold tabular', sizes[size])}>
        {onSale && <span className="sr-only">Prix promotionnel : </span>}
        {formatPrice(price)}
      </span>
      {onSale && oldPrice && (
        <>
          <span className="sr-only">au lieu de</span>
          <del className={cn('tabular text-muted', size === 'lg' ? 'text-body' : 'text-body-sm')}>{formatPrice(oldPrice)}</del>
          {discount ? (
            <span className="label-caps font-semibold">
              −{discount} %
            </span>
          ) : null}
        </>
      )}
    </p>
  )
}
