import { siteConfig } from '@/config/site.config'
import type { Watch } from '@/domain/watch'
import { primaryImage } from '@/domain/watch'

/**
 * JSON-LD para o Google entender loja e produtos.
 * Em relógio importado, `Product` com preço e disponibilidade é o que habilita
 * o resultado rico com faixa de preço na busca.
 */

export function storeStructuredData(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/logo.png`,
    sameAs: [siteConfig.instagram.url],
    priceRange: '$$$',
  }
}

export function watchStructuredData(watch: Watch): Record<string, unknown> {
  const image = primaryImage(watch)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${watch.brand} ${watch.name}`,
    description: watch.shortDescription,
    brand: { '@type': 'Brand', name: watch.brand },
    sku: watch.reference ?? watch.id,
    itemCondition:
      watch.condition === 'novo'
        ? 'https://schema.org/NewCondition'
        : 'https://schema.org/UsedCondition',
    ...(image !== undefined && { image: `${siteConfig.url}${image.url}` }),
    offers: {
      '@type': 'Offer',
      url: `${siteConfig.url}/relogio/${watch.id}`,
      priceCurrency: 'BRL',
      price: (watch.price / 100).toFixed(2),
      availability:
        watch.availability === 'pronta-entrega'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/PreOrder',
      seller: { '@type': 'Organization', name: siteConfig.name },
    },
  }
}
