import { products } from '@/data/products'
import type { Order, OrderDraft } from '@/types/order'
import type { Product } from '@/types/product'
import { readStorage, writeStorage } from '@/utils/storage'

/**
 * API simulée. Chaque fonction reproduit la signature d'un futur appel réseau
 * (latence comprise) : pour brancher un backend, remplacer le corps par un
 * `fetch('/api/…')` sans toucher aux composants.
 */

const LATENCY_MS = 450

function respond<T>(value: T, latency = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), latency)
  })
}

/** GET /api/products */
export function fetchProducts(): Promise<Product[]> {
  return respond(products)
}

/** POST /api/newsletter */
export async function subscribeToNewsletter(email: string): Promise<{ email: string; code: string }> {
  return respond({ email, code: 'BIENVENUE10' }, 900)
}

const ORDERS_KEY = 'orders'

function isOrderList(value: unknown): value is Order[] {
  return Array.isArray(value) && value.every((order) => typeof order === 'object' && order !== null && 'id' in order)
}

/** POST /api/orders — le paiement est simulé, aucune donnée bancaire n'est transmise. */
export async function submitOrder(draft: OrderDraft): Promise<Order> {
  const now = new Date()
  const order: Order = {
    ...draft,
    id: `BS-${now.getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`,
    createdAt: now.toISOString(),
    status: 'confirmée',
  }
  const orders = readStorage(ORDERS_KEY, [] as Order[], isOrderList)
  writeStorage(ORDERS_KEY, [order, ...orders].slice(0, 20))
  return respond(order, 1600)
}

/** GET /api/orders — historique local des commandes. */
export function loadOrders(): Order[] {
  return readStorage(ORDERS_KEY, [] as Order[], isOrderList)
}
