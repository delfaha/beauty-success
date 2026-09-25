import { Gift, RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams } from 'react-router'
import { FavoriteButton } from '@/components/product/FavoriteButton'
import { OlfactoryPyramid } from '@/components/product/OlfactoryPyramid'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductImage } from '@/components/product/ProductImage'
import { ProductPageSkeleton } from '@/components/product/ProductSkeletons'
import { AccordionItem } from '@/components/ui/Accordion'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { GhostLink } from '@/components/ui/GhostLink'
import { JsonLd } from '@/components/ui/JsonLd'
import { Price } from '@/components/ui/Price'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { Rating } from '@/components/ui/Rating'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SplitText } from '@/components/ui/SplitText'
import { FREE_SAMPLES, FREE_SHIPPING_THRESHOLD, MAX_QTY_PER_ITEM } from '@/config/shop'
import { CATEGORY_CONCENTRATION, CATEGORY_LABELS, FAMILY_LABELS, GENDER_LABELS } from '@/data/taxonomy'
import { useAddToCart } from '@/hooks/useAddToCart'
import { useRecentlyViewed } from '@/hooks/useHistory'
import { useProduct } from '@/hooks/useProducts'
import { useSeo } from '@/hooks/useSeo'
import { useCart } from '@/hooks/useStore'
import type { Product } from '@/types/product'
import { cn } from '@/utils/cn'
import { formatDate, formatPrice } from '@/utils/format'
import { brandSlug, primaryCollection, similarProducts, stockStatus } from '@/utils/product'
import { productJsonLd } from '@/utils/seo'

const REASSURANCE = [
  { icon: Truck, text: `Livraison offerte dès ${FREE_SHIPPING_THRESHOLD} € — expédition sous 24 h` },
  { icon: Gift, text: `${FREE_SAMPLES} échantillons offerts et emballage soigné` },
  { icon: RotateCcw, text: 'Retours gratuits sous 30 jours' },
  { icon: ShieldCheck, text: 'Produit authentique, paiement sécurisé' },
]

/** Barre d'achat collante (mobile/tablette) lorsque le bouton principal sort de l'écran. */
function useStickyBar(targetRef: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const target = targetRef.current
    if (!target) return
    const narrow = window.matchMedia('(max-width: 1023px)')
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(narrow.matches && !entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [targetRef])

  useEffect(() => {
    document.documentElement.style.setProperty('--sticky-offset', visible ? '4.75rem' : '0px')
    return () => document.documentElement.style.setProperty('--sticky-offset', '0px')
  }, [visible])

  return visible
}

function StickyBuyBar({ product, visible, disabled, onAdd }: { product: Product; visible: boolean; disabled: boolean; onAdd: () => void }) {
  return createPortal(
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-ink bg-bone px-4 py-3 transition-transform duration-500 ease-expo lg:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
      inert={!visible}
    >
      <div className="flex items-center gap-3">
        <div className="h-14 w-11 shrink-0 overflow-hidden bg-sand">
          <ProductImage src={product.image} alt="" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-sm font-extrabold">{product.name}</p>
          <p className="text-caption text-muted">{formatPrice(product.price)}</p>
        </div>
        <Button onClick={onAdd} disabled={disabled} size="sm">
          {product.stock > 0 ? 'Ajouter' : 'Épuisé'}
        </Button>
      </div>
    </div>,
    document.body,
  )
}

