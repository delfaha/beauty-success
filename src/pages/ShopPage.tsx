import { CatalogView } from '@/components/catalog/CatalogView'
import { collections } from '@/data/collections'
import { useProducts } from '@/hooks/useProducts'
import { useSeo } from '@/hooks/useSeo'

const QUICK_LINKS = collections.map((collection) => ({ label: collection.label, to: `/shop/${collection.slug}` }))

export default function ShopPage() {
  useSeo({
    title: 'La boutique — tous nos parfums et coffrets',
    description:
      'Tous les parfums Beauty Success : eaux de parfum, eaux de toilette, extraits, brumes et coffrets. Filtrez par marque, prix, genre ou famille olfactive.',
  })
  const { products, isLoading } = useProducts()
  const visual = products.find((product) => product.id === 'velours-pourpre')

  return (
    <CatalogView
      title="La boutique"
      eyebrow="Tous nos parfums"
      description="Quarante créations de dix maisons, des grands classiques aux parfums d’auteur. Affinez votre recherche par catégorie, genre, marque, prix ou famille olfactive."
      breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Boutique' }]}
      products={products}
      isLoading={isLoading}
      visual={visual}
      quickLinks={QUICK_LINKS}
    />
  )
}
