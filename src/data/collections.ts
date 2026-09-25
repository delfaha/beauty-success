import type { FacetKey, SortKey } from '@/types/catalog'
import type { Product } from '@/types/product'

/** Pages catégorie accessibles via /shop/:slug. */
export interface Collection {
  slug: string
  title: string
  /** Libellé court (fil d'Ariane, liens). */
  label: string
  eyebrow: string
  description: string
  seoTitle: string
  seoDescription: string
  filter: (product: Product) => boolean
  hiddenFacets?: FacetKey[]
  defaultSort?: SortKey
  /** Produit mis en avant dans l'en-tête de la page. */
  heroProductId: string
}

export const collections: Collection[] = [
  {
    slug: 'femme',
    title: 'Parfums Femme',
    label: 'Parfums Femme',
    eyebrow: 'Collection femme',
    description:
      'Floraux lumineux, orientaux envoûtants, gourmands addictifs : notre sélection de parfums pour femme, des grandes maisons aux créations d’auteur.',
    seoTitle: 'Parfums femme — eaux de parfum, eaux de toilette & coffrets',
    seoDescription:
      'Découvrez nos parfums pour femme : eaux de parfum, eaux de toilette, extraits et brumes. Livraison offerte dès 60 € et échantillons offerts.',
    filter: (p) => p.gender === 'femme',
    hiddenFacets: ['genre'],
    heroProductId: 'tubereuse-interdite',
  },
  {
    slug: 'homme',
    title: 'Parfums Homme',
    label: 'Parfums Homme',
    eyebrow: 'Collection homme',
    description:
      'Boisés fumés, fougères aromatiques, cuirs patinés et fraîcheurs marines : des signatures masculines taillées pour chaque moment.',
    seoTitle: 'Parfums homme — boisés, frais, cuirs & coffrets',
    seoDescription:
      'Parfums pour homme : eaux de parfum, eaux de toilette et extraits. Boisés, aromatiques, marins ou orientaux. Livraison offerte dès 60 €.',
    filter: (p) => p.gender === 'homme',
    hiddenFacets: ['genre'],
    heroProductId: 'cedre-fume',
  },
  {
    slug: 'unisexe',
    title: 'Parfums Unisexe',
    label: 'Unisexe',
    eyebrow: 'Sans étiquette',
    description:
      'Des sillages qui se partagent : santal crémeux, thé fumé, muscs aériens et agrumes solaires, à porter sans se poser de question.',
    seoTitle: 'Parfums unisexe — des sillages à partager',
    seoDescription:
      'Sélection de parfums unisexes et mixtes : boisés, musqués, hespéridés et orientaux. Échantillons offerts à chaque commande.',
    filter: (p) => p.gender === 'unisexe',
    hiddenFacets: ['genre'],
    heroProductId: 'the-noir-fume',
  },
  {
    slug: 'coffrets',
    title: 'Coffrets Parfum',
    label: 'Coffrets',
    eyebrow: 'L’art d’offrir',
    description:
      'Des écrins prêts à offrir : eaux de parfum et soins parfumés, miniatures à découvrir, éditions limitées. Emballage cadeau et carte personnalisée offerts.',
    seoTitle: 'Coffrets parfum — coffrets cadeaux femme, homme & découverte',
    seoDescription:
      'Coffrets parfum pour elle et pour lui, coffrets découverte et éditions limitées. Emballage cadeau offert, livraison offerte dès 60 €.',
    filter: (p) => p.category === 'coffret',
    hiddenFacets: ['type'],
    heroProductId: 'coffret-nuit-nocturne',
  },
  {
    slug: 'nouveautes',
    title: 'Nouveautés',
    label: 'Nouveautés',
    eyebrow: 'Automne 2026',
    description:
      'Les dernières créations de nos maisons, fraîchement arrivées en parfumerie. Soyez les premiers à les porter.',
    seoTitle: 'Nouveautés parfum — les dernières sorties',
    seoDescription:
      'Toutes les nouveautés parfum de la saison : nouveaux extraits, eaux de parfum et coffrets en édition limitée.',
    filter: (p) => p.isNew,
    defaultSort: 'nouveautes',
    heroProductId: 'cuir-sepia',
  },
  {
    slug: 'promotions',
    title: 'Promotions',
    label: 'Promotions',
    eyebrow: 'Offre d’automne',
    description:
      'Jusqu’à −30 % sur une sélection de parfums et de coffrets, dans la limite des stocks disponibles.',
    seoTitle: 'Promotions parfum — jusqu’à −30 %',
    seoDescription:
      'Parfums et coffrets en promotion jusqu’à −30 %. Offres limitées dans la limite des stocks disponibles.',
    filter: (p) => p.isPromotion,
    heroProductId: 'figue-sauvage',
  },
  {
    slug: 'meilleures-ventes',
    title: 'Meilleures ventes',
    label: 'Meilleures ventes',
    eyebrow: 'Les incontournables',
    description:
      'Les parfums préférés de notre communauté, plébiscités pour leur sillage et leur tenue.',
    seoTitle: 'Meilleures ventes parfum — les incontournables',
    seoDescription:
      'Les parfums les plus vendus sur Beauty Success : eaux de parfum, eaux de toilette et coffrets plébiscités.',
    filter: (p) => p.isBestSeller,
    defaultSort: 'meilleures-ventes',
    heroProductId: 'vanille-brulee',
  },
  {
    slug: 'luxe',
    title: 'Parfums de luxe',
    label: 'Parfums de luxe',
    eyebrow: 'Haute parfumerie',
    description:
      'Extraits rares, matières d’exception et eaux de parfum de prestige, à partir de 100 €.',
    seoTitle: 'Parfums de luxe — extraits et eaux de parfum d’exception',
    seoDescription:
      'Sélection de parfums de luxe et d’extraits de haute parfumerie à partir de 100 €. Livraison offerte.',
    filter: (p) => p.price >= 100,
    heroProductId: 'oud-ombre',
  },
  {
    slug: 'accessibles',
    title: 'Parfums accessibles',
    label: 'Petits prix',
    eyebrow: 'Moins de 60 €',
    description:
      'De belles signatures à moins de 60 € : eaux de toilette, brumes et coffrets pour se faire plaisir sans compter.',
    seoTitle: 'Parfums pas chers — moins de 60 €',
    seoDescription:
      'Parfums à petits prix : eaux de toilette, brumes et coffrets à moins de 60 €. Échantillons offerts.',
    filter: (p) => p.price < 60,
    heroProductId: 'poivre-rose',
  },
]

export function getCollection(slug: string | undefined): Collection | undefined {
  return collections.find((collection) => collection.slug === slug)
}
