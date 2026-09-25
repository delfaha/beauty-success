import { Link } from 'react-router'
import { ProductImage } from '@/components/product/ProductImage'
import { GhostButton } from '@/components/ui/GhostLink'
import { Price } from '@/components/ui/Price'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { MAX_QTY_PER_ITEM } from '@/config/shop'
import { CATEGORY_LABELS } from '@/data/taxonomy'
import { useCart, useToast } from '@/hooks/useStore'
import type { CartItem } from '@/types/cart'
import { cn } from '@/utils/cn'
import { productPath } from '@/utils/product'

export function CartLine({ item, size = 'md', onNavigate }: { item: CartItem; size?: 'sm' | 'md'; onNavigate?: () => void }) {
  const { updateQuantity, removeItem, restoreItem } = useCart()
  const { push } = useToast()
  const max = Math.min(item.stock, MAX_QTY_PER_ITEM)
  const href = productPath(item.productId)

  const remove = () => {
    removeItem(item.productId)
    push({
      eyebrow: 'Retiré du panier',
      title: item.name,
      image: item.image,
      imageAlt: item.name,
      action: { label: 'Annuler', onClick: () => restoreItem(item) },
    })
  }

  return (
    <li className="flex gap-4 border-b border-ink/15 py-5 last:border-b-0">
      <Link
        to={href}
        onClick={onNavigate}
        className={cn('art-host shrink-0 overflow-hidden bg-sand', size === 'sm' ? 'h-28 w-[5.5rem]' : 'h-36 w-28 md:h-44 md:w-36')}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductImage src={item.image} alt="" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="label-caps text-muted">{item.brand}</p>
            <Link to={href} onClick={onNavigate} className="font-extrabold leading-tight link-underline">
              {item.name}
            </Link>
            <p className="mt-0.5 text-body-sm text-muted">
              {CATEGORY_LABELS[item.category]} · {item.volume}
            </p>
          </div>
          <Price
            price={item.price * item.quantity}
            oldPrice={item.oldPrice ? item.oldPrice * item.quantity : null}
            size="sm"
            className="flex-col items-end gap-0 text-right"
          />
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <QuantitySelector
            size="sm"
            value={item.quantity}
            min={1}
            max={max}
            onChange={(value) => updateQuantity(item.productId, value)}
            label={`Quantité pour ${item.name}`}
          />
          <GhostButton onClick={remove} className="text-muted hover:text-ink" aria-label={`Retirer ${item.name} du panier`}>
            Retirer
          </GhostButton>
        </div>
        {item.quantity >= max && <p className="mt-2 text-caption text-muted">Quantité maximale disponible atteinte.</p>}
      </div>
    </li>
  )
}
