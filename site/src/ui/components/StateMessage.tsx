import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Esqueleto de card, usado enquanto o catálogo carrega. */
export function CardSkeleton({ className }: { readonly className?: string }) {
  return (
    <div
      className={cn('animate-pulse overflow-hidden rounded-lg border border-paper-line', className)}
    >
      {/* Espelha o WatchCard: mesma proporção de foto e mesma altura de botão,
          senão a grade pula quando os dados chegam. */}
      <div className="aspect-square bg-paper-alt" />
      <div className="space-y-2 p-3">
        <div className="h-2.5 w-1/3 rounded bg-paper-alt" />
        <div className="h-4 w-3/4 rounded bg-paper-alt" />
        <div className="h-4 w-1/2 rounded bg-paper-alt" />
        <div className="h-9 w-full rounded-md bg-paper-alt" />
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
      className="flex flex-col items-center rounded-xl border border-paper-line bg-paper-alt px-6 py-14 text-center"
      role={tone === 'error' ? 'alert' : undefined}
    >
      <h2
        className={cn('font-display text-xl', tone === 'error' ? 'text-gold-700' : 'text-ink-950')}
      >
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-500">{description}</p>
      {action !== undefined && <div className="mt-6">{action}</div>}
    </div>
  )
}
