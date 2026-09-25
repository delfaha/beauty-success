import type { ShippingMethodId } from '@/config/shop'
import type { CartItem } from './cart'

export type PaymentMethod = 'card' | 'paypal' | 'applepay'

export interface ShippingAddress {
  firstName: string
  lastName: string
  address: string
  address2: string
  postalCode: string
  city: string
  country: string
  phone: string
}

export interface OrderTotals {
  subtotal: number
  discount: number
  shipping: number
  total: number
  savings: number
  itemCount: number
}

export interface OrderDraft {
  email: string
  address: ShippingAddress
  shippingMethod: ShippingMethodId
  paymentMethod: PaymentMethod
  items: CartItem[]
  promoCode: string | null
  totals: OrderTotals
}

export interface Order extends OrderDraft {
  id: string
  createdAt: string
  status: 'confirmée' | 'en préparation' | 'expédiée'
}
