import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'outline' | 'ghost'
export type ButtonSize = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium ' +
  'transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none'

const variants: Record<ButtonVariant, string> = {
  // Dourado sólido com texto escuro: o único botão cheio da marca, reservado ao CTA principal.
  primary: 'bg-gold-500 text-ink-950 hover:bg-gold-400',
  outline: 'border border-gold-600 text-gold-400 hover:bg-gold-500/10',
  ghost: 'text-muted hover:text-cream',
}

const sizes: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
}

/**
 * Estilo compartilhado entre `<button>` e `<a>`.
 *
 * Um link que navega continua sendo `<a>` e uma ação continua sendo `<button>` —
 * trocar a semântica pra reaproveitar visual quebra teclado e leitor de tela.
 */
export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className)
}
