export interface Settings {
  /** Nome de quem opera, mostrado no topo. */
  readonly operatorName: string
  readonly storeName: string
  /** WhatsApp da loja, só dígitos, com DDI. */
  readonly storePhone: string
  /** Estoque mínimo sugerido ao cadastrar peça nova. */
  readonly defaultMinStock: number
}

export const defaultSettings: Settings = {
  operatorName: 'Space Watches',
  storeName: 'Space Watches',
  storePhone: '',
  defaultMinStock: 1,
}

export function operatorInitials(settings: Settings): string {
  const parts = settings.operatorName.trim().split(/\s+/)
  const first = parts[0]?.charAt(0) ?? 'S'
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : ''
  return `${first}${last}`.toUpperCase()
}
