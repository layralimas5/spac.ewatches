import { cn } from '@/lib/cn'
import type { Availability } from '@/domain/watch'

const label: Record<Availability, string> = {
  'pronta-entrega': 'Pronta-entrega',
  'sob-encomenda': 'Sob encomenda',
}

const style: Record<Availability, string> = {
  // Fundo sólido porque o selo fica sobre a foto do produto, não sobre o card.
  // Pronta-entrega leva a borda escura; encomenda fica em cinza, um degrau abaixo.
  'pronta-entrega': 'border-ink-950 bg-paper text-ink-950',
  'sob-encomenda': 'border-paper-line bg-paper text-ink-500',
}

export function AvailabilityBadge({
  availability,
  className,
}: {
  readonly availability: Availability
  readonly className?: string
}) {
  return (
    <span
      className={cn(
        'eyebrow inline-flex items-center rounded-full border px-2.5 py-1',
        style[availability],
        className,
      )}
    >
      {label[availability]}
    </span>
  )
}
