import { Lock, X } from 'lucide-react'
import { Link } from 'react-router'
import { ProductImage } from '@/components/product/ProductImage'
import { ButtonLink } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { GhostLink } from '@/components/ui/GhostLink'
import { useProducts } from '@/hooks/useProducts'
import { useCart } from '@/hooks/useStore'
import { formatPrice } from '@/utils/format'
import { computeTotals } from '@/utils/pricing'
import { productPath } from '@/utils/product'
import { CartLine } from './CartLine'
import { FreeShippingProgress } from './FreeShippingProgress'

function EmptyCart({ onClose }: { onClose: () => void }) {
  const { products } = useProducts()
  const suggestions = products.filter((product) => product.isBestSeller && product.stock > 0).slice(0, 4)
  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 py-8">
      <p className="text-heading font-extrabold">Votre panier est vide.</p>
      <p className="mt-4 text-body text-muted">Laissez-vous tenter par nos incontournables ou explorez nos univers.</p>
      <div className="mt-6 flex flex-col items-start gap-3">
        <GhostLink to="/shop/femme" onClick={onClose}>Parfums femme</GhostLink>
        <GhostLink to="/shop/homme" onClick={onClose}>Parfums homme</GhostLink>
        <GhostLink to="/shop/coffrets" onClick={onClose}>Coffrets cadeaux</GhostLink>
      </div>
      {suggestions.length > 0 && (
        <div className="mt-10">
          <p className="label-caps text-muted">Nos best-sellers</p>
          <ul className="mt-4 grid grid-cols-2 gap-2.5">
            {suggestions.map((product) => (
              <li key={product.id}>
                <Link to={productPath(product.id)} onClick={onClose} className="group/tile art-host flex flex-col gap-2">
                  <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                    <div className="card-main absolute inset-0">
                      <ProductImage src={product.image} alt={`${product.name} — ${product.brand}`} />
                    </div>
                  </div>
                  <span className="text-body-sm font-extrabold leading-tight">{product.name}</span>
                  <span className="text-caption text-muted">{formatPrice(product.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function CartDrawer() {
  const { items, itemCount, isOpen, closeCart, promoCode, subtotal } = useCart()
  const totals = computeTotals(items, { promoCode })

  return (
    <Drawer open={isOpen} onClose={closeCart} label="Panier" side="right">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink px-5">
        <p className="label-caps font-semibold">
          Panier <span className="tabular">({itemCount})</span>
        </p>
        <button type="button" onClick={closeCart} className="grid size-10 place-items-center" aria-label="Fermer le panier">
          <X className="size-5" strokeWidth={1.25} />
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyCart onClose={closeCart} />
      ) : (
        <>
          <div className="shrink-0 border-b border-ink/15 px-5 py-4">
            <FreeShippingProgress subtotal={subtotal} />
          </div>
          <ul className="flex-1 overflow-y-auto px-5" aria-label="Articles du panier">
            {items.map((item) => (
              <CartLine key={item.productId} item={item} size="sm" onNavigate={closeCart} />
            ))}
          </ul>
          <div className="shrink-0 border-t border-ink px-5 pb-5 pt-4">
            <dl className="flex flex-col gap-1.5 text-body-sm">
              <div className="flex justify-between">
                <dt>Sous-total</dt>
                <dd className="tabular">{formatPrice(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between">
                  <dt>Code {promoCode}</dt>
                  <dd className="tabular">−{formatPrice(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>Livraison estimée</dt>
                <dd className="tabular">{totals.shipping === 0 ? 'Offerte' : formatPrice(totals.shipping)}</dd>
              </div>
              <div className="mt-1.5 flex justify-between border-t border-ink/15 pt-2.5 text-subheading font-extrabold">
                <dt>Total</dt>
                <dd className="tabular">{formatPrice(totals.total)}</dd>
              </div>
            </dl>
            <div className="mt-4 grid gap-2">
              <ButtonLink to="/checkout" onClick={closeCart} size="lg" fullWidth>
                Passer la commande
              </ButtonLink>
              <ButtonLink to="/cart" onClick={closeCart} variant="outline" fullWidth>
                Voir le panier
              </ButtonLink>
            </div>
            <p className="mt-3 flex items-center justify-center gap-2 text-caption text-muted">
              <Lock className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
              Paiement sécurisé · 2 échantillons offerts
            </p>
          </div>
        </>
      )}
    </Drawer>
  )
}
