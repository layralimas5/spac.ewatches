/**
 * Dinheiro em centavos, sempre inteiro.
 *
 * Preço de relógio é número alto, e somar float acumula erro: `0.1 + 0.2` não
 * dá `0.3` em ponto flutuante. Em centavos, toda conta é de inteiro, e a
 * divisão só acontece na hora de mostrar.
 */
export type Cents = number

export function sumCents(values: readonly Cents[]): Cents {
  return values.reduce((total, value) => total + value, 0)
}

/** Percentual de `part` sobre `whole`. Devolve 0 quando não há base de cálculo. */
export function percentOf(part: number, whole: number): number {
  return whole === 0 ? 0 : (part / whole) * 100
}
