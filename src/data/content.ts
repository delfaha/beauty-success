import type { NavLink } from './navigation'

/* ------------------------------------------------------------------ Hero -- */
export interface HeroSlide {
  id: string
  eyebrow: string
  title: string
  text: string
  cta: NavLink
  secondary?: NavLink
  /** Visuel (URL d'image ou référence `art:` du générateur). */
  image: string
  caption: string
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'nouveautes',
    eyebrow: 'Nouvelle collection — Automne 2026',
    title: 'L’art du\nsillage',
    text: 'Tubéreuse Interdite, le nouvel extrait du Jardin Noir : une fleur blanche charnelle, relevée de cardamome et de benjoin.',
    cta: { label: 'Découvrir les nouveautés', to: '/shop/nouveautes' },
    secondary: { label: 'Voir le parfum', to: '/product/tubereuse-interdite' },
    image: 'art:tubereuse-interdite/noir',
    caption: 'Le Jardin Noir — Tubéreuse Interdite, parfum 50 ml',
  },
  {
    id: 'coffrets',
    eyebrow: 'Coffrets cadeaux',
    title: 'Offrir\nl’émotion',
    text: 'Des écrins composés par nos maisons, prêts à offrir. Emballage cadeau et carte personnalisée offerts.',
    cta: { label: 'Voir les coffrets', to: '/shop/coffrets' },
    secondary: { label: 'Édition limitée', to: '/product/coffret-nuit-nocturne' },
    image: 'art:coffret-nuit-nocturne/noir',
    caption: 'Nocturne Paris — Coffret Nuit Nocturne, édition limitée',
  },
  {
    id: 'promotions',
    eyebrow: 'Offre d’automne',
    title: 'Jusqu’à\n−30 %',
    text: 'Une sélection de parfums et de coffrets iconiques à prix doux, pour quelques jours seulement.',
    cta: { label: 'Profiter des offres', to: '/shop/promotions' },
    secondary: { label: 'Figue Sauvage −30 %', to: '/product/figue-sauvage' },
    image: 'art:figue-sauvage/noir',
    caption: 'Le Jardin Noir — Figue Sauvage, eau de toilette 100 ml',
  },
]

/* ------------------------------------------------------------ Univers -- */
export interface CategoryTile {
  slug: string
  label: string
  image: string
  hoverImage: string
  alt: string
  layout: 'feature' | 'small' | 'wide'
}

export const categoryTiles: CategoryTile[] = [
  {
    slug: 'femme',
    label: 'Femme',
    image: 'art:pivoine-celeste/front',
    hoverImage: 'art:pivoine-celeste/noir',
    alt: 'Pivoine Céleste de Maison Arlette',
    layout: 'feature',
  },
  {
    slug: 'homme',
    label: 'Homme',
    image: 'art:cedre-fume/front',
    hoverImage: 'art:cedre-fume/noir',
    alt: 'Cèdre Fumé de Dune & Cèdre',
    layout: 'small',
  },
  {
    slug: 'unisexe',
    label: 'Unisexe',
    image: 'art:santal-creme/front',
    hoverImage: 'art:santal-creme/noir',
    alt: 'Santal Crème d’Ambre & Sel',
    layout: 'small',
  },
  {
    slug: 'coffrets',
    label: 'Coffrets',
    image: 'art:coffret-velours-pourpre/front',
    hoverImage: 'art:coffret-velours-pourpre/noir',
    alt: 'Coffret Velours Pourpre de Maison Verlaine',
    layout: 'wide',
  },
]

/* ------------------------------------------------------ Pourquoi nous -- */
export interface ShopPromise {
  value: number
  suffix: string
  decimals?: number
  title: string
  text: string
}

export const promises: ShopPromise[] = [
  {
    value: 100,
    suffix: ' %',
    title: 'Authenticité garantie',
    text: 'Tous nos parfums proviennent directement des maisons ou de leurs distributeurs officiels.',
  },
  {
    value: 48,
    suffix: ' h',
    title: 'Livraison rapide',
    text: 'Expédition sous 24 h, livraison offerte dès 60 € d’achat en France métropolitaine.',
  },
  {
    value: 2,
    suffix: '',
    title: 'Échantillons offerts',
    text: 'Deux échantillons glissés dans chaque commande, pour découvrir de nouveaux sillages.',
  },
  {
    value: 4.8,
    suffix: '/5',
    decimals: 1,
    title: 'Clients conquis',
    text: 'Plus de 12 000 avis vérifiés saluent nos conseils et la qualité de nos emballages.',
  },
]

/* ---------------------------------------------------------------- Footer -- */
export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: 'Boutique',
    links: [
      { label: 'Parfums femme', to: '/shop/femme' },
      { label: 'Parfums homme', to: '/shop/homme' },
      { label: 'Parfums unisexe', to: '/shop/unisexe' },
      { label: 'Coffrets', to: '/shop/coffrets' },
      { label: 'Nouveautés', to: '/shop/nouveautes' },
      { label: 'Promotions', to: '/shop/promotions' },
    ],
  },
  {
    title: 'Sélections',
    links: [
      { label: 'Meilleures ventes', to: '/shop/meilleures-ventes' },
      { label: 'Parfums de luxe', to: '/shop/luxe' },
      { label: 'Parfums à moins de 60 €', to: '/shop/accessibles' },
      { label: 'Toute la boutique', to: '/shop' },
    ],
  },
  {
    title: 'Aide',
    links: [
      { label: 'Livraison', to: '/aide/livraison' },
      { label: 'Retours & remboursements', to: '/aide/retours' },
      { label: 'Questions fréquentes', to: '/aide/faq' },
      { label: 'Nous contacter', to: '/aide/contact' },
      { label: 'Mon compte', to: '/compte' },
    ],
  },
]

