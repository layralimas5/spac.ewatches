type ClassValue = string | false | null | undefined

/** Junta classes condicionais sem arrastar uma dependência só pra isso. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}
