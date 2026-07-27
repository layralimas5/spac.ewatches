import { useState } from 'react'
import { shippingProvider } from '@/infra'
import {
  formatPostalCode,
  isValidPostalCode,
  normalizePostalCode,
  type ShippingQuote,
} from '@/domain/shipping'
import type { PriceInCents } from '@/domain/watch'
import { formatPrice } from '@/lib/format'

type State =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'error'; readonly message: string }
  | { readonly status: 'success'; readonly quote: ShippingQuote }

/**
 * Cálculo de frete por CEP na página de produto.
 *
 * Consulta `shippingProvider`, hoje uma tabela por região, amanhã o Melhor
 * Envio. O componente não sabe a diferença.
 */
export function ShippingCalculator({ subtotal }: { readonly subtotal: PriceInCents }) {
  const [postalCode, setPostalCode] = useState('')
  const [state, setState] = useState<State>({ status: 'idle' })

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!isValidPostalCode(postalCode)) {
      setState({ status: 'error', message: 'Digite os 8 dígitos do CEP.' })
      return
    }

    setState({ status: 'loading' })

    try {
      const quote = await shippingProvider.quote({
        postalCode: normalizePostalCode(postalCode),
        subtotal,
      })
      setState({ status: 'success', quote })
    } catch (cause) {
      setState({
        status: 'error',
        message:
          cause instanceof Error ? cause.message : 'Não consegui calcular o frete agora.',
      })
    }
  }

  return (
    <div className="rounded-lg border border-paper-line p-4">
      <h2 className="text-sm font-semibold text-ink-950">Calcular frete e prazo</h2>

      <form onSubmit={submit} className="mt-3 flex gap-2">
        <label htmlFor="cep-produto" className="sr-only">
          Seu CEP
        </label>
        <input
          id="cep-produto"
          inputMode="numeric"
          autoComplete="postal-code"
          value={formatPostalCode(postalCode)}
          onChange={(event) => setPostalCode(normalizePostalCode(event.target.value))}
          placeholder="00000-000"
          className="h-11 w-full min-w-0 flex-1 rounded-md border border-paper-line bg-paper px-3 text-sm text-ink-950 placeholder:text-ink-500/70 focus:border-ink-950 sm:w-36 sm:flex-none"
        />
        <button
          type="submit"
          disabled={state.status === 'loading'}
          className="h-11 shrink-0 rounded-md border border-ink-950 px-4 text-sm font-medium text-ink-950 transition-colors hover:bg-ink-950 hover:text-cream disabled:opacity-50"
        >
          {state.status === 'loading' ? 'Calculando…' : 'Calcular'}
        </button>
      </form>

      <div aria-live="polite">
        {state.status === 'error' && (
          <p className="mt-3 text-sm text-ink-950">{state.message}</p>
        )}

        {state.status === 'success' && (
          <ul className="mt-3 list-none divide-y divide-paper-line border-t border-paper-line">
            {state.quote.options.map((option) => (
              <li key={option.id} className="flex items-center justify-between gap-4 py-2.5">
                <div>
                  <p className="text-sm text-ink-950">{option.label}</p>
                  <p className="text-xs text-ink-500">
                    {`Até ${option.estimatedDays} dias úteis`}
                  </p>
                </div>
                <span className="text-sm font-semibold text-ink-950">
                  {option.price === 0 ? 'Grátis' : formatPrice(option.price)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-3 text-xs text-ink-500">
        Prazo contado a partir da confirmação do pagamento.
      </p>
    </div>
  )
}
