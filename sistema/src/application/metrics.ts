import type { Product } from '@/domain/product'
import { isLowStock, stockValue } from '@/domain/product'
import type { Order } from '@/domain/order'
import { isRevenue, orderTotal } from '@/domain/order'
import type { Delivery } from '@/domain/delivery'
import { isLate } from '@/domain/delivery'
import type { CashSummary, FinanceEntry } from '@/domain/finance'
import { isInMonth, summarize } from '@/domain/finance'
import type { Cents } from '@/domain/money'
import { sumCents } from '@/domain/money'

export interface DashboardMetrics {
  readonly monthRevenue: Cents
  readonly monthOrders: number
  readonly averageTicket: Cents
  readonly openOrders: number
  readonly stockCount: number
  readonly stockValue: Cents
  readonly lowStock: readonly Product[]
  readonly lateDeliveries: readonly Delivery[]
  readonly cash: CashSummary
  readonly previousMonthRevenue: Cents
}

function isSameMonth(iso: string, reference: Date): boolean {
  const date = new Date(iso)
  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  )
}

/**
 * Números do painel.
 *
 * Fica fora dos componentes de propósito: é regra de negócio (o que conta como
 * faturamento, o que é pedido em aberto), e regra de negócio testável não pode
 * morar dentro de JSX.
 */
export function calculateMetrics(
  products: readonly Product[],
  orders: readonly Order[],
  deliveries: readonly Delivery[],
  entries: readonly FinanceEntry[],
  now = new Date(),
): DashboardMetrics {
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  // Só pedido que virou dinheiro entra no faturamento. Orçamento é conversa.
  const paidThisMonth = orders.filter((order) => isRevenue(order) && isSameMonth(order.createdAt, now))
  const paidPreviousMonth = orders.filter(
    (order) => isRevenue(order) && isSameMonth(order.createdAt, previousMonth),
  )

  const monthRevenue = sumCents(paidThisMonth.map(orderTotal))
  const inStock = products.filter((product) => product.status !== 'vendido')

  return {
    monthRevenue,
    monthOrders: paidThisMonth.length,
    averageTicket: paidThisMonth.length === 0 ? 0 : Math.round(monthRevenue / paidThisMonth.length),
    openOrders: orders.filter(
      (order) => order.status === 'orcamento' || order.status === 'confirmado',
    ).length,
    stockCount: sumCents(inStock.map((product) => product.stock)),
    stockValue: sumCents(inStock.map(stockValue)),
    lowStock: products.filter(isLowStock),
    lateDeliveries: deliveries.filter((delivery) => isLate(delivery, now)),
    cash: summarize(entries.filter((entry) => isInMonth(entry.date, now))),
    previousMonthRevenue: sumCents(paidPreviousMonth.map(orderTotal)),
  }
}

/** Variação percentual entre dois meses. `null` quando não há base de comparação. */
export function growth(current: Cents, previous: Cents): number | null {
  if (previous === 0) return null
  return ((current - previous) / previous) * 100
}
