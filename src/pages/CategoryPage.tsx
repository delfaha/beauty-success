import { useMemo } from 'react'
import { useParams } from 'react-router'
import { CatalogView } from '@/components/catalog/CatalogView'
import { collections, getCollection } from '@/data/collections'
import { useProducts } from '@/hooks/useProducts'
import { useSeo } from '@/hooks/useSeo'
import NotFoundPage from './NotFoundPage'

/** Pages catégorie : /shop/femme, /shop/homme, /shop/unisexe, /shop/coffrets, /shop/nouveautes, /shop/promotions… */
export default function CategoryPage() {
  const { slug } = useParams()
  const collection = getCollection(slug)
  const { products, isLoading } = useProducts()

  const scoped = useMemo(() => (collection ? products.filter(collection.filter) : []), [collection, products])
  const visual = products.find((product) => product.id === collection?.heroProductId)
  const siblings = useMemo(
    () => collections.filter((item) => item.slug !== slug).map((item) => ({ label: item.label, to: `/shop/${item.slug}` })),
    [slug],
  )

  useSeo({
    title: collection?.seoTitle ?? 'Catégorie introuvable',
    description: collection?.seoDescription,
    noindex: !collection,
  })

  if (!collection) return <NotFoundPage />

  return (
    <CatalogView
      key={collection.slug}
      title={collection.title}
      eyebrow={collection.eyebrow}
      description={collection.description}
      breadcrumb={[
        { label: 'Accueil', to: '/' },
        { label: 'Boutique', to: '/shop' },
        { label: collection.label },
      ]}
      products={scoped}
      isLoading={isLoading}
      hiddenFacets={collection.hiddenFacets}
      defaultSort={collection.defaultSort}
      visual={visual}
      quickLinks={siblings}
    />
  )
}
