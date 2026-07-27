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
