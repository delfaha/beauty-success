import { ArrowLeft, Gift, Lock, RotateCcw } from 'lucide-react'
import { Link } from 'react-router'
import { CartLine } from '@/components/cart/CartLine'
import { FreeShippingProgress } from '@/components/cart/FreeShippingProgress'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { PromoCodeForm } from '@/components/cart/PromoCodeForm'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { GhostButton, GhostLink } from '@/components/ui/GhostLink'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SplitText } from '@/components/ui/SplitText'
import { useProducts } from '@/hooks/useProducts'
import { useSeo } from '@/hooks/useSeo'
import { useCart, useToast } from '@/hooks/useStore'
import { pluralize } from '@/utils/format'
import { computeTotals, getShippingMethod } from '@/utils/pricing'

export default function CartPage() {
  useSeo({ title: 'Mon panier', noindex: true })
  const { items, promoCode, clearCart, restoreItem, itemCount } = useCart()
  const { push } = useToast()
  const { products, isLoading } = useProducts()
  const totals = computeTotals(items, { promoCode })
  const inCart = new Set(items.map((item) => item.productId))
  const suggestions = products.filter((product) => product.isBestSeller && product.stock > 0 && !inCart.has(product.id))

  const emptyCart = () => {
    const snapshot = items
    clearCart()
    push({
      eyebrow: 'Panier vidé',
      title: pluralize(snapshot.reduce((sum, item) => sum + item.quantity, 0), 'article retiré', 'articles retirés'),
      action: { label: 'Annuler', onClick: () => snapshot.forEach(restoreItem) },
    })
  }

  return (
    <div className="container-page pb-20 pt-6">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Panier' }]} />
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4 lg:mt-12">
        <h1 className="text-display font-extrabold">
          <SplitText text="Panier" trigger="mount" />
        </h1>
        {items.length > 0 && <p className="label-caps font-semibold">{pluralize(itemCount, 'article')}</p>}
      </div>

      {items.length === 0 ? (
        <EmptyState
          className="mt-10"
          title="Votre panier est vide."
          description="Nos conseillers ont sélectionné pour vous les parfums les plus aimés du moment. Laissez-vous tenter."
        >
          <ButtonLink to="/shop">Découvrir la boutique</ButtonLink>
          <GhostLink to="/shop/coffrets">Coffrets cadeaux</GhostLink>
        </EmptyState>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <section className="lg:col-span-8" aria-label="Articles du panier">
            <FreeShippingProgress subtotal={totals.subtotal} className="border-y border-ink py-4" />
            <ul>
              {items.map((item) => (
                <CartLine key={item.productId} item={item} />
              ))}
            </ul>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-ink pt-6">
              <Link to="/shop" className="group inline-flex items-center gap-2 label-caps font-semibold">
                <ArrowLeft className="size-3.5 transition-transform duration-500 group-hover:-translate-x-1" strokeWidth={1.5} aria-hidden="true" />
                <span className="link-underline">Continuer mes achats</span>
              </Link>
              <GhostButton onClick={emptyCart} className="text-muted">
                Vider le panier
              </GhostButton>
            </div>
          </section>

          <aside className="lg:col-span-4" aria-labelledby="summary-title">
            <div className="flex flex-col gap-6 border border-ink p-5 md:p-6 lg:sticky lg:top-[calc(var(--header-h,0px)_+_2rem)]">
              <h2 id="summary-title" className="label-caps font-semibold">
                Récapitulatif
              </h2>
              <PromoCodeForm />
              <OrderSummary totals={totals} promoCode={promoCode} shippingLabel={getShippingMethod().label.toLowerCase()} />
              <ButtonLink to="/checkout" size="lg" fullWidth icon={<Lock className="size-4" strokeWidth={1.5} aria-hidden="true" />}>
                Passer la commande
              </ButtonLink>
              <ul className="flex flex-col gap-2 text-caption text-muted">
                <li className="flex items-center gap-2">
                  <Gift className="size-4" strokeWidth={1.25} aria-hidden="true" />2 échantillons offerts avec votre commande
                </li>
                <li className="flex items-center gap-2">
                  <RotateCcw className="size-4" strokeWidth={1.25} aria-hidden="true" />
                  Retours gratuits sous 30 jours
                </li>
              </ul>
            </div>
          </aside>
        </div>
      )}

      {suggestions.length > 0 && (
        <section className="mt-20" aria-labelledby="cart-suggestions">
          <SectionHeader id="cart-suggestions" eyebrow="Pour compléter" title="Vous aimerez aussi" />
          <ProductCarousel products={suggestions} isLoading={isLoading} label="Suggestions de produits" />
        </section>
      )}
    </div>
  )
}
