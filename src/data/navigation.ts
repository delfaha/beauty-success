export interface NavLink {
  label: string
  to: string
}

export interface MegaColumn {
  title: string
  links: NavLink[]
}

export interface NavItem extends NavLink {
  /** Point doré discret (promotions). */
  accent?: boolean
  mega?: {
    columns: MegaColumn[]
    featuredId: string
    featuredLabel: string
  }
}

const families = (base: string, list: [string, string][]): NavLink[] =>
  list.map(([label, value]) => ({ label, to: `${base}?famille=${value}` }))

export const mainNav: NavItem[] = [
  {
    label: 'Parfums Femme',
    to: '/shop/femme',
    mega: {
      featuredId: 'tubereuse-interdite',
      featuredLabel: 'Nouveauté',
      columns: [
        {
          title: 'Par catégorie',
          links: [
            { label: 'Eau de parfum', to: '/shop/femme?type=eau-de-parfum' },
            { label: 'Eau de toilette', to: '/shop/femme?type=eau-de-toilette' },
            { label: 'Parfum (extrait)', to: '/shop/femme?type=parfum' },
            { label: 'Brume parfumée', to: '/shop/femme?type=brume' },
            { label: 'Coffrets femme', to: '/shop/coffrets?genre=femme' },
          ],
        },
        {
          title: 'Familles olfactives',
          links: families('/shop/femme', [
            ['Floral', 'floral'],
            ['Oriental', 'oriental'],
            ['Gourmand', 'gourmand'],
            ['Fruité', 'fruite'],
            ['Musqué', 'musque'],
          ]),
        },
        {
          title: 'Sélections',
          links: [
            { label: 'Nouveautés femme', to: '/shop/nouveautes?genre=femme' },
            { label: 'Meilleures ventes', to: '/shop/meilleures-ventes?genre=femme' },
            { label: 'Promotions', to: '/shop/promotions?genre=femme' },
            { label: 'Parfums de luxe', to: '/shop/luxe?genre=femme' },
          ],
        },
      ],
    },
  },
  {
    label: 'Parfums Homme',
    to: '/shop/homme',
    mega: {
      featuredId: 'cuir-sepia',
      featuredLabel: 'Nouveauté',
      columns: [
        {
          title: 'Par catégorie',
          links: [
            { label: 'Eau de parfum', to: '/shop/homme?type=eau-de-parfum' },
            { label: 'Eau de toilette', to: '/shop/homme?type=eau-de-toilette' },
            { label: 'Parfum (extrait)', to: '/shop/homme?type=parfum' },
            { label: 'Coffrets homme', to: '/shop/coffrets?genre=homme' },
          ],
        },
        {
          title: 'Familles olfactives',
          links: families('/shop/homme', [
            ['Boisé', 'boise'],
            ['Aromatique', 'aromatique'],
            ['Aquatique', 'aquatique'],
            ['Oriental', 'oriental'],
            ['Cuir', 'cuir'],
          ]),
        },
        {
          title: 'Sélections',
          links: [
            { label: 'Nouveautés homme', to: '/shop/nouveautes?genre=homme' },
            { label: 'Meilleures ventes', to: '/shop/meilleures-ventes?genre=homme' },
            { label: 'Promotions', to: '/shop/promotions?genre=homme' },
            { label: 'Moins de 60 €', to: '/shop/accessibles?genre=homme' },
          ],
        },
      ],
    },
  },
  {
    label: 'Unisexe',
    to: '/shop/unisexe',
    mega: {
      featuredId: 'the-noir-fume',
      featuredLabel: 'Coup de cœur',
      columns: [
        {
          title: 'Par catégorie',
          links: [
            { label: 'Eau de parfum', to: '/shop/unisexe?type=eau-de-parfum' },
            { label: 'Eau de toilette', to: '/shop/unisexe?type=eau-de-toilette' },
            { label: 'Parfum (extrait)', to: '/shop/unisexe?type=parfum' },
            { label: 'Brume parfumée', to: '/shop/unisexe?type=brume' },
            { label: 'Coffrets unisexe', to: '/shop/coffrets?genre=unisexe' },
          ],
        },
        {
          title: 'Familles olfactives',
          links: families('/shop/unisexe', [
            ['Boisé', 'boise'],
            ['Musqué', 'musque'],
            ['Hespéridé', 'hesperide'],
            ['Oriental', 'oriental'],
            ['Aromatique', 'aromatique'],
          ]),
        },
        {
          title: 'Maisons',
          links: [
            { label: 'Atelier Solène', to: '/shop/unisexe?marque=atelier-solene' },
            { label: 'Ambre & Sel', to: '/shop/unisexe?marque=ambre-et-sel' },
            { label: 'Nocturne Paris', to: '/shop/unisexe?marque=nocturne-paris' },
            { label: 'Blanc Minéral', to: '/shop/unisexe?marque=blanc-mineral' },
          ],
        },
      ],
    },
  },
  {
    label: 'Coffrets',
    to: '/shop/coffrets',
    mega: {
      featuredId: 'coffret-nuit-nocturne',
      featuredLabel: 'Édition limitée',
      columns: [
        {
          title: 'Pour qui ?',
          links: [
            { label: 'Coffrets femme', to: '/shop/coffrets?genre=femme' },
            { label: 'Coffrets homme', to: '/shop/coffrets?genre=homme' },
            { label: 'Coffrets unisexe', to: '/shop/coffrets?genre=unisexe' },
          ],
        },
        {
          title: 'Budget',
          links: [
            { label: 'Moins de 50 €', to: '/shop/coffrets?prix=moins-50' },
            { label: '50 – 100 €', to: '/shop/coffrets?prix=50-100' },
            { label: '100 – 150 €', to: '/shop/coffrets?prix=100-150' },
            { label: 'Plus de 150 €', to: '/shop/coffrets?prix=plus-150' },
          ],
        },
        {
          title: 'Sélections',
          links: [
            { label: 'Coffrets en promotion', to: '/shop/promotions?type=coffret' },
            { label: 'Nouveaux coffrets', to: '/shop/nouveautes?type=coffret' },
            { label: 'Tous les coffrets', to: '/shop/coffrets' },
          ],
        },
      ],
    },
  },
  { label: 'Nouveautés', to: '/shop/nouveautes' },
  { label: 'Promotions', to: '/shop/promotions', accent: true },
]

export const popularSearches = ['Coffret', 'Vanille', 'Parfum homme', 'Rose', 'Boisé', 'Maison Verlaine']
