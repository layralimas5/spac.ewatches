import { cn } from '@/lib/cn'
import type { Availability } from '@/domain/watch'

const label: Record<Availability, string> = {
  'pronta-entrega': 'Pronta-entrega',
  'sob-encomenda': 'Sob encomenda',
}

const style: Record<Availability, string> = {
  // Dourado discreto marca o que sai rápido, sem virar selo de promoção.
  // Fundo sólido porque o selo fica sobre a foto do produto, não sobre o card.
  'pronta-entrega': 'border-gold-600/40 bg-paper text-gold-700',
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
