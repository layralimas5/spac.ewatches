import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Esqueleto de card, usado enquanto o catálogo carrega. */
export function CardSkeleton({ className }: { readonly className?: string }) {
  return (
    <div className={cn('animate-pulse overflow-hidden rounded-xl border border-ink-700', className)}>
      <div className="aspect-4/5 bg-ink-800" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 rounded bg-ink-800" />
        <div className="h-4 w-3/4 rounded bg-ink-800" />
        <div className="h-4 w-1/2 rounded bg-ink-800" />
      </div>
    </div>
  )
}

interface StateMessageProps {
  readonly title: string
  readonly description: string
  readonly action?: ReactNode
  readonly tone?: 'neutral' | 'error'
}

/** Estado vazio ou de erro — sempre com uma saída, nunca um beco sem ação. */
export function StateMessage({ title, description, action, tone = 'neutral' }: StateMessageProps) {
  return (
    <div
      className="flex flex-col items-center rounded-xl border border-ink-700 bg-ink-900 px-6 py-14 text-center"
      role={tone === 'error' ? 'alert' : undefined}
    >
      <h2 className={cn('font-display text-xl', tone === 'error' ? 'text-gold-400' : 'text-cream')}>
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      {action !== undefined && <div className="mt-6">{action}</div>}
    </div>
  )
}
