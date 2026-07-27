import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type Tone = 'neutral' | 'positive' | 'negative' | 'attention' | 'info'

const toneStyles: Record<Tone, string> = {
  neutral: 'bg-paper-alt text-ink-700 border-paper-line',
  positive: 'bg-positive-soft text-positive border-positive/20',
  negative: 'bg-negative-soft text-negative border-negative/20',
  attention: 'bg-attention-soft text-attention border-attention/20',
  info: 'bg-info-soft text-info border-info/20',
}

/** Selo de status. O texto sempre acompanha a cor: cor sozinha não é informação. */
export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  readonly children: ReactNode
  readonly tone?: Tone
  readonly className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Card({
  children,
  className,
}: {
  readonly children: ReactNode
  readonly className?: string
}) {
  return (
    <div className={cn('rounded-xl border border-paper-line bg-paper', className)}>{children}</div>
  )
}

export function CardHeader({
  title,
  description,
  action,
}: {
  readonly title: string
  readonly description?: string
  readonly action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-paper-line px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold text-ink-950">{title}</h2>
        {description !== undefined && <p className="mt-0.5 text-xs text-ink-500">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function PageHeader({
  title,
  description,
  action,
}: {
  readonly title: string
  readonly description?: string
  readonly action?: ReactNode
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-ink-950 sm:text-2xl">{title}</h1>
        {description !== undefined && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-500">{description}</p>
        )}
      </div>
      {action}
    </header>
  )
}

/**
 * Número grande do painel.
 *
 * A variação vem em texto ("+12% vs. mês passado"), não só em cor: quem não
 * distingue verde de vermelho precisa ler a mesma informação.
 */
export function StatCard({
  label,
  value,
  hint,
  tone = 'neutral',
  icon,
}: {
  readonly label: string
  readonly value: string
  readonly hint?: string
  readonly tone?: Tone
  readonly icon?: ReactNode
}) {
  const hintColor: Record<Tone, string> = {
    neutral: 'text-ink-500',
    positive: 'text-positive',
    negative: 'text-negative',
    attention: 'text-attention',
    info: 'text-info',
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-ink-500 uppercase">{label}</p>
        {icon !== undefined && <span className="text-ink-400">{icon}</span>}
      </div>
      <p className="tabular mt-3 text-2xl font-semibold text-ink-950">{value}</p>
      {hint !== undefined && <p className={cn('mt-1 text-xs', hintColor[tone])}>{hint}</p>}
    </Card>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  readonly title: string
  readonly description: string
  readonly action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <p className="text-sm font-medium text-ink-950">{title}</p>
      <p className="max-w-sm text-sm leading-relaxed text-ink-500">{description}</p>
      {action}
    </div>
  )
}

/** Rolagem horizontal própria: tabela larga não pode empurrar a página inteira. */
export function TableWrap({ children }: { readonly children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[42rem] border-collapse text-sm">{children}</table>
    </div>
  )
}

export function Th({
  children,
  className,
}: {
  readonly children: ReactNode
  readonly className?: string
}) {
  return (
    <th
      scope="col"
      className={cn(
        'border-b border-paper-line px-4 py-3 text-left text-xs font-medium tracking-wide text-ink-500 uppercase',
        className,
      )}
    >
      {children}
    </th>
  )
}

export function Td({
  children,
  className,
}: {
  readonly children: ReactNode
  readonly className?: string
}) {
  return (
    <td className={cn('border-b border-paper-line px-4 py-3 align-middle', className)}>
      {children}
    </td>
  )
}
