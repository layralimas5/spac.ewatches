import {
  InvalidPostalCodeError,
  isValidPostalCode,
  normalizePostalCode,
  type ShippingProvider,
  type ShippingQuote,
} from '@/domain/shipping'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_TABLE } from '@/config/commerce'
import type { PriceInCents } from '@/domain/watch'

/**
 * Frete por tabela fixa de região.
 *
 * É a implementação provisória: não consulta transportadora nenhuma, só lê
 * `config/commerce.ts`. Serve para o checkout funcionar de ponta a ponta antes
 * de existir contrato de envio.
 *
 * Para trocar pelo Melhor Envio, criar `MelhorEnvioShippingProvider` com esta
 * mesma interface e trocar a instância em `infra/index.ts`.
 */
export class TableShippingProvider implements ShippingProvider {
  async quote({
    postalCode,
    subtotal,
  }: {
    postalCode: string
    subtotal: PriceInCents
  }): Promise<ShippingQuote> {
    if (!isValidPostalCode(postalCode)) {
      throw new InvalidPostalCodeError()
    }

    const digits = normalizePostalCode(postalCode)
    const firstDigit = digits.charAt(0)
    const row =
      SHIPPING_TABLE.find((entry) => entry.prefixes.includes(firstDigit)) ?? SHIPPING_TABLE[0]

    if (row === undefined) {
      return { postalCode: digits, options: [] }
    }

    const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD

    return {
      postalCode: digits,
      options: [
        {
          id: 'padrao',
          label: qualifiesForFreeShipping ? 'Envio padrão grátis' : 'Envio padrão',
          price: qualifiesForFreeShipping ? 0 : row.standardPrice,
          estimatedDays: row.standardDays,
        },
        {
          id: 'expresso',
          label: 'Envio expresso',
          price: row.expressPrice,
          estimatedDays: row.expressDays,
        },
      ],
    }
  }
}
