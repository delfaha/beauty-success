import type { ProductCategory } from './product'

/**
 * Ligne de panier : instantané du produit au moment de l'ajout, comme le
 * renverrait une API panier (prix, visuel, stock disponible).
 */
export interface CartItem {
  productId: string
  name: string
  brand: string
  category: ProductCategory
  volume: string
  image: string
  price: number
  oldPrice: number | null
  stock: number
  quantity: number
}

export interface AddToCartResult {
  /** Quantité réellement ajoutée (peut être limitée par le stock). */
  added: number
  /** Quantité totale de ce produit dans le panier après l'ajout. */
  total: number
}
