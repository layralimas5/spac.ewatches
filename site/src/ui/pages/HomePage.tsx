import { useCatalog, useFeaturedWatches } from '@/application/use-catalog'
import { Seo } from '@/ui/components/Seo'
import { BannerCarousel } from '@/ui/sections/BannerCarousel'
import { CategoryGrid } from '@/ui/sections/CategoryGrid'
import { ProductGrid } from '@/ui/sections/ProductGrid'
import { PromoBanners } from '@/ui/sections/PromoBanners'
import { BenefitsStrip } from '@/ui/sections/BenefitsStrip'
import { storeStructuredData } from '@/lib/structured-data'
import { siteConfig } from '@/config/site.config'

export default function HomePage() {
  const featured = useFeaturedWatches(4)
  // "Pronta-entrega" é um recorte verdadeiro do catálogo, não uma vitrine
  // inventada: são as peças que a loja tem em mãos agora.
  const readyToShip = useCatalog({ availability: 'pronta-entrega' }, 'menor-preco')

  return (
    <>
      <Seo
        title={siteConfig.tagline}
        description={siteConfig.description}
        path="/"
        structuredData={storeStructuredData()}
      />

      <BannerCarousel />
      <CategoryGrid />

      <ProductGrid
        id="destaques"
        title="Em destaque"
        state={featured}
        seeAllTo="/catalogo"
        priority
      />

      <PromoBanners />

      <ProductGrid
        id="pronta-entrega"
        title="Pronta-entrega"
        state={readyToShip}
        seeAllTo="/catalogo?disponibilidade=pronta-entrega"
      />

      <BenefitsStrip />
    </>
  )
}
