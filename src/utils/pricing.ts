import {
  DEFAULT_SHIPPING_METHOD,
  PROMO_CODES,
  SHIPPING_METHODS,
  type PromoCode,
  type ShippingMethod,
  type ShippingMethodId,
} from '@/config/shop'
import type { CartItem } from '@/types/cart'
import type { OrderTotals } from '@/types/order'
import { roundPrice } from './format'

export function getShippingMethod(id: ShippingMethodId = DEFAULT_SHIPPING_METHOD): ShippingMethod {
  return SHIPPING_METHODS.find((method) => method.id === id) ?? SHIPPING_METHODS[0]
}

export function shippingCost(method: ShippingMethod, subtotal: number): number {
  if (subtotal <= 0) return 0
  if (method.freeFrom !== null && subtotal >= method.freeFrom) return 0
  return method.price
}

export function findPromoCode(code: string | null | undefined): PromoCode | undefined {
  if (!code) return undefined
  const normalized = code.trim().toUpperCase()
  return PROMO_CODES.find((promo) => promo.code === normalized)
}

export type PromoCheck =
  | { ok: true; promo: PromoCode }
  | { ok: false; reason: string }

export function checkPromoCode(code: string, subtotal: number): PromoCheck {
  const promo = findPromoCode(code)
  if (!promo) return { ok: false, reason: 'Ce code n’existe pas ou a expiré.' }
  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return { ok: false, reason: `Ce code est valable dès ${promo.minSubtotal} € d’achat.` }
  }
  return { ok: true, promo }
}

export function computeTotals(
  items: CartItem[],
  options: { shippingMethod?: ShippingMethodId; promoCode?: string | null } = {},
): OrderTotals {
  const subtotal = roundPrice(items.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const savings = roundPrice(
    items.reduce((sum, item) => sum + (item.oldPrice ? (item.oldPrice - item.price) * item.quantity : 0), 0),
  )
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const promo = findPromoCode(options.promoCode)
  const promoValid = promo && (!promo.minSubtotal || subtotal >= promo.minSubtotal)
  const discount = promoValid ? roundPrice((subtotal * promo.percent) / 100) : 0
  const shipping = shippingCost(getShippingMethod(options.shippingMethod), subtotal)
  const total = roundPrice(subtotal - discount + shipping)
  return { subtotal, discount, shipping, total, savings, itemCount }
}
