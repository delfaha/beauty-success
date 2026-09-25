import { createContext } from 'react'

export interface FavoritesContextValue {
  ids: string[]
  count: number
  isFavorite: (productId: string) => boolean
  /** Ajoute ou retire le produit ; renvoie `true` s'il est désormais en favori. */
  toggle: (productId: string) => boolean
  remove: (productId: string) => void
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null)
