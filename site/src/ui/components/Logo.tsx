import { cn } from '@/lib/cn'

/**
 * Marca escrita "Space Watches".
 * O handle `spac.ewatches` é só do Instagram e nunca aparece como nome.
 *
 * `tone` acompanha o fundo onde o logo está: o site é claro, mas hero e rodapé
 * são escuros, e o mesmo par de cores não serve nos dois.
 */
export function Logo({
  className,
  tone = 'light',
}: {
  readonly className?: string
  readonly tone?: 'light' | 'dark'
}) {
  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      <span
        className={cn(
          'font-display text-xl leading-none tracking-tight',
          tone === 'light' ? 'text-ink-950' : 'text-cream',
        )}
      >
        Space
      </span>
      <span className={cn('eyebrow', tone === 'light' ? 'text-gold-700' : 'text-gold-500')}>
        Watches
      </span>
    </span>
  )
}
