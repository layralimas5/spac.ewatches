import type { Cart, CartItem } from './cart'
import { cartSubtotal } from './cart'
import type { ShippingOption } from './shipping'
import type { PriceInCents } from './watch'

/**
 * Pedido e pagamento.
 *
 * `PaymentGateway` é um contrato deliberadamente magro: quem implementa hoje é
 * um adaptador local que NÃO cobra nada; quando a conta do Mercado Pago existir,
 * entra um adaptador real e nada mais no app precisa mudar.
 */

export type PaymentMethod = 'pix' | 'cartao'

export interface Customer {
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly document: string
}

export interface ShippingAddress {
  readonly postalCode: string
  readonly street: string
  readonly number: string
  readonly complement?: string
  readonly district: string
  readonly city: string
  readonly state: string
}

export interface OrderDraft {
  readonly items: readonly CartItem[]
  readonly customer: Customer
  readonly address: ShippingAddress
  readonly shipping: ShippingOption
  readonly paymentMethod: PaymentMethod
}

export interface OrderTotals {
  readonly subtotal: PriceInCents
  readonly shipping: PriceInCents
  readonly discount: PriceInCents
  readonly total: PriceInCents
}

export type PaymentResult =
  /** Pedido registrado, pagamento ainda por concluir. */
  | {
      readonly status: 'pending'
      readonly orderCode: string
      /** Copia-e-cola do Pix, quando o meio for Pix. */
      readonly pixCode?: string
      /** Para onde mandar o cliente concluir (checkout do gateway ou WhatsApp). */
      readonly redirectUrl?: string
    }
  | { readonly status: 'paid'; readonly orderCode: string }
  | { readonly status: 'unavailable'; readonly reason: string }

export interface PaymentGateway {
  checkout(draft: OrderDraft, totals: OrderTotals): Promise<PaymentResult>
}

/** Pix com desconto é padrão no varejo brasileiro, a loja define o percentual. */
export function computeTotals(
  cart: Cart,
  shipping: ShippingOption | null,
  paymentMethod: PaymentMethod,
  pixDiscountPercent: number,
): OrderTotals {
  const subtotal = cartSubtotal(cart)
  const shippingPrice = shipping?.price ?? 0
  const discount =
    paymentMethod === 'pix' ? Math.floor((subtotal * pixDiscountPercent) / 100) : 0

  return {
    subtotal,
    shipping: shippingPrice,
    discount,
    total: subtotal + shippingPrice - discount,
  }
}
