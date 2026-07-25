import { Seo } from '@/ui/components/Seo'
import { Hero } from '@/ui/sections/Hero'
import { FeaturedWatches } from '@/ui/sections/FeaturedWatches'
import { TrustPillars } from '@/ui/sections/TrustPillars'
import { CustomImportCta } from '@/ui/sections/CustomImportCta'
import { storeStructuredData } from '@/lib/structured-data'
import { siteConfig } from '@/config/site.config'

export default function HomePage() {
  return (
    <>
      <Seo
        title={siteConfig.tagline}
        description={siteConfig.description}
        path="/"
        structuredData={storeStructuredData()}
      />

      <Hero />
      <FeaturedWatches />
      <TrustPillars />
      <CustomImportCta />
    </>
  )
}
