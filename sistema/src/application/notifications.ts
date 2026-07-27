import type { Product } from '@/domain/product'
import { isLowStock, isPublished, missingForSite, productName } from '@/domain/product'
import type { Order } from '@/domain/order'
import type { Delivery } from '@/domain/delivery'
import { isLate } from '@/domain/delivery'

export interface Notification {
  readonly id: string
  readonly title: string
  readonly detail: string
  readonly to: string
  readonly tone: 'attention' | 'negative' | 'info'
}

/**
 * A fila do que precisa de ação.
 *
 * Cada aviso aponta para a tela onde ele se resolve: aviso que não leva a
 * lugar nenhum vira ruído e a pessoa aprende a ignorar o sininho.
 */
export function buildNotifications(
  products: readonly Product[],
  orders: readonly Order[],
  deliveries: readonly Delivery[],
): readonly Notification[] {
  const notifications: Notification[] = []

  const lateDeliveries = deliveries.filter((delivery) => isLate(delivery))
  if (lateDeliveries.length > 0) {
    notifications.push({
      id: 'entregas-atrasadas',
      title: lateDeliveries.length === 1 ? '1 entrega atrasada' : `${lateDeliveries.length} entregas atrasadas`,
      detail: 'Avise o cliente antes que ele pergunte.',
      to: '/entregas',
      tone: 'negative',
    })
  }

  const openOrders = orders.filter(
    (order) => order.status === 'orcamento' || order.status === 'confirmado',
  )
  if (openOrders.length > 0) {
    notifications.push({
      id: 'pedidos-abertos',
      title: openOrders.length === 1 ? '1 pedido em aberto' : `${openOrders.length} pedidos em aberto`,
      detail: 'Orçamento parado é venda esfriando.',
      to: '/pedidos',
      tone: 'attention',
    })
  }

  const lowStock = products.filter(isLowStock)
  if (lowStock.length > 0) {
    notifications.push({
      id: 'estoque-baixo',
      title: lowStock.length === 1 ? '1 peça no estoque mínimo' : `${lowStock.length} peças no estoque mínimo`,
      detail: lowStock.slice(0, 3).map(productName).join(', '),
      to: '/estoque',
      tone: 'attention',
    })
  }

  const incomplete = products.filter(
    (product) => isPublished(product) && missingForSite(product).length > 0,
  )
  if (incomplete.length > 0) {
    notifications.push({
      id: 'site-incompleto',
      title:
        incomplete.length === 1
          ? '1 peça publicada sem informação completa'
          : `${incomplete.length} peças publicadas sem informação completa`,
      detail: 'No site elas aparecem com card vazio.',
      to: '/estoque',
      tone: 'attention',
    })
  }

  return notifications
}
