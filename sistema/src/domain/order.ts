import type { Cents } from './money'
import { sumCents } from './money'

/**
 * Ciclo do pedido, na ordem em que ele acontece de verdade.
 *
 * `orcamento` é a conversa que ainda não fechou; ele existe para o funil
 * aparecer no painel em vez de morrer no WhatsApp.
 */
export type OrderStatus = 'orcamento' | 'confirmado' | 'pago' | 'enviado' | 'entregue' | 'cancelado'

export type PaymentMethod = 'pix' | 'cartao' | 'transferencia' | 'dinheiro'

export interface OrderItem {
  readonly productId: string
  /** Congelado no momento da venda: se a peça mudar de nome depois, o pedido não muda. */
  readonly description: string
  readonly quantity: number
  readonly unitPrice: Cents
}

export interface Order {
  readonly id: string
  /** Mesmo código que o cliente recebe no site (SW-XXXXXX). */
  readonly code: string
  readonly customerId: string
  readonly items: readonly OrderItem[]
  readonly status: OrderStatus
  readonly paymentMethod: PaymentMethod
  readonly shippingCost: Cents
  readonly discount: Cents
  readonly createdAt: string
  readonly notes?: string
}

export const orderStatusLabel: Record<OrderStatus, string> = {
  orcamento: 'Orçamento',
  confirmado: 'Confirmado',
  pago: 'Pago',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  pix: 'Pix',
  cartao: 'Cartão',
  transferencia: 'Transferência',
  dinheiro: 'Dinheiro',
}

/** Ordem em que o pedido avança. `cancelado` fica de fora: não é etapa, é saída. */
export const orderFlow: readonly OrderStatus[] = [
  'orcamento',
  'confirmado',
  'pago',
  'enviado',
  'entregue',
]

export function nextOrderStatus(status: OrderStatus): OrderStatus | null {
  const position = orderFlow.indexOf(status)
  if (position === -1 || position === orderFlow.length - 1) return null
  return orderFlow[position + 1] ?? null
}

export function orderSubtotal(order: Order): Cents {
  return sumCents(order.items.map((item) => item.unitPrice * item.quantity))
}

export function orderTotal(order: Order): Cents {
  return orderSubtotal(order) + order.shippingCost - order.discount
}

/** Pedido que já virou dinheiro no caixa. Orçamento e cancelado não contam. */
export function isRevenue(order: Order): boolean {
  return order.status === 'pago' || order.status === 'enviado' || order.status === 'entregue'
}

export function generateOrderCode(): string {
  const time = Date.now().toString(36).slice(-4).toUpperCase()
  const random = Math.random().toString(36).slice(2, 4).toUpperCase()
  return `SW-${time}${random}`
}
