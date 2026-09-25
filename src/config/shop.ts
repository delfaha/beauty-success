/** Règles commerciales de la boutique (centralisées pour être faciles à ajuster). */

export const CURRENCY = 'EUR'
export const FREE_SHIPPING_THRESHOLD = 60
export const PAGE_SIZE = 12
export const MAX_QTY_PER_ITEM = 10
export const LOW_STOCK_THRESHOLD = 5
export const FREE_SAMPLES = 2

export type ShippingMethodId = 'standard' | 'relais' | 'express' | 'boutique'

export interface ShippingMethod {
  id: ShippingMethodId
  label: string
  description: string
  price: number
  /** Seuil de gratuité (null : jamais offert). */
  freeFrom: number | null
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    label: 'Livraison à domicile',
    description: 'Colissimo — 2 à 4 jours ouvrés',
    price: 4.9,
    freeFrom: FREE_SHIPPING_THRESHOLD,
  },
  {
    id: 'relais',
    label: 'Point relais',
    description: 'Mondial Relay — 3 à 5 jours ouvrés',
    price: 3.9,
    freeFrom: FREE_SHIPPING_THRESHOLD,
  },
  {
    id: 'express',
    label: 'Express 24 h',
    description: 'Commandé avant 13 h, livré demain',
    price: 9.9,
    freeFrom: null,
  },
  {
    id: 'boutique',
    label: 'Retrait en boutique',
    description: 'Gratuit — prêt sous 2 h dans votre parfumerie',
    price: 0,
    freeFrom: null,
  },
]

export const DEFAULT_SHIPPING_METHOD: ShippingMethodId = 'standard'

export interface PromoCode {
  code: string
  label: string
  percent: number
  minSubtotal?: number
}

export const PROMO_CODES: PromoCode[] = [
  { code: 'BIENVENUE10', label: '−10 % sur votre commande', percent: 10 },
  { code: 'SILLAGE15', label: '−15 % dès 100 € d’achat', percent: 15, minSubtotal: 100 },
]

export const COUNTRIES = ['France', 'Belgique', 'Suisse', 'Luxembourg', 'Monaco'] as const
