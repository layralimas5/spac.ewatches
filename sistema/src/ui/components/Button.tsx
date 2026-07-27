import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ' +
  'disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink-950 text-cream hover:bg-ink-800',
  outline: 'border border-paper-line bg-paper text-ink-950 hover:border-ink-950',
  ghost: 'text-ink-500 hover:bg-paper-alt hover:text-ink-950',
  danger: 'border border-negative/30 bg-paper text-negative hover:bg-negative hover:text-cream',
}

const sizes: Record<ButtonSize, string> = {
  // 44px de altura no `md`: o mínimo confortável para o dedo.
  md: 'h-11 px-4 text-sm',
  sm: 'h-9 px-3 text-xs',
}

export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className)
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant
  readonly size?: ButtonSize
  readonly children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    // `type` explícito: sem isso, todo botão dentro de formulário vira "enviar".
    <button type={type} className={buttonStyles(variant, size, className)} {...props}>
      {children}
    </button>
  )
}

/** Botão só de ícone. Alvo de 40px e rótulo obrigatório para leitor de tela. */
export function IconButton({
  label,
  children,
  className,
  onClick,
  tone = 'neutral',
}: {
  readonly label: string
  readonly children: ReactNode
  readonly className?: string
  readonly onClick: () => void
  readonly tone?: 'neutral' | 'danger'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
        tone === 'danger'
          ? 'text-ink-400 hover:bg-negative-soft hover:text-negative'
          : 'text-ink-400 hover:bg-paper-alt hover:text-ink-950',
        className,
      )}
    >
      {children}
    </button>
  )
}
