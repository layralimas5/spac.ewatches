import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCart } from '@/application/use-cart'
import { isCartEmpty } from '@/domain/cart'
import { formatPrice } from '@/lib/format'
import { FREE_SHIPPING_THRESHOLD } from '@/config/commerce'
import { buttonStyles } from './Button'
import { QuantityStepper } from './QuantityStepper'
import { CloseIcon, TrashIcon } from './icons'
import { WatchPhoto } from './WatchPhoto'

/**
 * Carrinho lateral, aberto ao adicionar uma peça.
 *
 * É um diálogo modal de verdade: prende o foco, fecha no Esc e no clique fora,
 * e devolve o foco a quem o abriu. Sem isso, quem navega por teclado fica preso
 * na página atrás do painel.
 */
export function CartDrawer() {
  const { cart, subtotal, isOpen, close, remove, setQuantity } = useCart()
  const reduceMotion = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        return
      }

      if (event.key !== 'Tab' || panelRef.current === null) return

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (first === undefined || last === undefined) return

      // Ciclo do Tab dentro do painel: do último volta pro primeiro e vice-versa.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.querySelector<HTMLElement>('button, a')?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previouslyFocused.current?.focus()
    }
  }, [isOpen, close])

  const missingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Carrinho">
          <motion.button
            type="button"
            aria-label="Fechar carrinho"
            onClick={close}
            initial={reduceMotion === true ? false : { opacity: 0 }}
            animate={reduceMotion === true ? {} : { opacity: 1 }}
            exit={reduceMotion === true ? {} : { opacity: 0 }}
            className="absolute inset-0 h-full w-full cursor-default bg-ink-950/50"
          />

          <motion.div
            ref={panelRef}
            initial={reduceMotion === true ? false : { x: '100%' }}
            animate={reduceMotion === true ? {} : { x: 0 }}
            exit={reduceMotion === true ? {} : { x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-paper-line px-5 py-4">
              <h2 className="text-base font-semibold text-ink-950">Seu carrinho</h2>
              <button
                type="button"
                onClick={close}
                aria-label="Fechar carrinho"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-500 hover:text-ink-950"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </header>

            {isCartEmpty(cart) ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-sm text-ink-500">Seu carrinho está vazio.</p>
                <Link to="/catalogo" onClick={close} className={buttonStyles('primary', 'md')}>
                  Ver catálogo
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 list-none divide-y divide-paper-line overflow-y-auto px-5">
                  {cart.items.map((item) => (
                    <li key={item.watchId} className="flex gap-4 py-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-paper-line bg-paper-alt">
                        <WatchPhoto
                          image={
                            item.imageUrl !== undefined
                              ? { url: item.imageUrl, alt: item.name }
                              : undefined
                          }
                          sizes="80px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="eyebrow text-ink-500">{item.brand}</p>
                        <p className="truncate text-sm font-medium text-ink-950">{item.name}</p>
                        <p className="mt-1 text-sm font-semibold text-ink-950">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>

                        <div className="mt-2 flex items-center gap-3">
                          <QuantityStepper
                            value={item.quantity}
                            max={item.maxQuantity}
                            onChange={(quantity) => setQuantity(item.watchId, quantity)}
                            label={item.name}
                          />
                          <button
                            type="button"
                            onClick={() => remove(item.watchId)}
                            aria-label={`Remover ${item.name} do carrinho`}
                            className="text-ink-500 transition-colors hover:text-ink-950"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-paper-line px-5 py-4">
                  {missingForFreeShipping > 0 && (
                    <p className="mb-3 rounded-md bg-paper-alt px-3 py-2 text-xs text-ink-500">
                      {`Faltam ${formatPrice(missingForFreeShipping)} para o frete grátis.`}
                    </p>
                  )}

                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-ink-500">Subtotal</span>
                    <span className="text-lg font-semibold text-ink-950">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-500">
                    Frete calculado na próxima etapa.
                  </p>

                  <Link
                    to="/checkout"
                    onClick={close}
                    className={`${buttonStyles('primary', 'lg')} mt-4 w-full`}
                  >
                    Finalizar compra
                  </Link>

                  <button
                    type="button"
                    onClick={close}
                    className="mt-2 w-full text-center text-xs text-ink-500 hover:text-ink-950"
                  >
                    Continuar comprando
                  </button>
                </footer>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
