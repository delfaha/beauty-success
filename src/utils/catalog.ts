import { brands } from '@/data/brands'
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  FACET_LABELS,
  FACET_ORDER,
  FAMILY_LABELS,
  GENDER_LABELS,
  GENDER_ORDER,
  PRICE_RANGES,
  SORT_OPTIONS,
} from '@/data/taxonomy'
import type { CatalogFilters, Facet, FacetKey, SortKey } from '@/types/catalog'
import type { Product } from '@/types/product'
import { brandSlug } from './product'

export const EMPTY_FILTERS: CatalogFilters = {
  genre: [],
  type: [],
  marque: [],
  prix: [],
  famille: [],
  dispo: false,
}

export function priceRangeOf(price: number): string {
  return PRICE_RANGES.find((range) => price >= range.min && price < range.max)?.id ?? 'plus-150'
}

function facetValue(product: Product, key: FacetKey): string {
  switch (key) {
    case 'genre':
      return product.gender
    case 'type':
      return product.category
    case 'marque':
      return brandSlug(product.brand)
    case 'prix':
      return priceRangeOf(product.price)
    case 'famille':
      return product.family
  }
}

/** Filtre le catalogue. `except` permet de calculer les compteurs d'une facette sans elle-même. */
export function applyFilters(products: Product[], filters: CatalogFilters, except?: FacetKey): Product[] {
  return products.filter((product) => {
    if (filters.dispo && product.stock <= 0) return false
    return FACET_ORDER.every(
      (key) => key === except || filters[key].length === 0 || filters[key].includes(facetValue(product, key)),
    )
  })
}

const byLabel = (a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label, 'fr')

function optionsFor(key: FacetKey): { value: string; label: string }[] {
  switch (key) {
    case 'genre':
      return GENDER_ORDER.map((value) => ({ value, label: GENDER_LABELS[value] }))
    case 'type':
      return CATEGORY_ORDER.map((value) => ({ value, label: CATEGORY_LABELS[value] }))
    case 'marque':
      return brands.map((brand) => ({ value: brand.slug, label: brand.name })).sort(byLabel)
    case 'prix':
      return PRICE_RANGES.map((range) => ({ value: range.id, label: range.label }))
    case 'famille':
      return Object.entries(FAMILY_LABELS)
        .map(([value, label]) => ({ value, label }))
        .sort(byLabel)
  }
}

export function optionLabel(key: FacetKey, value: string): string {
  return optionsFor(key).find((option) => option.value === value)?.label ?? value
}

/** Facettes avec compteurs dynamiques (chaque compteur tient compte des autres filtres actifs). */
export function buildFacets(products: Product[], filters: CatalogFilters, hidden: FacetKey[] = []): Facet[] {
  return FACET_ORDER.filter((key) => !hidden.includes(key))
    .map((key) => {
      const pool = applyFilters(products, filters, key)
      const counts = new Map<string, number>()
      for (const product of pool) {
        const value = facetValue(product, key)
        counts.set(value, (counts.get(value) ?? 0) + 1)
      }
      const present = new Set(products.map((product) => facetValue(product, key)))
      const options = optionsFor(key)
        .filter((option) => present.has(option.value) || filters[key].includes(option.value))
        .map((option) => ({
          ...option,
          count: counts.get(option.value) ?? 0,
          selected: filters[key].includes(option.value),
        }))
      return { key, label: FACET_LABELS[key], options }
    })
    .filter((facet) => facet.options.length > 1 || facet.options.some((option) => option.selected))
}

export function sortProducts(list: Product[], sort: SortKey, relevance?: Map<string, number>): Product[] {
  const sorted = [...list]
  switch (sort) {
    case 'prix-croissant':
      return sorted.sort((a, b) => a.price - b.price)
    case 'prix-decroissant':
      return sorted.sort((a, b) => b.price - a.price)
    case 'nouveautes':
      return sorted.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    case 'meilleures-ventes':
      return sorted.sort((a, b) => b.popularity - a.popularity)
    case 'mieux-notes':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    case 'pertinence':
      if (relevance) return sorted.sort((a, b) => (relevance.get(b.id) ?? 0) - (relevance.get(a.id) ?? 0))
      // Ordre éditorial conservé, produits disponibles en premier.
      return sorted.sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0))
  }
}

export function isSortKey(value: string | null): value is SortKey {
  return SORT_OPTIONS.some((option) => option.value === value)
}

export function parseFilters(params: URLSearchParams): CatalogFilters {
  const list = (key: FacetKey) =>
    (params.get(key) ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  return {
    genre: list('genre'),
    type: list('type'),
    marque: list('marque'),
    prix: list('prix'),
    famille: list('famille'),
    dispo: params.get('dispo') === '1',
  }
}

export function countActiveFilters(filters: CatalogFilters): number {
  return FACET_ORDER.reduce((count, key) => count + filters[key].length, 0) + (filters.dispo ? 1 : 0)
}
