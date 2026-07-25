import { useState } from 'react'
import { formatPrice } from '@/lib/format'
import { siteConfig } from '@/config/site.config'
import type { PriceInCents } from '@/domain/watch'
import { ChevronDownIcon } from '@/ui/components/icons'
import { cn } from '@/lib/cn'

/**
 * Tabela de parcelas, como a referência mostra.
 *
 * Fica recolhida por padrão: a informação que decide a compra é "12x de X", e
 * abrir doze linhas por padrão empurra o botão de comprar para fora da tela.
 */
export function InstallmentTable({ price }: { readonly price: PriceInCents }) {
  const [isOpen, setOpen] = useState(false)
  const rows = Array.from({ length: siteConfig.installments }, (_, index) => index + 1)

  return (
    <div className="border-t border-paper-line pt-3">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="tabela-parcelas"
        className="flex w-full items-center justify-between gap-2 text-sm text-ink-500 transition-colors hover:text-ink-950"
      >
        Ver todas as parcelas
        <ChevronDownIcon className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <ul id="tabela-parcelas" className="mt-3 list-none divide-y divide-paper-line">
          {rows.map((times) => (
            <li key={times} className="flex justify-between py-1.5 text-sm">
              <span className="text-ink-500">{`${times}x`}</span>
              <span className="text-ink-950">
                {`${formatPrice(Math.round(price / times))} sem juros`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
