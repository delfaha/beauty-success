import { BrandsSection } from '@/components/home/BrandsSection'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { CoffretsFeature } from '@/components/home/CoffretsFeature'
import { FamilyExplorer } from '@/components/home/FamilyExplorer'
import { HeroSlider } from '@/components/home/HeroSlider'
import { NewArrivals } from '@/components/home/NewArrivals'
import { Newsletter } from '@/components/home/Newsletter'
import { PromoBand } from '@/components/home/PromoBand'
import { WhyUs } from '@/components/home/WhyUs'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { JsonLd } from '@/components/ui/JsonLd'
import { ScrollMarquee } from '@/components/ui/Marquee'
import { SectionHeader, VerticalLabel } from '@/components/ui/SectionHeader'
import { useProducts } from '@/hooks/useProducts'
import { useSeo } from '@/hooks/useSeo'
import { organizationJsonLd, websiteJsonLd } from '@/utils/seo'

export default function HomePage() {
  useSeo({})
  const { products, isLoading } = useProducts()
  const bestSellers = products.filter((product) => product.isBestSeller).sort((a, b) => b.popularity - a.popularity)

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <HeroSlider />
      <ScrollMarquee
        items={['Parfums femme', 'Parfums homme', 'Unisexe', 'Coffrets', 'Nouveautés']}
        className="border-b border-ink py-6 md:py-9"
      />
      <CategoryShowcase />

      <section className="container-page relative pb-16 md:pb-24" aria-labelledby="popular-title">
        <VerticalLabel className="absolute left-2 top-6">Meilleures ventes</VerticalLabel>
        <SectionHeader
          id="popular-title"
          eyebrow="Les plus aimés"
          title="Produits populaires"
          link={{ label: 'Voir les meilleures ventes', to: '/shop/meilleures-ventes' }}
        />
        <ProductCarousel products={bestSellers} isLoading={isLoading} label="Produits populaires" />
      </section>

      <NewArrivals />
      <FamilyExplorer />
      <PromoBand />
      <CoffretsFeature />
      <BrandsSection />
      <WhyUs />
      <Newsletter />
    </>
  )
}
