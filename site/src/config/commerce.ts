/**
 * Regras comerciais da loja.
 *
 * ⚠️ VALORES PROVISÓRIOS. Frete e desconto abaixo foram escolhidos como
 * ponto de partida, não vieram da operação da Space Watches. Antes de o site
 * ir ao ar, a loja precisa confirmar cada número aqui, o cliente vê estes
 * valores como promessa.
 */

/** Desconto no Pix, em pontos percentuais. `0` desliga o desconto. */
export const PIX_DISCOUNT_PERCENT = 5

/** Acima deste subtotal o frete sai de graça. Em centavos. */
export const FREE_SHIPPING_THRESHOLD = 100000

/**
 * Tabela de frete por região, indexada pelo primeiro dígito do CEP.
 * Substituir por cotação real (Melhor Envio / Correios), ver
 * `infra/shipping/`.
 */
export const SHIPPING_TABLE: ReadonlyArray<{
  readonly prefixes: readonly string[]
  readonly region: string
  readonly standardPrice: number
  readonly standardDays: number
  readonly expressPrice: number
  readonly expressDays: number
}> = [
  {
    prefixes: ['0', '1'],
    region: 'São Paulo',
    standardPrice: 2490,
    standardDays: 4,
    expressPrice: 4990,
    expressDays: 2,
  },
  {
    prefixes: ['2', '3'],
    region: 'Rio de Janeiro, Espírito Santo e Minas Gerais',
    standardPrice: 2990,
    standardDays: 6,
    expressPrice: 5990,
    expressDays: 3,
  },
  {
    prefixes: ['4', '5'],
    region: 'Bahia, Sergipe, Pernambuco, Alagoas e Paraíba',
    standardPrice: 3990,
    standardDays: 9,
    expressPrice: 7990,
    expressDays: 5,
  },
  {
    prefixes: ['6', '7'],
    region: 'Norte, Nordeste e Centro-Oeste',
    standardPrice: 4490,
    standardDays: 11,
    expressPrice: 8990,
    expressDays: 6,
  },
  {
    prefixes: ['8', '9'],
    region: 'Sul',
    standardPrice: 3290,
    standardDays: 7,
    expressPrice: 6490,
    expressDays: 4,
  },
]
