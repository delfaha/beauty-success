import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDragScroll } from '@/hooks/useMotion'
import type { Product } from '@/types/product'
import { cn } from '@/utils/cn'
import { prefersReducedMotion } from '@/utils/motion'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductSkeletons'

interface ProductCarouselProps {
  products: Product[]
  isLoading?: boolean
  label: string
  className?: string
  /** Largeur des cartes (nombre visible sur grand écran). */
  perView?: 3 | 4
}

/**
 * Rangée défilante : glisser à la souris, balayage tactile, flèches fines.
 * Pas de pagination à points — la flèche est la seule affordance.
 */
export function ProductCarousel({ products, isLoading = false, label, className, perView = 4 }: ProductCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  useDragScroll(trackRef)

  const update = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setCanPrev(track.scrollLeft > 4)
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    update()
    track.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(track)
    return () => {
      track.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [update, products.length, isLoading])

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current
    const card = track?.querySelector('li')
    if (!track || !card) return
    const step = (card.getBoundingClientRect().width + 10) * Math.max(1, Math.floor(track.clientWidth / card.clientWidth) - 1)
    track.scrollBy({ left: direction * step, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  const itemWidth =
    perView === 4
      ? 'basis-[72%] sm:basis-[44%] md:basis-[31%] lg:basis-[calc((100%-30px)/4)]'
      : 'basis-[72%] sm:basis-[44%] lg:basis-[calc((100%-20px)/3)]'

  const arrow =
    'absolute top-[calc(50%-4.5rem)] z-20 hidden size-12 -translate-y-1/2 place-items-center bg-bone text-ink transition-all duration-500 ease-expo hover:bg-ink hover:text-bone md:grid'

  return (
    <div className={cn('relative', className)}>
      <ul
        ref={trackRef}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-4 px-4 md:mx-0 md:scroll-px-0 md:px-0 data-[dragging=true]:cursor-grabbing data-[dragging=true]:snap-none"
        aria-label={label}
        data-cursor="Glisser"
      >
        {isLoading
          ? Array.from({ length: perView }, (_, index) => (
              <li key={index} className={cn('shrink-0 snap-start', itemWidth)}>
                <ProductCardSkeleton />
              </li>
            ))
          : products.map((product, index) => (
              <li key={product.id} className={cn('shrink-0 snap-start', itemWidth)}>
                <ProductCard product={product} priority={index < 2} />
              </li>
            ))}
      </ul>
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Produits précédents"
        className={cn(arrow, 'left-0', canPrev ? 'opacity-100' : 'pointer-events-none -translate-x-2 opacity-0')}
      >
        <ChevronLeft className="size-6" strokeWidth={1} />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Produits suivants"
        className={cn(arrow, 'right-0', canNext ? 'opacity-100' : 'pointer-events-none translate-x-2 opacity-0')}
      >
        <ChevronRight className="size-6" strokeWidth={1} />
      </button>
    </div>
  )
}
