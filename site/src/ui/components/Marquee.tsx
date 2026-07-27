import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'

type MarqueeTone = 'dark' | 'light'

const tones: Record<MarqueeTone, { viewport: string; text: string; dot: string }> = {
  dark: { viewport: 'bg-ink-950', text: 'text-cream/90', dot: 'bg-cream/40' },
  light: {
    viewport: 'border-y border-paper-line bg-paper-alt',
    text: 'text-ink-500',
    dot: 'bg-ink-400/60',
  },
}

interface MarqueeProps {
  readonly items: readonly string[]
  readonly ariaLabel: string
  readonly tone?: MarqueeTone
  /** Duração de uma volta inteira. Quanto maior, mais lento o deslize. */
  readonly durationSeconds?: number
}

function MarqueeList({
  items,
  tone,
  ariaLabel,
  filler = false,
}: {
  readonly items: readonly string[]
  readonly tone: MarqueeTone
  readonly ariaLabel: string
  /** Cópia que só existe para fechar o loop: some da árvore de acessibilidade. */
  readonly filler?: boolean
}) {
  const style = tones[tone]

  return (
    <ul
      className="flex shrink-0 list-none items-center"
      aria-label={filler ? undefined : ariaLabel}
      aria-hidden={filler || undefined}
    >
      {items.map((text) => (
        <li key={text} className="flex items-center gap-6 px-6 py-2 whitespace-nowrap">
          <span className={cn('eyebrow', style.text)}>{text}</span>
          <span className={cn('h-1 w-1 rounded-full', style.dot)} aria-hidden="true" />
        </li>
      ))}
    </ul>
  )
}

/**
 * Faixa de texto em loop infinito para a esquerda.
 *
 * A lista é renderizada duas vezes: a segunda é só o preenchimento que torna o
 * loop contínuo, e por isso sai da árvore de acessibilidade. O leitor de tela
 * lê a faixa uma vez só.
 */
export function Marquee({ items, ariaLabel, tone = 'dark', durationSeconds = 45 }: MarqueeProps) {
  if (items.length === 0) return null

  const trackStyle = { '--marquee-duration': `${durationSeconds}s` } as CSSProperties

  return (
    <div className={cn('marquee-viewport overflow-hidden', tones[tone].viewport)}>
      <div className="marquee-track" style={trackStyle}>
        <MarqueeList items={items} tone={tone} ariaLabel={ariaLabel} />
        <MarqueeList items={items} tone={tone} ariaLabel={ariaLabel} filler />
      </div>
    </div>
  )
}
