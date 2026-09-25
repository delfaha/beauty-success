import { Plus, ShoppingBag } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/Badge'
import { Price } from '@/components/ui/Price'
import { Rating } from '@/components/ui/Rating'
import { RollText } from '@/components/ui/RollText'
import { useAddToCart } from '@/hooks/useAddToCart'
import type { Product } from '@/types/product'
import { cn } from '@/utils/cn'
import { isAvailable, productPath, productTypeLabel } from '@/utils/product'
import { FavoriteButton } from './FavoriteButton'
import { ProductImage } from './ProductImage'

interface ProductCardProps {
  product: Product
  priority?: boolean
  className?: string
}

/**
 * Carte produit : visuel plein cadre, second visuel dévoilé au survol,
 * ajout rapide au panier, favoris, badges et prix. Toute la carte est cliquable
 * (lien étiré) sans dupliquer les tabulations clavier.
 */
export const ProductCard = memo(function ProductCard({ product, priority = false, className }: ProductCardProps) {
  const addToCart = useAddToCart()
  const available = isAvailable(product)
  const href = productPath(product.id)
  const alternate = product.images[1]

  return (
    <article className={cn('group/card art-host relative flex h-full flex-col', className)} data-cursor="Voir">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <div className={cn('card-main absolute inset-0', !available && 'opacity-60 grayscale')}>
          <ProductImage src={product.image} alt={`${product.name} — ${product.brand}`} priority={priority} />
        </div>
        {alternate && available && (
          <div className="card-alt absolute inset-0 hidden md:block" aria-hidden="true">
            <ProductImage src={alternate} alt="" />
          </div>
        )}

        <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex flex-col items-start gap-1.5">
          {product.isNew && <Badge>Nouveau</Badge>}
          {product.isPromotion && product.discount && <Badge tone="outline">Promo −{product.discount} %</Badge>}
          {product.isBestSeller && <Badge tone="bone">Best-seller</Badge>}
          {!available && <Badge tone="dusty">Épuisé</Badge>}
        </div>

        <FavoriteButton product={product} className="absolute right-1 top-1" />

        {/* Souris : bandeau qui monte au survol. Écran tactile : bouton icône permanent. */}
        <div className="quick-add quick-add-desktop absolute inset-x-2.5 bottom-2.5 z-10" data-cursor="">
          <button
            type="button"
            onClick={() => addToCart(product)}
            disabled={!available}
            className="btn-sweep roll-host flex h-11 w-full items-center justify-between bg-ink px-4 text-bone transition-colors duration-500 enabled:hover:text-ink [--sweep-color:var(--color-bone)] disabled:bg-bone disabled:text-muted"
            aria-label={available ? `Ajouter ${product.name} au panier` : `${product.name} est épuisé`}
          >
            <span className="label-caps font-semibold">
              <RollText>{available ? 'Ajouter au panier' : 'Épuisé'}</RollText>
            </span>
            {available && <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />}
          </button>
        </div>
        {available && (
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="quick-add-touch absolute bottom-2 right-2 z-10 size-10 items-center justify-center bg-ink text-bone"
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <ShoppingBag className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 pt-3.5">
        <p className="label-caps text-muted">{product.brand}</p>
        <h3 className="text-subheading font-extrabold leading-tight tracking-[-0.02em]">
          <Link to={href} className="link-underline after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <p className="text-body-sm text-muted">{productTypeLabel(product)}</p>
        <Rating value={product.rating} count={product.reviewCount} className="mt-0.5" />
        <Price price={product.price} oldPrice={product.oldPrice} discount={product.discount} className="mt-auto pt-1.5" />
      </div>
    </article>
  )
})
