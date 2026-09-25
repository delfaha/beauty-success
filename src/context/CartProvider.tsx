import { useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { MAX_QTY_PER_ITEM } from '@/config/shop'
import type { CartItem } from '@/types/cart'
import type { Product } from '@/types/product'
import { roundPrice } from '@/utils/format'
import { checkPromoCode } from '@/utils/pricing'
import { readStorage, storageKey, writeStorage } from '@/utils/storage'
import { CartContext, type CartContextValue } from './CartContext'

interface CartState {
  items: CartItem[]
  promoCode: string | null
}

type CartAction =
  | { type: 'add'; item: Omit<CartItem, 'quantity'>; quantity: number }
  | { type: 'remove'; productId: string }
  | { type: 'setQuantity'; productId: string; quantity: number }
  | { type: 'clear' }
  | { type: 'setPromo'; code: string | null }
  | { type: 'hydrate'; state: CartState }

const CART_KEY = 'cart'
const PROMO_KEY = 'promo'

function isCartItems(value: unknown): value is CartItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as CartItem).productId === 'string' &&
        typeof (item as CartItem).price === 'number' &&
        typeof (item as CartItem).quantity === 'number',
    )
  )
}

function isOptionalString(value: unknown): value is string | null {
  return value === null || typeof value === 'string'
}

function loadCart(): CartState {
  return {
    items: readStorage(CART_KEY, [] as CartItem[], isCartItems),
    promoCode: readStorage(PROMO_KEY, null as string | null, isOptionalString),
  }
}

const maxFor = (stock: number) => Math.max(0, Math.min(stock, MAX_QTY_PER_ITEM))

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const exists = state.items.some((item) => item.productId === action.item.productId)
      const items = exists
        ? state.items.map((item) =>
            item.productId === action.item.productId
              ? { ...item, ...action.item, quantity: Math.min(maxFor(action.item.stock), item.quantity + action.quantity) }
              : item,
          )
        : [...state.items, { ...action.item, quantity: Math.min(maxFor(action.item.stock), action.quantity) }]
      return { ...state, items }
    }
    case 'remove':
      return { ...state, items: state.items.filter((item) => item.productId !== action.productId) }
    case 'setQuantity':
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.productId === action.productId
              ? { ...item, quantity: Math.min(maxFor(item.stock), Math.max(0, Math.round(action.quantity))) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      }
    case 'clear':
      return { items: [], promoCode: null }
    case 'setPromo':
      return { ...state, promoCode: action.code }
    case 'hydrate':
      return action.state
  }
}

function toCartItem(product: Product): Omit<CartItem, 'quantity'> {
  return {
    productId: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    volume: product.volume,
    image: product.image,
    price: product.price,
    oldPrice: product.oldPrice,
    stock: product.stock,
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart)
  const [isOpen, setIsOpen] = useState(false)
  const [addCount, setAddCount] = useState(0)

  useEffect(() => writeStorage(CART_KEY, state.items), [state.items])
  useEffect(() => writeStorage(PROMO_KEY, state.promoCode), [state.promoCode])

  // Synchronisation entre onglets ouverts.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey(CART_KEY) || event.key === storageKey(PROMO_KEY)) {
        dispatch({ type: 'hydrate', state: loadCart() })
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const getQuantity = useCallback(
    (productId: string) => state.items.find((item) => item.productId === productId)?.quantity ?? 0,
    [state.items],
  )

  const addItem = useCallback<CartContextValue['addItem']>(
    (product, quantity = 1) => {
      const current = getQuantity(product.id)
      const added = Math.max(0, Math.min(quantity, maxFor(product.stock) - current))
      if (added > 0) {
        dispatch({ type: 'add', item: toCartItem(product), quantity: added })
        setAddCount((count) => count + 1)
      }
      return { added, total: current + added }
    },
    [getQuantity],
  )

  const subtotal = useMemo(
    () => roundPrice(state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)),
    [state.items],
  )

  const applyPromoCode = useCallback<CartContextValue['applyPromoCode']>(
    (code) => {
      const check = checkPromoCode(code, subtotal)
      if (check.ok) dispatch({ type: 'setPromo', code: check.promo.code })
      return check
    },
    [subtotal],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      promoCode: state.promoCode,
      isOpen,
      addCount,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem: (productId) => dispatch({ type: 'remove', productId }),
      restoreItem: ({ quantity, ...item }) => dispatch({ type: 'add', item, quantity }),
      updateQuantity: (productId, quantity) => dispatch({ type: 'setQuantity', productId, quantity }),
      clearCart: () => dispatch({ type: 'clear' }),
      getQuantity,
      applyPromoCode,
      removePromoCode: () => dispatch({ type: 'setPromo', code: null }),
    }),
    [state, subtotal, isOpen, addCount, addItem, getQuantity, applyPromoCode],
  )

  return <CartContext value={value}>{children}</CartContext>
}
