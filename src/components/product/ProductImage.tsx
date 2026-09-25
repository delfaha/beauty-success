import { useState } from 'react'
import { PerfumeArt } from '@/components/art/PerfumeArt'
import type { ArtView } from '@/types/art'
import { cn } from '@/utils/cn'

const ART_PATTERN = /^art:([a-z0-9-]+)\/(front|noir|detail|pack)$/

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  /** Chargement prioritaire (au-dessus de la ligne de flottaison). */
  priority?: boolean
  /** Animation continue du visuel généré. */
  live?: boolean
}

/**
 * Affiche un visuel produit : les références `art:<id>/<vue>` sont rendues par
 * le générateur SVG, toute autre valeur est traitée comme une URL d'image
 * (fondu à l'apparition, chargement différé).
 */
export function ProductImage({ src, alt, className, priority = false, live = false }: ProductImageProps) {
  const match = ART_PATTERN.exec(src)
  if (match) {
    return <PerfumeArt id={match[1]} view={match[2] as ArtView} title={alt} className={className} live={live} />
  }
  return <RemoteImage src={src} alt={alt} className={className} priority={priority} />
}

function RemoteImage({ src, alt, className, priority }: Omit<ProductImageProps, 'live'>) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={cn(
        'h-full w-full object-cover transition-opacity duration-700',
        loaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  )
}
