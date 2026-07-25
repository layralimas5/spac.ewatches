import type { PriceInCents } from './watch'

/**
 * Frete.
 *
 * O contrato existe antes da transportadora: hoje quem responde é uma tabela
 * local, amanhã é o Melhor Envio ou os Correios. A UI não muda.
 */

export interface ShippingOption {
  readonly id: string
  readonly label: string
  readonly price: PriceInCents
  readonly estimatedDays: number
}

export interface ShippingQuote {
  readonly postalCode: string
  readonly options: readonly ShippingOption[]
}

export interface ShippingProvider {
  /** `postalCode` chega só com dígitos. Lança `InvalidPostalCodeError` se inválido. */
  quote(params: {
    postalCode: string
    subtotal: PriceInCents
  }): Promise<ShippingQuote>
}

export class InvalidPostalCodeError extends Error {
  constructor() {
    super('CEP inválido. Digite os 8 dígitos.')
    this.name = 'InvalidPostalCodeError'
  }
}

/** Deixa só os dígitos — o cliente digita com hífen, com espaço, como vier. */
export function normalizePostalCode(input: string): string {
  return input.replace(/\D/g, '')
}

export function isValidPostalCode(input: string): boolean {
  return normalizePostalCode(input).length === 8
}

export function formatPostalCode(input: string): string {
  const digits = normalizePostalCode(input).slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}
