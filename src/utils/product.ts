import { LOW_STOCK_THRESHOLD } from '@/config/shop'
import { CATEGORY_LABELS } from '@/data/taxonomy'
import type { Gender, Product } from '@/types/product'
import { slugify } from './text'

export type StockTone = 'available' | 'low' | 'out'

export function stockStatus(stock: number): { tone: StockTone; label: string } {
  if (stock <= 0) return { tone: 'out', label: 'Épuisé' }
  if (stock <= LOW_STOCK_THRESHOLD) return { tone: 'low', label: `Plus que ${stock} en stock` }
  return { tone: 'available', label: 'En stock — expédié sous 24 h' }
}

export function isAvailable(product: Pick<Product, 'stock'>): boolean {
  return product.stock > 0
}

export function productPath(id: string): string {
  return `/product/${id}`
}

export function brandSlug(brand: string): string {
  return slugify(brand)
}

export function productTypeLabel(product: Pick<Product, 'category' | 'volume'>): string {
  return `${CATEGORY_LABELS[product.category]} · ${product.volume}`
}

/** Collection naturelle d'un produit, pour le fil d'Ariane. */
export function primaryCollection(product: Pick<Product, 'category' | 'gender'>): { slug: string; label: string } {
  if (product.category === 'coffret') return { slug: 'coffrets', label: 'Coffrets' }
  const labels: Record<Gender, string> = {
    femme: 'Parfums Femme',
    homme: 'Parfums Homme',
    unisexe: 'Unisexe',
  }
  return { slug: product.gender, label: labels[product.gender] }
}

/** Produits proches : même famille ou même genre, triés par proximité puis popularité. */
export function similarProducts(product: Product, catalog: Product[], limit = 8): Product[] {
  return catalog
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => {
      let score = 0
      if (candidate.family === product.family) score += 3
      if (candidate.gender === product.gender) score += 2
      if (candidate.brand === product.brand) score += 1
      if (candidate.category === product.category) score += 1
      return { candidate, score }
    })
    .filter(({ score }) => score >= 3)
    .sort((a, b) => b.score - a.score || b.candidate.popularity - a.candidate.popularity)
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}
