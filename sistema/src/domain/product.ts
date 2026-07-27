import type { Cents } from './money'
import { percentOf } from './money'

export type ProductCondition = 'novo' | 'seminovo'

/**
 * Situação da peça no estoque.
 *
 * `encomenda` é o caso da importação sob demanda: a peça foi vendida antes de
 * existir em mãos, e ainda assim precisa aparecer no controle.
 */
export type ProductStatus = 'disponivel' | 'reservado' | 'encomenda' | 'vendido'

/** Como o cliente recebe a peça. Mesmo vocabulário do site. */
export type Availability = 'pronta-entrega' | 'sob-encomenda'

/**
 * Onde a peça aparece no site.
 *
 * `catalogo` não é ausência: a peça está publicada e aparece na busca e nos
 * filtros, só não ocupa vitrine na home.
 */
export type SiteSection = 'destaque' | 'pronta-entrega' | 'catalogo'

export const siteSectionLabel: Record<SiteSection, string> = {
  destaque: 'Em destaque (home)',
  'pronta-entrega': 'Vitrine pronta-entrega (home)',
  catalogo: 'Só no catálogo',
}

export const availabilityLabel: Record<Availability, string> = {
  'pronta-entrega': 'Pronta-entrega',
  'sob-encomenda': 'Sob encomenda',
}

export interface ProductSpecs {
  readonly movement: string
  readonly caseMaterial: string
  readonly caseSizeMm: number
  readonly glass: string
  readonly waterResistance: string
  readonly bracelet: string
}

/**
 * O que a peça mostra no site.
 *
 * Fica separado dos dados internos (custo, fornecedor, estoque mínimo) porque
 * são coisas de dono diferente: custo é da operação e nunca pode vazar para a
 * vitrine; descrição e foto são da vitrine e não afetam o caixa.
 */
export interface ProductSite {
  readonly published: boolean
  readonly section: SiteSection
  readonly availability: Availability
  /** Uma frase, a que aparece no card. */
  readonly shortDescription: string
  readonly description: string
  /** Caminho da foto em `public/catalogo/` do site. */
  readonly imageUrl: string
  readonly imageAlt: string
  readonly specs: ProductSpecs
  readonly warrantyMonths: number
  readonly hasBoxAndPapers: boolean
}

export interface Product {
  readonly id: string
  /** Código interno. É o que o site mostra na página da peça. */
  readonly sku: string
  readonly brand: string
  readonly model: string
  readonly reference?: string
  readonly condition: ProductCondition
  readonly status: ProductStatus
  /** Quanto a peça custou, incluindo importação. Base do lucro. */
  readonly costPrice: Cents
  readonly salePrice: Cents
  readonly stock: number
  /** Abaixo disso o painel avisa. Peça única costuma usar 1. */
  readonly minStock: number
  readonly supplier?: string
  readonly notes?: string
  /**
   * Publicação no site. Opcional porque peça só de controle interno pode nunca
   * ganhar vitrine, e porque registro salvo antes desta função existir não tem
   * o campo: `siteInfoOf` cobre os dois casos com um padrão.
   */
  readonly site?: ProductSite
  readonly createdAt: string
}

export const productStatusLabel: Record<ProductStatus, string> = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  encomenda: 'Sob encomenda',
  vendido: 'Vendido',
}

export const productConditionLabel: Record<ProductCondition, string> = {
  novo: 'Novo',
  seminovo: 'Seminovo',
}

/** Lucro bruto por unidade. Pode ser negativo, e o painel mostra assim mesmo. */
export function unitMargin(product: Product): Cents {
  return product.salePrice - product.costPrice
}

export function marginPercent(product: Product): number {
  return percentOf(unitMargin(product), product.salePrice)
}

/** Dinheiro parado: o que ainda não voltou de peça que está na prateleira. */
export function stockValue(product: Product): Cents {
  return product.costPrice * product.stock
}

export function isLowStock(product: Product): boolean {
  return product.status !== 'vendido' && product.stock <= product.minStock
}

export function productName(product: Product): string {
  return `${product.brand} ${product.model}`
}

/**
 * Dados de site da peça, com padrão para quem ainda não tem.
 *
 * O padrão nasce despublicado: peça nova aparecer sozinha na vitrine, sem foto
 * e sem descrição, é pior do que não aparecer.
 */
export function siteInfoOf(product: Product): ProductSite {
  return (
    product.site ?? {
      published: false,
      section: 'catalogo',
      availability: product.stock > 0 ? 'pronta-entrega' : 'sob-encomenda',
      shortDescription: '',
      description: '',
      imageUrl: '',
      imageAlt: '',
      specs: {
        movement: '',
        caseMaterial: '',
        caseSizeMm: 0,
        glass: '',
        waterResistance: '',
        bracelet: '',
      },
      warrantyMonths: 12,
      hasBoxAndPapers: true,
    }
  )
}

export function isPublished(product: Product): boolean {
  return product.site?.published === true
}

/**
 * O que falta para a peça poder ir ao site.
 *
 * Publicar sem foto ou sem descrição não dá erro, dá card vazio: melhor barrar
 * aqui do que descobrir no ar.
 */
export function missingForSite(product: Product): readonly string[] {
  const site = siteInfoOf(product)
  const missing: string[] = []

  if (site.imageUrl.trim() === '') missing.push('foto')
  if (site.shortDescription.trim() === '') missing.push('descrição curta')
  if (site.description.trim() === '') missing.push('descrição completa')
  if (site.specs.movement.trim() === '') missing.push('movimento')
  if (site.specs.caseMaterial.trim() === '') missing.push('material da caixa')
  if (site.specs.caseSizeMm <= 0) missing.push('diâmetro da caixa')
  if (product.salePrice <= 0) missing.push('preço de venda')

  return missing
}

/** Slug estável, usado como id da peça na URL do site. */
export function productSlug(product: Product): string {
  return `${product.brand} ${product.model}`
    .toLowerCase()
    .normalize('NFD')
    // Tira os acentos que o `NFD` separou da letra.
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
