import type { Gender, OlfactoryFamily, ProductCategory } from '@/types/product'
import type { FacetKey, SortKey } from '@/types/catalog'

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  'eau-de-parfum': 'Eau de parfum',
  'eau-de-toilette': 'Eau de toilette',
  parfum: 'Parfum',
  coffret: 'Coffret',
  brume: 'Brume',
}

export const CATEGORY_ORDER: ProductCategory[] = [
  'eau-de-parfum',
  'eau-de-toilette',
  'parfum',
  'coffret',
  'brume',
]

/** Concentration indicative, affichée dans les informations produit. */
export const CATEGORY_CONCENTRATION: Record<ProductCategory, string> = {
  'eau-de-parfum': '15 à 20 % de concentré',
  'eau-de-toilette': '8 à 12 % de concentré',
  parfum: '20 à 30 % de concentré (extrait)',
  coffret: 'Selon les produits du coffret',
  brume: '2 à 4 % de concentré',
}

export const GENDER_LABELS: Record<Gender, string> = {
  femme: 'Femme',
  homme: 'Homme',
  unisexe: 'Unisexe',
}

export const GENDER_ORDER: Gender[] = ['femme', 'homme', 'unisexe']

export const FAMILY_LABELS: Record<OlfactoryFamily, string> = {
  floral: 'Floral',
  fruite: 'Fruité',
  oriental: 'Oriental',
  boise: 'Boisé',
  hesperide: 'Hespéridé',
  aromatique: 'Aromatique',
  gourmand: 'Gourmand',
  musque: 'Musqué',
  cuir: 'Cuir',
  aquatique: 'Aquatique',
  chypre: 'Chypré',
}

export const FAMILY_DESCRIPTIONS: Record<OlfactoryFamily, string> = {
  floral: 'Bouquets de fleurs fraîches ou opulentes : rose, jasmin, pivoine, tubéreuse.',
  fruite: 'Des fruits juteux et gourmands qui apportent éclat et gaieté.',
  oriental: 'Ambre, vanille, épices et résines pour des sillages chauds et sensuels.',
  boise: 'Cèdre, santal, vétiver : des bois secs, fumés ou crémeux.',
  hesperide: 'Les agrumes — bergamote, citron, orange — pour une fraîcheur pétillante.',
  aromatique: 'Herbes et plantes aromatiques : lavande, sauge, romarin, thé.',
  gourmand: 'Notes de desserts et de douceurs : vanille, caramel, café, fève tonka.',
  musque: 'Des muscs blancs et poudrés, doux comme une peau propre.',
  cuir: 'Des accords de cuir fumés, souples ou patinés.',
  aquatique: 'Accords marins et aériens : embruns, pluie, bois flotté.',
  chypre: 'Le contraste de la bergamote, de la mousse de chêne et du patchouli.',
}

export interface PriceRange {
  id: string
  label: string
  min: number
  max: number
}

export const PRICE_RANGES: PriceRange[] = [
  { id: 'moins-50', label: 'Moins de 50 €', min: 0, max: 50 },
  { id: '50-100', label: '50 – 100 €', min: 50, max: 100 },
  { id: '100-150', label: '100 – 150 €', min: 100, max: 150 },
  { id: 'plus-150', label: 'Plus de 150 €', min: 150, max: Number.POSITIVE_INFINITY },
]

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'pertinence', label: 'Pertinence' },
  { value: 'meilleures-ventes', label: 'Meilleures ventes' },
  { value: 'nouveautes', label: 'Nouveautés' },
  { value: 'prix-croissant', label: 'Prix croissant' },
  { value: 'prix-decroissant', label: 'Prix décroissant' },
  { value: 'mieux-notes', label: 'Mieux notés' },
]

export const FACET_LABELS: Record<FacetKey, string> = {
  genre: 'Genre',
  type: 'Catégorie',
  marque: 'Marque',
  prix: 'Prix',
  famille: 'Famille olfactive',
}

export const FACET_ORDER: FacetKey[] = ['genre', 'type', 'marque', 'prix', 'famille']
