import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  addItem,
  cartCount,
  cartSubtotal,
  emptyCart,
  itemFromWatch,
  removeItem,
  updateQuantity,
  type Cart,
} from '@/domain/cart'
import type { Watch } from '@/domain/watch'
import { CartContext, type CartContextValue } from './cart-context'

const STORAGE_KEY = 'space-watches:cart:v1'

/**
 * O carrinho vive no navegador (localStorage), não no servidor.
 *
 * Isso é intencional enquanto não há login: o cliente fecha a aba, volta no dia
 * seguinte e o carrinho continua lá. Quando existir conta de usuário, este
 * provider passa a sincronizar com o banco, a API para os componentes é a mesma.
 */
export function CartProvider({ children }: { readonly children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => readStoredCart())
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // Modo privado ou storage cheio: o carrinho segue funcionando na sessão,
      // só não sobrevive ao reload. Não é motivo para quebrar a loja.
    }
  }, [cart])

  const add = useCallback((watch: Watch, quantity = 1) => {
    setCart((current) => addItem(current, itemFromWatch(watch, quantity)))
    setOpen(true)
  }, [])

  const remove = useCallback((watchId: string) => {
    setCart((current) => removeItem(current, watchId))
  }, [])

  const setQuantity = useCallback((watchId: string, quantity: number) => {
    setCart((current) => updateQuantity(current, watchId, quantity))
  }, [])

  const clear = useCallback(() => setCart(emptyCart), [])
  const open = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      count: cartCount(cart),
      subtotal: cartSubtotal(cart),
      isOpen,
      add,
      remove,
      setQuantity,
      clear,
      open,
      close,
    }),
    [cart, isOpen, add, remove, setQuantity, clear, open, close],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/**
 * Lê o carrinho salvo com desconfiança: o conteúdo do localStorage pode ter
 * sido escrito por uma versão antiga do site ou editado à mão. Qualquer coisa
 * fora do formato esperado vira carrinho vazio em vez de quebrar a página.
 */
function readStoredCart(): Cart {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return emptyCart

    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return emptyCart

    const items = (parsed as { items?: unknown }).items
    if (!Array.isArray(items)) return emptyCart

    return { items: items.filter(isCartItemShape) }
  } catch {
    return emptyCart
  }
}

function isCartItemShape(value: unknown): value is Cart['items'][number] {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>

  return (
    typeof item['watchId'] === 'string' &&
    typeof item['sku'] === 'string' &&
    typeof item['name'] === 'string' &&
    typeof item['brand'] === 'string' &&
    typeof item['unitPrice'] === 'number' &&
    typeof item['quantity'] === 'number' &&
    typeof item['maxQuantity'] === 'number' &&
    item['quantity'] > 0
  )
}
