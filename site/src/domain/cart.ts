import type { PriceInCents, Watch } from './watch'

/**
 * Carrinho como valor imutável.
 *
 * Nenhuma função aqui altera o carrinho recebido — todas devolvem um novo.
 * Isso mantém o histórico previsível e evita o bug clássico de dois
 * componentes mutando a mesma lista e discordando do total.
 */

export interface CartItem {
  readonly watchId: string
  readonly sku: string
  readonly name: string
  readonly brand: string
  readonly imageUrl?: string
  /** Preço congelado no instante em que entrou no carrinho. */
  readonly unitPrice: PriceInCents
  readonly quantity: number
  /** Teto de unidades, vindo do estoque da peça. */
  readonly maxQuantity: number
  /** Texto de personalização, quando a peça aceita. */
  readonly personalization?: string
}

export interface Cart {
  readonly items: readonly CartItem[]
}

export const emptyCart: Cart = { items: [] }

export function itemFromWatch(watch: Watch, quantity = 1): CartItem {
  const image = watch.images[0]
  return {
    watchId: watch.id,
    sku: watch.sku,
    name: watch.name,
    brand: watch.brand,
    ...(image !== undefined && { imageUrl: image.url }),
    unitPrice: watch.price,
    quantity: clamp(quantity, 1, watch.stock),
    maxQuantity: watch.stock,
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Soma ao item existente em vez de duplicar a linha, respeitando o estoque.
 * Sem o teto, o cliente fecha pedido de 3 unidades de uma peça única.
 */
export function addItem(cart: Cart, item: CartItem): Cart {
  const existing = cart.items.find((current) => current.watchId === item.watchId)

  if (existing === undefined) {
    return { items: [...cart.items, item] }
  }

  return {
    items: cart.items.map((current) =>
      current.watchId === item.watchId
        ? {
            ...current,
            quantity: clamp(current.quantity + item.quantity, 1, current.maxQuantity),
          }
        : current,
    ),
  }
}

export function removeItem(cart: Cart, watchId: string): Cart {
  return { items: cart.items.filter((item) => item.watchId !== watchId) }
}

export function updateQuantity(cart: Cart, watchId: string, quantity: number): Cart {
  if (quantity <= 0) return removeItem(cart, watchId)

  return {
    items: cart.items.map((item) =>
      item.watchId === watchId
        ? { ...item, quantity: clamp(quantity, 1, item.maxQuantity) }
        : item,
    ),
  }
}

export function cartSubtotal(cart: Cart): PriceInCents {
  return cart.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
}

export function cartCount(cart: Cart): number {
  return cart.items.reduce((total, item) => total + item.quantity, 0)
}

export function isCartEmpty(cart: Cart): boolean {
  return cart.items.length === 0
}
