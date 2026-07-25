import { createContext } from 'react'
import type { Cart } from '@/domain/cart'
import type { Watch, PriceInCents } from '@/domain/watch'

export interface CartContextValue {
  readonly cart: Cart
  readonly count: number
  readonly subtotal: PriceInCents
  readonly isOpen: boolean
  add: (watch: Watch, quantity?: number) => void
  remove: (watchId: string) => void
  setQuantity: (watchId: string, quantity: number) => void
  clear: () => void
  open: () => void
  close: () => void
}

/**
 * O contexto mora sozinho neste arquivo (sem componente junto) para o
 * Fast Refresh continuar funcionando: um módulo que exporta componente e
 * valor não-componente perde o hot reload de estado.
 */
export const CartContext = createContext<CartContextValue | null>(null)
