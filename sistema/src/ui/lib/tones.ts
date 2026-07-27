import type { OrderStatus } from '@/domain/order'
import type { ProductStatus } from '@/domain/product'
import type { DeliveryStatus } from '@/domain/delivery'
import type { Tone } from '@/ui/components/ui'

/**
 * Cor de cada situação, num lugar só.
 *
 * Espalhar isso pelas telas é o caminho mais curto para o mesmo status
 * aparecer verde numa lista e cinza na outra.
 */
export function orderTone(status: OrderStatus): Tone {
  switch (status) {
    case 'orcamento':
      return 'neutral'
    case 'confirmado':
      return 'attention'
    case 'pago':
      return 'info'
    case 'enviado':
      return 'info'
    case 'entregue':
      return 'positive'
    case 'cancelado':
      return 'negative'
  }
}

export function productTone(status: ProductStatus): Tone {
  switch (status) {
    case 'disponivel':
      return 'positive'
    case 'reservado':
      return 'attention'
    case 'encomenda':
      return 'info'
    case 'vendido':
      return 'neutral'
  }
}

export function deliveryTone(status: DeliveryStatus): Tone {
  switch (status) {
    case 'preparando':
      return 'attention'
    case 'postado':
      return 'info'
    case 'em-transito':
      return 'info'
    case 'entregue':
      return 'positive'
  }
}
