import { ProductGrid } from '@/components/product/ProductGrid'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { GhostLink } from '@/components/ui/GhostLink'
import { SplitText } from '@/components/ui/SplitText'
import { useProducts } from '@/hooks/useProducts'
import { useSeo } from '@/hooks/useSeo'
import { useFavorites } from '@/hooks/useStore'
import { pluralize } from '@/utils/format'

export default function FavoritesPage() {
  useSeo({ title: 'Mes favoris', noindex: true })
  const { ids } = useFavorites()
  const { products, isLoading } = useProducts()
  const favorites = ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product) => product !== undefined)

  return (
    <div className="container-page pb-24 pt-6">
      <Breadcrumb items={[{ label: 'Accueil', to: '/' }, { label: 'Favoris' }]} />
      <h1 className="mt-8 text-display font-extrabold lg:mt-12">
        <SplitText text="Mes favoris" trigger="mount" />
      </h1>
      <p className="mt-6 label-caps font-semibold" aria-live="polite">
        {isLoading ? 'Chargement…' : pluralize(favorites.length, 'produit sauvegardé', 'produits sauvegardés')}
      </p>

      <div className="mt-10">
        {!isLoading && favorites.length === 0 ? (
          <EmptyState
            title="Aucun favori pour l’instant."
            description="Touchez le cœur d’un produit pour le retrouver ici. Vos favoris sont conservés sur cet appareil."
          >
            <ButtonLink to="/shop">Explorer la boutique</ButtonLink>
            <GhostLink to="/shop/meilleures-ventes">Meilleures ventes</GhostLink>
          </EmptyState>
        ) : (
          <ProductGrid products={favorites} isLoading={isLoading} skeletonCount={Math.max(ids.length, 2)} columns="wide" label="Produits favoris" />
        )}
      </div>
    </div>
  )
}
