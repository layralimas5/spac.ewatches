import { useContext } from 'react'
import { CartContext, type CartContextValue } from './cart-context'

export function useCart(): CartContextValue {
  const context = useContext(CartContext)

  if (context === null) {
    throw new Error('useCart precisa estar dentro de <CartProvider>.')
  }

  return context
}
