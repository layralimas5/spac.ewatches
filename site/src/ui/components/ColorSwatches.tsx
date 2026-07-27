import type { WatchColor } from '@/domain/watch'
import { cn } from '@/lib/cn'

/**
 * Bolinhas de cor da peça.
 *
 * São informativas, não um seletor: cada cor tem preço e estoque próprios, e
 * fingir que dá pra trocar a cor no card levaria o cliente a pedir uma peça
 * que talvez não esteja em mãos. Quando cada variação virar registro no
 * catálogo, a bolinha passa a ser link para a variação.
 *
 * A borda existe para a bolinha branca não sumir no fundo branco do card.
 */
export function ColorSwatches({
  colors,
  size = 'sm',
  className,
}: {
  readonly colors: readonly WatchColor[]
  readonly size?: 'sm' | 'md'
  readonly className?: string
}) {
  if (colors.length === 0) return null

  return (
    <ul
      className={cn('flex list-none flex-wrap items-center gap-1.5', className)}
      aria-label={colors.length === 1 ? 'Cor disponível' : 'Cores disponíveis'}
    >
      {colors.map((color) => (
        <li key={color.name}>
          <span
            className={cn(
              'block rounded-full border border-paper-line',
              size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5',
            )}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          >
            <span className="sr-only">{color.name}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
