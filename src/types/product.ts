export type Gender = 'femme' | 'homme' | 'unisexe'

export type ProductCategory = 'eau-de-parfum' | 'eau-de-toilette' | 'parfum' | 'coffret' | 'brume'

export type OlfactoryFamily =
  | 'floral'
  | 'fruite'
  | 'oriental'
  | 'boise'
  | 'hesperide'
  | 'aromatique'
  | 'gourmand'
  | 'musque'
  | 'cuir'
  | 'aquatique'
  | 'chypre'

/** Pyramide olfactive : notes de tête, de cœur et de fond. */
export interface OlfactoryNotes {
  top: string[]
  heart: string[]
  base: string[]
}

/**
 * Produit du catalogue. Le format est pensé pour être renvoyé tel quel par une
 * future API : `image` / `images` sont des URL (ou, en local, des références
 * `art:<id>/<vue>` rendues par le générateur de visuels SVG).
 */
export interface Product {
  id: string
  sku: string
  name: string
  brand: string
  category: ProductCategory
  gender: Gender
  price: number
  oldPrice: number | null
  /** Réduction en pourcentage (ex. 20 pour −20 %). */
  discount: number | null
  volume: string
  description: string
  notes: OlfactoryNotes
  family: OlfactoryFamily
  image: string
  images: string[]
  isNew: boolean
  isBestSeller: boolean
  isPromotion: boolean
  stock: number
  rating: number
  reviewCount: number
  /** Date de sortie ISO (tri « Nouveautés »). */
  releaseDate: string
  /** Indice de ventes (tri « Meilleures ventes »). */
  popularity: number
  /** Contenu détaillé des coffrets. */
  contents?: string[]
}

export interface Brand {
  slug: string
  name: string
  tagline: string
  description: string
  origin: string
  founded: number
}
