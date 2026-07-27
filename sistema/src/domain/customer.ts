export interface Customer {
  readonly id: string
  readonly name: string
  /** Só dígitos. A formatação acontece na tela, nunca no dado guardado. */
  readonly phone: string
  readonly email?: string
  readonly document?: string
  readonly city?: string
  readonly state?: string
  /** O que a conversa ensinou: modelo que procura, faixa de preço, jeito de tratar. */
  readonly notes?: string
  readonly createdAt: string
}

export function customerInitials(customer: Customer): string {
  const parts = customer.name.trim().split(/\s+/)
  const first = parts[0]?.charAt(0) ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : ''
  return `${first}${last}`.toUpperCase()
}
