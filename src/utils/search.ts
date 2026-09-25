import { CATEGORY_LABELS, FAMILY_LABELS, GENDER_LABELS } from '@/data/taxonomy'
import type { Gender, Product, ProductCategory } from '@/types/product'
import { normalizeText } from './text'

/**
 * Moteur de recherche côté client.
 * - insensible à la casse, aux accents et aux pluriels simples ;
 * - tolère une faute de frappe (distance de Levenshtein) ;
 * - pondère les champs : nom > marque > famille > catégorie/genre > notes > description ;
 * - tous les mots de la requête doivent correspondre (ET logique).
 * À remplacer par un appel API (Algolia, Meilisearch, Elasticsearch…) en production.
 */

const STOPWORDS = new Set([
  'de', 'du', 'des', 'la', 'le', 'les', 'l', 'd', 'pour', 'un', 'une', 'et', 'a', 'au', 'aux',
  'en', 'avec', 'sur', 'mon', 'ma', 'mes', 'son', 'sa', 'ses', 'the', 'for', 'of',
])

const GENDER_SYNONYMS: Record<Gender, string> = {
  femme: 'femme feminin feminine elle women woman her',
  homme: 'homme masculin lui men man him',
  unisexe: 'unisexe mixte unisex partage',
}

const CATEGORY_SYNONYMS: Record<ProductCategory, string> = {
  'eau-de-parfum': 'edp',
  'eau-de-toilette': 'edt',
  parfum: 'extrait',
  coffret: 'coffret cadeau gift set box ecrin offrir',
  brume: 'brume mist cheveux corps',
}

interface IndexedField {
  tokens: string[]
  weight: number
}

interface IndexedProduct {
  product: Product
  fields: IndexedField[]
  phrases: string[]
}

export interface SearchResult {
  product: Product
  score: number
}

function stem(word: string): string {
  return word.length > 3 && /[sx]$/.test(word) ? word.slice(0, -1) : word
}

function tokenize(text: string): string[] {
  return normalizeText(text).split(' ').filter(Boolean).map(stem)
}

function field(text: string, weight: number): IndexedField {
  return { tokens: tokenize(text), weight }
}

function indexProduct(product: Product): IndexedProduct {
  const flags = [
    product.isNew && 'nouveau nouveaute new',
    product.isPromotion && 'promo promotion solde reduction offre',
    product.isBestSeller && 'best seller meilleure vente populaire',
    product.price >= 100 && 'luxe prestige',
    product.price < 60 && 'petit prix accessible',
  ]
    .filter(Boolean)
    .join(' ')
  const notes = [...product.notes.top, ...product.notes.heart, ...product.notes.base].join(' ')

  return {
    product,
    phrases: [normalizeText(product.name), normalizeText(product.brand), normalizeText(CATEGORY_LABELS[product.category])],
    fields: [
      field(product.name, 10),
      field(product.brand, 8),
      field(FAMILY_LABELS[product.family], 5),
      field(`${CATEGORY_LABELS[product.category]} ${CATEGORY_SYNONYMS[product.category]} parfum`, 4),
      field(`${GENDER_LABELS[product.gender]} ${GENDER_SYNONYMS[product.gender]}`, 4),
      // Un parfum unisexe convient aussi aux recherches « homme » ou « femme », avec un poids moindre.
      field(product.gender === 'unisexe' ? 'homme femme' : '', 1),
      field(notes, 3),
      field(`${flags} ${product.volume} ${(product.contents ?? []).join(' ')}`, 2),
      field(product.description, 1),
    ],
  }
}

/** Distance de Levenshtein bornée (renvoie max + 1 dès que la borne est dépassée). */
function levenshtein(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      const value = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost)
      current.push(value)
      rowMin = Math.min(rowMin, value)
    }
    if (rowMin > max) return max + 1
    previous = current
  }
  return previous[b.length]
}

/** Poids minimal d'un champ pour accepter une correspondance approximative (évite « comme » → « homme »). */
const FUZZY_MIN_WEIGHT = 3

function scoreToken(query: string, target: IndexedField): number {
  let best = 0
  const fuzzy = query.length >= 4 && target.weight >= FUZZY_MIN_WEIGHT
  const tolerance = query.length >= 8 ? 2 : 1
  for (const token of target.tokens) {
    if (token === query) return target.weight
    if (query.length >= 2 && token.startsWith(query)) {
      best = Math.max(best, target.weight * 0.75)
    } else if (fuzzy && token[0] === query[0] && levenshtein(query, token, tolerance) <= tolerance) {
      best = Math.max(best, target.weight * 0.45)
    }
  }
  return best
}

let indexCache: { source: Product[]; index: IndexedProduct[] } | null = null

function getIndex(products: Product[]): IndexedProduct[] {
  if (indexCache?.source !== products) {
    indexCache = { source: products, index: products.map(indexProduct) }
  }
  return indexCache.index
}

export function queryTokens(query: string): string[] {
  return normalizeText(query)
    .split(' ')
    .filter((token) => token && !STOPWORDS.has(token))
    .map(stem)
}

export function searchProducts(products: Product[], query: string): SearchResult[] {
  const phrase = normalizeText(query)
  const tokens = queryTokens(query)
  if (!tokens.length) return []

  const results: SearchResult[] = []
  for (const entry of getIndex(products)) {
    let score = 0
    let matchesAll = true
    for (const token of tokens) {
      let best = 0
      for (const target of entry.fields) best = Math.max(best, scoreToken(token, target))
      if (best === 0) {
        matchesAll = false
        break
      }
      score += best
    }
    if (!matchesAll) continue
    if (entry.phrases[0].includes(phrase)) score += 12
    else if (entry.phrases.some((candidate) => candidate.includes(phrase))) score += 6
    results.push({ product: entry.product, score: score + entry.product.popularity / 1000 })
  }
  return results.sort((a, b) => b.score - a.score)
}
