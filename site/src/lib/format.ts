import type { PriceInCents } from '@/domain/watch'

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

/**
 * Preço cheio em reais. Sem centavos: relógio de ticket alto não mostra ",00",
 * polui e faz o número parecer de varejo.
 */
export function formatPrice(cents: PriceInCents): string {
  return brl.format(cents / 100)
}

/** Parcelamento indicativo, do jeito que a loja negocia hoje. */
export function formatInstallment(cents: PriceInCents, times: number): string {
  return `${times}x de ${brl.format(cents / 100 / times)}`
}
