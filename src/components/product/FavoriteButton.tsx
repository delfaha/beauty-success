import { Heart } from 'lucide-react'
import { useState } from 'react'
import { useFavorites, useToast } from '@/hooks/useStore'
import type { Product } from '@/types/product'
import { cn } from '@/utils/cn'

interface FavoriteButtonProps {
  product: Pick<Product, 'id' | 'name' | 'image' | 'brand'>
  className?: string
  variant?: 'floating' | 'outline'
}

export function FavoriteButton({ product, className, variant = 'floating' }: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites()
  const { push } = useToast()
  const [pulse, setPulse] = useState(0)
  const active = isFavorite(product.id)

  const onClick = () => {
    const added = toggle(product.id)
    setPulse((value) => value + 1)
    push({
      eyebrow: added ? 'Ajouté à vos favoris' : 'Retiré de vos favoris',
      title: product.name,
      description: product.brand,
      image: product.image,
      imageAlt: product.name,
      duration: 3000,
      action: added ? { label: 'Voir mes favoris', to: '/favoris' } : undefined,
    })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`}
      data-cursor=""
      className={cn(
        'grid shrink-0 place-items-center transition-colors duration-300',
        variant === 'floating'
          ? 'z-10 size-10 bg-bone/0 hover:bg-bone'
          : 'size-14 border border-ink hover:bg-ink hover:text-bone',
        className,
      )}
    >
      <Heart
        key={pulse}
        className={cn('size-5', pulse > 0 && 'animate-pop', active && 'fill-current')}
        strokeWidth={1.25}
        aria-hidden="true"
      />
    </button>
  )
}