export const legalLinks: NavLink[] = [
  { label: 'Mentions légales', to: '/aide/mentions-legales' },
  { label: 'CGV', to: '/aide/cgv' },
  { label: 'Confidentialité', to: '/aide/confidentialite' },
]

/* ------------------------------------------------------- Pages d'aide -- */
export interface InfoPageContent {
  title: string
  eyebrow: string
  intro: string
  sections: { heading: string; body: string[] }[]
}

export const infoPages: Record<string, InfoPageContent> = {
  livraison: {
    title: 'Livraison',
    eyebrow: 'Aide',
    intro:
      'Toutes les commandes passées avant 13 h (du lundi au vendredi) sont préparées le jour même dans notre atelier.',
    sections: [
      {
        heading: 'Modes et délais',
        body: [
          'Livraison à domicile (Colissimo) : 2 à 4 jours ouvrés — 4,90 €, offerte dès 60 € d’achat.',
          'Point relais (Mondial Relay) : 3 à 5 jours ouvrés — 3,90 €, offert dès 60 € d’achat.',
          'Express 24 h : livré le lendemain pour toute commande passée avant 13 h — 9,90 €.',
          'Retrait en boutique : gratuit, votre commande est prête sous 2 h.',
        ],
      },
      {
        heading: 'Emballage',
        body: [
          'Chaque colis est préparé à la main, protégé par du papier de soie et accompagné de deux échantillons offerts.',
          'L’emballage cadeau et la carte personnalisée sont offerts pour tous les coffrets.',
        ],
      },
    ],
  },
  retours: {
    title: 'Retours & remboursements',
    eyebrow: 'Aide',
    intro: 'Vous disposez de 30 jours après réception de votre commande pour nous retourner un article.',
    sections: [
      {
        heading: 'Conditions',
        body: [
          'Pour des raisons d’hygiène, seuls les produits non ouverts et encore sous blister peuvent être retournés.',
          'Le retour est gratuit depuis la France métropolitaine grâce à l’étiquette prépayée disponible dans votre compte.',
        ],
      },
      {
        heading: 'Remboursement',
        body: [
          'Le remboursement est effectué sur le moyen de paiement utilisé, sous 5 jours ouvrés après réception du colis.',
        ],
      },
    ],
  },
  faq: {
    title: 'Questions fréquentes',
    eyebrow: 'Aide',
    intro: 'Les réponses aux questions que l’on nous pose le plus souvent.',
    sections: [
      {
        heading: 'Les parfums sont-ils authentiques ?',
        body: [
          'Oui. Nous travaillons exclusivement avec les maisons de parfum et leurs distributeurs officiels.',
        ],
      },
      {
        heading: 'Quelle différence entre eau de parfum et eau de toilette ?',
        body: [
          'La concentration en essences : de 15 à 20 % pour une eau de parfum, de 8 à 12 % pour une eau de toilette. L’extrait (parfum) va jusqu’à 30 % pour un sillage plus intense et plus durable.',
        ],
      },
      {
        heading: 'Puis-je offrir une commande ?',
        body: [
          'Bien sûr : ajoutez un message lors de la commande, nous n’indiquons jamais les prix dans le colis.',
        ],
      },
      {
        heading: 'Le paiement est-il sécurisé ?',
        body: [
          'Les paiements sont chiffrés et traités par un prestataire certifié PCI-DSS. Sur ce site de démonstration, le paiement est simulé : aucune donnée bancaire n’est transmise.',
        ],
      },
    ],
  },
  contact: {
    title: 'Nous contacter',
    eyebrow: 'Service client',
    intro: 'Nos conseillères et conseillers vous répondent du lundi au samedi, de 9 h à 19 h.',
    sections: [
      {
        heading: 'Par e-mail',
        body: ['bonjour@beauty-success.example — réponse sous 24 h ouvrées.'],
      },
      {
        heading: 'Par téléphone',
        body: ['01 84 60 12 34 (prix d’un appel local).'],
      },
    ],
  },
  cgv: {
    title: 'Conditions générales de vente',
    eyebrow: 'Informations légales',
    intro:
      'Site de démonstration : ces conditions sont données à titre d’exemple et doivent être remplacées par les conditions réelles de l’enseigne avant toute mise en production.',
    sections: [
      {
        heading: 'Prix',
        body: ['Les prix sont indiqués en euros toutes taxes comprises, hors frais de livraison.'],
      },
      {
        heading: 'Commande',
        body: [
          'La commande est définitive après validation du paiement. Un e-mail de confirmation récapitule son contenu.',
        ],
      },
    ],
  },
  'mentions-legales': {
    title: 'Mentions légales',
    eyebrow: 'Informations légales',
    intro:
      'Ce site est une démonstration technique. Les marques et produits présentés sont fictifs ; les visuels sont générés et ne proviennent d’aucun site tiers.',
    sections: [
      {
        heading: 'Éditeur',
        body: ['À compléter : raison sociale, adresse du siège, numéro RCS et directeur de la publication.'],
      },
      {
        heading: 'Hébergement',
        body: ['À compléter : nom et coordonnées de l’hébergeur.'],
      },
    ],
  },
  confidentialite: {
    title: 'Confidentialité',
    eyebrow: 'Informations légales',
    intro:
      'Dans cette démonstration, aucune donnée n’est envoyée à un serveur : le panier, les favoris, le compte et les commandes sont enregistrés uniquement dans le stockage local de votre navigateur.',
    sections: [
      {
        heading: 'Effacer vos données',
        body: [
          'Vous pouvez supprimer ces informations à tout moment en vidant le stockage du site dans les réglages de votre navigateur.',
        ],
      },
    ],
  },
}
