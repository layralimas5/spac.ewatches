export type DeliveryStatus = 'preparando' | 'postado' | 'em-transito' | 'entregue'

export interface Delivery {
  readonly id: string
  readonly orderId: string
  readonly carrier: string
  readonly trackingCode?: string
  readonly status: DeliveryStatus
  /** Data prometida ao cliente. É ela que define o que está atrasado. */
  readonly estimatedFor?: string
  readonly updatedAt: string
  readonly notes?: string
}

export const deliveryStatusLabel: Record<DeliveryStatus, string> = {
  preparando: 'Preparando',
  postado: 'Postado',
  'em-transito': 'Em trânsito',
  entregue: 'Entregue',
}

export const deliveryFlow: readonly DeliveryStatus[] = [
  'preparando',
  'postado',
  'em-transito',
  'entregue',
]

export function nextDeliveryStatus(status: DeliveryStatus): DeliveryStatus | null {
  const position = deliveryFlow.indexOf(status)
  if (position === -1 || position === deliveryFlow.length - 1) return null
  return deliveryFlow[position + 1] ?? null
}

/** Passou da data prometida e ainda não chegou. */
export function isLate(delivery: Delivery, now = new Date()): boolean {
  if (delivery.status === 'entregue' || delivery.estimatedFor === undefined) return false
  const estimated = new Date(delivery.estimatedFor)
  return !Number.isNaN(estimated.getTime()) && estimated < now
}
