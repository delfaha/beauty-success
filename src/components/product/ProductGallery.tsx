import { useRef, useState, type PointerEvent } from 'react'
import type { Product } from '@/types/product'
import { cn } from '@/utils/cn'
import { hasFinePointer } from '@/utils/motion'
import { ProductImage } from './ProductImage'

const VIEW_LABELS = ['Vue studio', 'Vue en clair-obscur', 'Détail de l’étiquette', 'Avec son étui']

/**
 * Galerie produit : vignettes verticales (desktop) + grand visuel avec zoom
 * qui suit la souris ; sur mobile, défilement horizontal avec compteur.
 */
export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const [slide, setSlide] = useState(0)
  const images = product.images.length ? product.images : [product.image]
  const alt = (index: number) => `${product.name} de ${product.brand} — ${VIEW_LABELS[index] ?? `vue ${index + 1}`}`

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current
    if (!stage || event.pointerType !== 'mouse') return
    const rect = stage.getBoundingClientRect()
    stage.style.setProperty('--zx', `${((event.clientX - rect.left) / rect.width) * 100}%`)
    stage.style.setProperty('--zy', `${((event.clientY - rect.top) / rect.height) * 100}%`)
  }

  const onTrackScroll = () => {
    const track = trackRef.current
    if (!track) return
    setSlide(Math.round(track.scrollLeft / track.clientWidth))
  }

  return (
    <div>
      {/* Mobile : carrousel plein écran */}
      <div className="relative -mx-4 md:hidden">
        <ul
          ref={trackRef}
          onScroll={onTrackScroll}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto"
          aria-label="Visuels du produit"
        >
          {images.map((src, index) => (
            <li key={src} className="aspect-[4/5] w-full shrink-0 snap-center bg-sand">
              <ProductImage src={src} alt={alt(index)} priority={index === 0} />
            </li>
          ))}
        </ul>
        <p className="absolute bottom-3 right-4 bg-bone px-2 py-1 label-caps tabular" aria-live="polite">
          {slide + 1} / {images.length}
        </p>
      </div>

      {/* Desktop : vignettes + visuel principal zoomable */}
      <div className="hidden gap-2.5 md:grid md:grid-cols-[4.5rem_1fr] lg:grid-cols-[5.5rem_1fr]">
        <ul className="flex flex-col gap-2.5" aria-label="Choisir un visuel">
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                onPointerEnter={() => setActive(index)}
                aria-label={`Afficher : ${VIEW_LABELS[index] ?? `vue ${index + 1}`}`}
                aria-pressed={active === index}
                className={cn(
                  'relative block aspect-[4/5] w-full overflow-hidden bg-sand outline-offset-2 transition-opacity duration-300',
                  active === index ? 'opacity-100 ring-1 ring-ink' : 'opacity-55 hover:opacity-100',
                )}
              >
                <ProductImage src={src} alt="" />
              </button>
            </li>
          ))}
        </ul>
        <div
          ref={stageRef}
          className="art-host relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-sand"
          onPointerEnter={() => setZoom(hasFinePointer())}
          onPointerLeave={() => setZoom(false)}
          onPointerMove={onMove}
          data-cursor="Zoom"
        >
          {images.map((src, index) => (
            <div
              key={src}
              className={cn(
                'absolute inset-0 transition-[opacity,clip-path] duration-700 ease-quart',
                index === active ? 'opacity-100 [clip-path:inset(0_0_0_0)]' : 'opacity-0 [clip-path:inset(0_0_0_100%)]',
              )}
              aria-hidden={index !== active}
            >
              <div
                className="h-full w-full transition-transform duration-500 ease-expo"
                style={{
                  transform: zoom && index === active ? 'scale(1.9)' : 'scale(1)',
                  transformOrigin: 'var(--zx, 50%) var(--zy, 50%)',
                }}
              >
                <ProductImage src={src} alt={alt(index)} priority={index === 0} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
