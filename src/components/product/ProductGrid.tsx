import { Reveal } from '@/components/ui/Reveal'
import type { Product } from '@/types/product'
import { cn } from '@/utils/cn'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductSkeletons'

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  skeletonCount?: number
  columns?: 'catalog' | 'wide'
  className?: string
  label?: string
}

const layouts = {
  catalog: 'grid-cols-2 md:grid-cols-3',
  wide: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
}

export function ProductGrid({ products, isLoading = false, skeletonCount = 8, columns = 'catalog', className, label }: ProductGridProps) {
  const grid = cn('grid gap-x-2.5 gap-y-10 md:gap-y-12', layouts[columns], className)

  if (isLoading) {
    return (
      <div className={grid} aria-busy="true" aria-label="Chargement des produits">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <ul className={grid} aria-label={label}>
      {products.map((product, index) => (
        <Reveal as="li" key={product.id} delay={(index % 4) * 70}>
          <ProductCard product={product} priority={index < 4} />
        </Reveal>
      ))}
    </ul>
  )
}
