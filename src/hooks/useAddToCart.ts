import { useCallback } from 'react'
import type { Product } from '@/types/product'
import { useCart, useToast } from './useStore'

/** Ajout au panier + retour visuel (toast) — utilisé par les cartes et la fiche produit. */
export function useAddToCart() {
  const { addItem, openCart } = useCart()
  const { push } = useToast()

  return useCallback(
    (product: Product, quantity = 1) => {
      if (product.stock <= 0) {
        push({ tone: 'error', title: 'Produit épuisé', description: `${product.name} n’est plus disponible pour le moment.` })
        return
      }
      const { added, total } = addItem(product, quantity)
      if (added === 0) {
        push({
          tone: 'error',
          title: 'Quantité maximale atteinte',
          description: `Vous avez déjà ${total} × ${product.name} dans votre panier.`,
          action: { label: 'Voir le panier', onClick: openCart },
        })
        return
      }
      push({
        eyebrow: added < quantity ? `Ajouté au panier (${added} sur ${quantity}, stock limité)` : 'Ajouté au panier',
        title: product.name,
        description: `${product.brand} · ${product.volume}${added > 1 ? ` · × ${added}` : ''}`,
        image: product.image,
        imageAlt: `${product.name} — ${product.brand}`,
        action: { label: 'Voir le panier', onClick: openCart },
      })
    },
    [addItem, openCart, push],
  )
}
