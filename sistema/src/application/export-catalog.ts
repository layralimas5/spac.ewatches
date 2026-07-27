import {
  isPublished,
  productSlug,
  siteInfoOf,
  type Product,
  type SiteSection,
} from '@/domain/product'

/**
 * Gera o arquivo de catálogo do site a partir das peças publicadas.
 *
 * Enquanto site e sistema não dividem o mesmo banco, este é o caminho honesto
 * de publicação: o sistema é a fonte da verdade, o arquivo é o transporte.
 * Baixar, substituir `site/src/infra/catalog/watches.data.ts` e publicar.
 *
 * Quando o banco compartilhado existir, esta função sai e as duas pontas
 * passam a ler a mesma tabela. O formato de saída já é o do site, então nada
 * muda para quem consome.
 */

/** `featured` é o que a home mostra em "Em destaque". */
function isFeatured(section: SiteSection): boolean {
  return section === 'destaque'
}

function quote(value: string): string {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

function productToSource(product: Product): string {
  const site = siteInfoOf(product)

  const lines = [
    `  {`,
    `    id: ${quote(productSlug(product))},`,
    `    sku: ${quote(product.sku)},`,
    `    stock: ${product.stock},`,
    `    name: ${quote(product.model)},`,
    `    brand: ${quote(product.brand)},`,
    ...(product.reference === undefined ? [] : [`    reference: ${quote(product.reference)},`]),
    `    condition: ${quote(product.condition)},`,
    `    availability: ${quote(site.availability)},`,
    `    price: ${product.salePrice},`,
    `    images: [`,
    `      { url: ${quote(site.imageUrl)}, alt: ${quote(site.imageAlt)} },`,
    `    ],`,
    `    shortDescription: ${quote(site.shortDescription)},`,
    `    description: ${quote(site.description)},`,
    `    specs: {`,
    `      movement: ${quote(site.specs.movement)},`,
    `      caseMaterial: ${quote(site.specs.caseMaterial)},`,
    `      caseSizeMm: ${site.specs.caseSizeMm},`,
    `      glass: ${quote(site.specs.glass)},`,
    `      waterResistance: ${quote(site.specs.waterResistance)},`,
    `      bracelet: ${quote(site.specs.bracelet)},`,
    `    },`,
    `    hasBoxAndPapers: ${site.hasBoxAndPapers},`,
    `    warrantyMonths: ${site.warrantyMonths},`,
    `    featured: ${isFeatured(site.section)},`,
    `  },`,
  ]

  return lines.join('\n')
}

export function publishedProducts(products: readonly Product[]): readonly Product[] {
  return products.filter(isPublished)
}

export function buildCatalogFile(products: readonly Product[], generatedAt = new Date()): string {
  const published = publishedProducts(products)
  const stamp = generatedAt.toLocaleString('pt-BR')

  return `import type { Watch } from '@/domain/watch'

/**
 * Catálogo do site.
 *
 * Arquivo GERADO pelo sistema de gestão em ${stamp}.
 * Não edite à mão: a próxima exportação sobrescreve tudo. Para mudar preço,
 * foto ou descrição, mude no sistema e exporte de novo.
 */
export const demoWatches: readonly Watch[] = [
${published.map(productToSource).join('\n')}
]
`
}

/** Dispara o download do arquivo gerado, sem servidor no meio. */
export function downloadCatalogFile(products: readonly Product[]): void {
  const content = buildCatalogFile(products)
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'watches.data.ts'
  link.click()

  // Sem revogar, o blob fica na memória da aba até a página recarregar.
  URL.revokeObjectURL(url)
}
