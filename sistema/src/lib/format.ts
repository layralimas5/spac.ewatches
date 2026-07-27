import type { Cents } from '@/domain/money'

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

const brlCompact = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

/** Valor em centavos vira "R$ 8.990,00". */
export function formatMoney(value: Cents): string {
  return brl.format(value / 100)
}

/** Sem centavos, para painel: número grande cheio de zeros só atrapalha. */
export function formatMoneyShort(value: Cents): string {
  return brlCompact.format(value / 100)
}

/** Aceita "8990,00", "8.990", "8990.5" e devolve centavos. */
export function parseMoney(input: string): Cents {
  const digits = input.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}\b)/g, '')
  const normalized = digits.replace(',', '.')
  const value = Number(normalized)
  return Number.isFinite(value) ? Math.round(value * 100) : 0
}

const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

export function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '' : dateFormat.format(date)
}

/** "há 3 dias", para listas em que a data exata não importa. */
export function formatRelative(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000)
  if (days <= 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 30) return `há ${days} dias`
  const months = Math.floor(days / 30)
  return months === 1 ? 'há 1 mês' : `há ${months} meses`
}

/** Data de hoje no formato que o `<input type="date">` entende. */
export function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1).replace('.', ',')}%`
}

/** (11) 98765-4321, tolerante a número incompleto. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

/** Link de conversa com o cliente, no formato internacional. */
export function whatsappLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '')
  const withCountry = digits.length <= 11 ? `55${digits}` : digits
  const query = message === undefined ? '' : `?text=${encodeURIComponent(message)}`
  return `https://wa.me/${withCountry}${query}`
}