function ProductDetails({ product, catalog, recentIds }: { product: Product; catalog: Product[]; recentIds: string[] }) {
  const addToCart = useAddToCart()
  const { getQuantity } = useCart()
  const [quantity, setQuantity] = useState(1)
  const ctaRef = useRef<HTMLDivElement>(null)
  const stickyVisible = useStickyBar(ctaRef)

  const inCart = getQuantity(product.id)
  const limit = Math.min(product.stock, MAX_QTY_PER_ITEM)
  const remaining = Math.max(0, limit - inCart)
  const available = product.stock > 0
  const status = stockStatus(product.stock)
  const collection = primaryCollection(product)
  const qty = Math.max(1, Math.min(quantity, remaining || 1))

  const similar = useMemo(() => similarProducts(product, catalog), [product, catalog])
  const recent = useMemo(
    () =>
      recentIds
        .map((id) => catalog.find((candidate) => candidate.id === id))
        .filter((candidate): candidate is Product => Boolean(candidate))
        .slice(0, 8),
    [recentIds, catalog],
  )

  const add = () => {
    addToCart(product, qty)
    setQuantity(1)
  }

  const details: [string, string][] = [
    ['Marque', product.brand],
    ['Catégorie', CATEGORY_LABELS[product.category]],
    ['Concentration', CATEGORY_CONCENTRATION[product.category]],
    ['Contenance', product.volume],
    ['Genre', GENDER_LABELS[product.gender]],
    ['Famille olfactive', FAMILY_LABELS[product.family]],
    ['Date de sortie', formatDate(product.releaseDate)],
    ['Référence', product.sku],
    ['Fabrication', 'France'],
  ]

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <div className="container-page pb-16 pt-6">
        <Breadcrumb
          items={[
            { label: 'Accueil', to: '/' },
            { label: collection.label, to: `/shop/${collection.slug}` },
            { label: product.name },
          ]}
        />
        <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProductGallery product={product} />
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h,0px)_+_2rem)]">
              <Link to={`/shop?marque=${brandSlug(product.brand)}`} className="label-caps font-semibold link-underline">
                {product.brand}
              </Link>
              <h1 className="mt-3 text-heading font-extrabold">
                <SplitText text={product.name} trigger="mount" />
              </h1>
              <p className="mt-3 text-subheading text-muted">
                {CATEGORY_LABELS[product.category]} · {product.volume}
              </p>
              <Rating value={product.rating} count={product.reviewCount} showValue className="mt-4" />

              <div className="mt-4 flex flex-wrap gap-1.5">
                {product.isNew && <Badge>Nouveau</Badge>}
                {product.isPromotion && product.discount && <Badge tone="outline">Promo −{product.discount} %</Badge>}
                {product.isBestSeller && <Badge tone="dusty">Best-seller</Badge>}
              </div>

              <div className="mt-6 border-t border-ink pt-6">
                <Price price={product.price} oldPrice={product.oldPrice} discount={product.discount} size="lg" />
                {product.oldPrice && product.oldPrice > product.price && (
                  <p className="mt-1 text-body-sm">Vous économisez {formatPrice(product.oldPrice - product.price)}.</p>
                )}
                <p className="mt-1 text-caption text-muted">Prix TTC, hors frais de livraison.</p>
              </div>

              <p className="mt-6 text-body">{product.description}</p>

              <div className="mt-6">
                <p className="label-caps font-semibold">Contenance</p>
                <p className="mt-2 inline-flex border border-ink px-4 py-2 text-body-sm font-semibold">{product.volume}</p>
              </div>

              <p className="mt-6 flex items-center gap-2.5 text-body-sm font-semibold" role="status">
                <span
                  aria-hidden="true"
                  className={cn(
                    'size-2.5',
                    status.tone === 'available' && 'bg-ink',
                    status.tone === 'low' && 'animate-pulse bg-gold',
                    status.tone === 'out' && 'border border-ink',
                  )}
                />
                {status.label}
              </p>

              <div ref={ctaRef} className="mt-4 flex gap-2.5">
                {available && remaining > 0 && (
                  <QuantitySelector value={qty} onChange={setQuantity} min={1} max={remaining} label="Quantité" />
                )}
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={add}
                  disabled={!available || remaining === 0}
                  icon={<ShoppingBag className="size-4" strokeWidth={1.5} aria-hidden="true" />}
                >
                  {!available ? 'Épuisé' : remaining === 0 ? 'Quantité maximale' : `Ajouter — ${formatPrice(product.price * qty)}`}
                </Button>
                <FavoriteButton product={product} variant="outline" />
              </div>
              {inCart > 0 && <p className="mt-2 text-caption text-muted">Déjà {inCart} dans votre panier.</p>}
              {!available && (
                <p className="mt-4 text-body-sm">
                  Victime de son succès, ce parfum revient très vite.{' '}
                  <GhostLink to={`/shop/${collection.slug}?famille=${product.family}`}>Voir des alternatives</GhostLink>
                </p>
              )}

              <ul className="mt-8 grid gap-3 border-y border-ink py-5">
                {REASSURANCE.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-body-sm">
                    <Icon className="size-5 shrink-0" strokeWidth={1.25} aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>

              <div>
                <AccordionItem title="Description" defaultOpen>
                  <p>{product.description}</p>
                </AccordionItem>
                {product.contents && (
                  <AccordionItem title="Contenu du coffret" defaultOpen>
                    <ul className="flex list-disc flex-col gap-1 pl-5">
                      {product.contents.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </AccordionItem>
                )}
                <AccordionItem title="Notes olfactives">
                  <dl className="grid gap-2">
                    {(
                      [
                        ['Tête', product.notes.top],
                        ['Cœur', product.notes.heart],
                        ['Fond', product.notes.base],
                      ] as const
                    ).map(([label, notes]) => (
                      <div key={label} className="grid grid-cols-[4.5rem_1fr] gap-3">
                        <dt className="label-caps text-muted">{label}</dt>
                        <dd>{notes.join(', ')}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionItem>
                <AccordionItem title="Informations produit">
                  <dl className="grid gap-2">
                    {details.map(([label, value]) => (
                      <div key={label} className="grid grid-cols-[9rem_1fr] gap-3">
                        <dt className="text-muted">{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 text-caption text-muted">
                    Composition indicative : Alcohol, Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin, Citral. Se référer à
                    l’emballage du produit.
                  </p>
                </AccordionItem>
                <AccordionItem title="Livraison & retours">
                  <p>
                    Livraison à domicile ou en point relais en 2 à 5 jours ouvrés, offerte dès {FREE_SHIPPING_THRESHOLD} € d’achat. Express
                    24 h disponible. Retours gratuits sous 30 jours pour les produits non ouverts.
                  </p>
                  <GhostLink to="/aide/livraison" className="mt-3">
                    En savoir plus
                  </GhostLink>
                </AccordionItem>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OlfactoryPyramid product={product} />

      {similar.length > 0 && (
        <section className="container-page py-16 md:py-24" aria-labelledby="similar-title">
          <SectionHeader
            id="similar-title"
            eyebrow="Produits similaires"
            title="Vous aimerez aussi"
            link={{ label: 'Voir la collection', to: `/shop/${collection.slug}` }}
          />
          <ProductCarousel products={similar} label="Produits similaires" />
        </section>
      )}

      {recent.length > 0 && (
        <section className="container-page pb-16 md:pb-24" aria-labelledby="recent-title">
          <SectionHeader id="recent-title" eyebrow="Votre historique" title="Vus récemment" />
          <ProductCarousel products={recent} label="Produits vus récemment" />
        </section>
      )}

      <StickyBuyBar product={product} visible={stickyVisible} disabled={!available || remaining === 0} onAdd={add} />
    </>
  )
}

export default function ProductPage() {
  const { id } = useParams()
  const { product, products, isLoading } = useProduct(id)
  const recentIds = useRecentlyViewed(product?.id)

  useSeo({
    title: product ? `${product.name} — ${product.brand}` : isLoading ? 'Chargement du produit' : 'Produit introuvable',
    description: product
      ? `${product.name} de ${product.brand}, ${CATEGORY_LABELS[product.category].toLowerCase()} ${product.volume} à ${formatPrice(product.price)}. ${product.description}`.slice(0, 158)
      : undefined,
    type: 'product',
    noindex: !isLoading && !product,
  })

  if (isLoading) return <ProductPageSkeleton />

  if (!product) {
    return (
      <div className="container-page py-16">
        <EmptyState
          headingLevel="h1"
          title="Ce parfum s’est évaporé."
          description="Le produit que vous cherchez n’existe pas ou n’est plus disponible."
        >
          <ButtonLink to="/shop">Voir la boutique</ButtonLink>
          <GhostLink to="/shop/nouveautes">Découvrir les nouveautés</GhostLink>
        </EmptyState>
      </div>
    )
  }

  return <ProductDetails key={product.id} product={product} catalog={products} recentIds={recentIds} />
}
