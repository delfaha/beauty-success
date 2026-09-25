import { Link } from 'react-router'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductImage } from '@/components/product/ProductImage'
import { ProductCardSkeleton } from '@/components/product/ProductSkeletons'
import { Price } from '@/components/ui/Price'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { useProducts } from '@/hooks/useProducts'
import type { Product } from '@/types/product'
import { productPath, productTypeLabel } from '@/utils/product'

/** Grand visuel sombre + typographie « Nouveau » en surimpression. */
function FeatureTile({ product }: { product: Product }) {
  return (
    <Link
      to={productPath(product.id)}
      className="group/tile art-host relative block aspect-[4/5] overflow-hidden bg-ink text-bone lg:aspect-auto lg:h-full"
      data-cursor="Voir"
    >
      <div className="card-main absolute inset-0">
        <ProductImage src={product.images[1] ?? product.image} alt={`${product.name} — ${product.brand}`} live />
      </div>
      <div className="absolute inset-x-0 top-0 p-4 md:p-6">
        <p className="text-display font-extrabold mix-blend-difference">Nouveau</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-6">
        <div>
          <p className="label-caps text-bone/70">{product.brand}</p>
          <p className="mt-1 text-heading-sm font-extrabold">
            <span className="link-underline">{product.name}</span>
          </p>
          <p className="mt-1 text-body-sm text-bone/70">{productTypeLabel(product)}</p>
        </div>
        <Price price={product.price} oldPrice={product.oldPrice} discount={product.discount} />
      </div>
    </Link>
  )
}

export function NewArrivals() {
  const { products, isLoading } = useProducts()
  const arrivals = products
    .filter((product) => product.isNew)
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
  const [feature, ...rest] = arrivals

  return (
    <section className="container-page py-16 md:py-24" aria-labelledby="new-title">
      <SectionHeader
        id="new-title"
        eyebrow="Fraîchement arrivés"
        title="Nouveautés"
        link={{ label: 'Toutes les nouveautés', to: '/shop/nouveautes' }}
      />
      <div className="grid gap-x-2.5 gap-y-10 lg:grid-cols-12">
        <Reveal variant="clip" className="lg:col-span-6">
          {feature ? <FeatureTile product={feature} /> : <div className="skeleton aspect-[4/5]" />}
        </Reveal>
        <ul className="grid grid-cols-2 gap-x-2.5 gap-y-10 lg:col-span-6">
          {isLoading
            ? Array.from({ length: 4 }, (_, index) => (
                <li key={index}>
                  <ProductCardSkeleton />
                </li>
              ))
            : rest.slice(0, 4).map((product, index) => (
                <Reveal as="li" key={product.id} delay={index * 80}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
        </ul>
      </div>
    </section>
  )
}
