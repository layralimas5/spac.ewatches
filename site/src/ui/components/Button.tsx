import { cn } from '@/lib/cn'

/**
 * Variantes de botão.
 *
 * Sufixo `-dark` = botão que vive DENTRO de um bloco escuro (banner, rodapé).
 * Sem sufixo = fundo claro, que é o padrão do site.
 *
 * Com a paleta só em preto, branco e cinza, o CTA principal é o retângulo
 * preto sólido: num site branco ele é o maior contraste possível da tela.
 * Dentro de bloco escuro isso se inverte, lá o cheio é branco.
 */
export type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'ghost'
  | 'primary-dark'
  | 'outline-dark'
  | 'ghost-dark'
export type ButtonSize = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium ' +
  'transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink-950 text-paper hover:bg-ink-800',
  outline: 'border border-ink-950 text-ink-950 hover:bg-ink-950 hover:text-paper',
  ghost: 'text-ink-500 hover:text-ink-950',

  'primary-dark': 'bg-paper text-ink-950 hover:bg-paper-alt',
  'outline-dark': 'border border-cream/40 text-cream hover:bg-cream hover:text-ink-950',
  'ghost-dark': 'text-muted hover:text-cream',
}

const sizes: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-sm',
}

/**
 * Estilo compartilhado entre `<button>` e `<a>`.
 *
 * Um link que navega continua sendo `<a>` e uma ação continua sendo `<button>`,
 * trocar a semântica pra reaproveitar visual quebra teclado e leitor de tela.
 */
export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className)
}
