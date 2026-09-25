import { createContext } from 'react'
import type { AddToCartResult, CartItem } from '@/types/cart'
import type { Product } from '@/types/product'
import type { PromoCheck } from '@/utils/pricing'

export interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  promoCode: string | null
  isOpen: boolean
  /** Incrémenté à chaque ajout — sert à animer l'icône du panier. */
  addCount: number
  openCart: () => void
  closeCart: () => void
  addItem: (product: Product, quantity?: number) => AddToCartResult
  removeItem: (productId: string) => void
  /** Réinsère une ligne supprimée (bouton « Annuler »). */
  restoreItem: (item: CartItem) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getQuantity: (productId: string) => number
  applyPromoCode: (code: string) => PromoCheck
  removePromoCode: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
