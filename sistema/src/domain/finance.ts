import type { Cents } from './money'
import { sumCents } from './money'

export type EntryKind = 'entrada' | 'saida'

export type EntryCategory =
  | 'venda'
  | 'compra'
  | 'frete'
  | 'imposto'
  | 'marketing'
  | 'operacional'
  | 'outros'

export interface FinanceEntry {
  readonly id: string
  readonly kind: EntryKind
  readonly category: EntryCategory
  readonly description: string
  /** Sempre positivo. O que define soma ou subtração é o `kind`, não o sinal. */
  readonly amount: Cents
  /** Data do fato (competência), no formato `AAAA-MM-DD`. */
  readonly date: string
  readonly orderId?: string
}

export const entryCategoryLabel: Record<EntryCategory, string> = {
  venda: 'Venda',
  compra: 'Compra de peça',
  frete: 'Frete',
  imposto: 'Imposto e taxa',
  marketing: 'Marketing',
  operacional: 'Operacional',
  outros: 'Outros',
}

export const entryKindLabel: Record<EntryKind, string> = {
  entrada: 'Entrada',
  saida: 'Saída',
}

/** Categorias que fazem sentido em cada lado do caixa. */
export const categoriesByKind: Record<EntryKind, readonly EntryCategory[]> = {
  entrada: ['venda', 'outros'],
  saida: ['compra', 'frete', 'imposto', 'marketing', 'operacional', 'outros'],
}

export function isInMonth(date: string, reference: Date): boolean {
  const [year, month] = date.split('-')
  return (
    Number(year) === reference.getFullYear() && Number(month) === reference.getMonth() + 1
  )
}

export interface CashSummary {
  readonly income: Cents
  readonly expense: Cents
  readonly balance: Cents
}

export function summarize(entries: readonly FinanceEntry[]): CashSummary {
  const income = sumCents(entries.filter((e) => e.kind === 'entrada').map((e) => e.amount))
  const expense = sumCents(entries.filter((e) => e.kind === 'saida').map((e) => e.amount))
  return { income, expense, balance: income - expense }
}

/** Quanto sobrou de cada real que entrou. */
export function marginPercent(summary: CashSummary): number {
  return summary.income === 0 ? 0 : (summary.balance / summary.income) * 100
}
